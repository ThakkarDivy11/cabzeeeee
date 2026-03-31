const express = require('express');
const { body, validationResult } = require('express-validator');
const Ride = require('../models/Ride');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { getIO } = require('../socket');

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

router.post('/', [
  body('pickupLocation.address').exists().withMessage('Pickup address is required'),
  body('dropLocation.address').exists().withMessage('Drop address is required'),
  body('fare').isNumeric().withMessage('Fare must be a number')
], protect, validateRequest, async (req, res) => {
  console.log(`🚀 RIDE CREATION ATTEMPTED by ${req.user.name} (${req.user.role})`);
  console.log('Ride Data:', JSON.stringify(req.body, null, 2));
  try {
    if (req.user.role !== 'rider') {
      return res.status(403).json({
        success: false,
        message: 'Only riders can create ride requests'
      });
    }

    const ride = new Ride({
      rider: req.user._id,
      pickupLocation: req.body.pickupLocation,
      dropLocation: req.body.dropLocation,
      fare: req.body.fare,
      distance: req.body.distance || 0,
      estimatedTime: req.body.estimatedTime || 0,
      vehicleType: req.body.vehicleType || 'car',
      paymentMethod: req.body.paymentMethod || 'cash',
      specialInstructions: req.body.specialInstructions || '',
      status: 'pending'
    });

    await ride.save();
    console.log(`✅ RIDE SAVED: ${ride._id}`);
    await ride.populate('rider', 'name email phone rating');

    res.status(201).json({
      success: true,
      message: 'Ride request created successfully',
      data: ride
    });
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during ride creation'
    });
  }
});

router.get('/pending', protect, async (req, res) => {
  console.log(`🔍 PENDING RIDES FETCHED by ${req.user.name} (Status: ${req.user.driverStatus})`);
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({
        success: false,
        message: 'Only drivers can view pending rides'
      });
    }

    if (req.user.driverStatus !== 'online') {
      return res.json({
        success: true,
        message: 'Driver must be online to receive ride requests',
        data: []
      });
    }

    const query = {
      status: 'pending'
    };

    if (req.user.vehicleInfo?.vehicleType) {
      query.vehicleType = req.user.vehicleInfo.vehicleType;
    }

    const rides = await Ride.find(query)
      .populate('rider', 'name email phone rating')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: rides
    });
  } catch (error) {
    console.error('Get pending rides error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.put('/:rideId/accept', protect, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({
        success: false,
        message: 'Only drivers can accept rides'
      });
    }

    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Ride is no longer available'
      });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    ride.driver = req.user._id;
    ride.status = 'accepted';
    ride.acceptedAt = new Date();
    ride.pickupOTP = otp;
    ride.otpVerified = false;
    await ride.save();

    req.user.driverStatus = 'busy';
    await req.user.save();

    await ride.populate('rider', 'name email phone rating');
    await ride.populate('driver', 'name phone rating vehicleInfo');

    res.json({
      success: true,
      message: 'Ride accepted successfully',
      data: ride
    });
  } catch (error) {
    console.error('Accept ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.put('/:rideId/reject', protect, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({
        success: false,
        message: 'Only drivers can reject rides'
      });
    }

    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Ride is no longer available'
      });
    }

    ride.status = 'rejected';
    await ride.save();

    res.json({
      success: true,
      message: 'Ride rejected'
    });
  } catch (error) {
    console.error('Reject ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.put('/:rideId/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['on_board', 'started', 'picked-up', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    const isDriver = req.user.role === 'driver' && ride.driver?.toString() === req.user._id.toString();
    const isRider = req.user.role === 'rider' && ride.rider?.toString() === req.user._id.toString();

    if (!isDriver && !isRider) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    ride.status = status;
    if (status === 'started') ride.startedAt = new Date();
    if (status === 'picked-up') ride.pickedUpAt = new Date();
    if (status === 'completed') {
      ride.completedAt = new Date();
      // Increment totalRides for driver
      if (ride.driver) {
        await User.findByIdAndUpdate(ride.driver, { $inc: { totalRides: 1 } });
      }
      // Increment totalRides for rider
      if (ride.rider) {
        await User.findByIdAndUpdate(ride.rider, { $inc: { totalRides: 1 } });
      }
      // Set driver back to online if they were the ones completing it
      if (ride.driver && isDriver) {
        const driver = await User.findById(ride.driver);
        if (driver) {
          driver.driverStatus = 'online';
          await driver.save();
          console.log(`✅ Driver ${ride.driver} set back to online after trip completion`);
        }
      }
    }
    if (status === 'cancelled') {
      ride.cancelledAt = new Date();
      ride.cancelledBy = req.user.role;
      if (isDriver) {
        req.user.driverStatus = 'online';
        await req.user.save();
      }
    }

    await ride.save();
    await ride.populate('rider', 'name email phone rating');
    await ride.populate('driver', 'name phone rating vehicleInfo');

    // Notify all participants in the ride room of the status update
    try {
      const io = getIO();
      io.to(`ride-${req.params.rideId}`).emit('status-updated', { 
        status: status,
        ride: ride
      });
      console.log(`📡 Socket: Status updated to ${status} for ride ${req.params.rideId}`);
    } catch (socketErr) {
      console.warn('Socket emit error (non-fatal):', socketErr.message);
    }

    res.json({
      success: true,
      message: `Ride status updated to ${status}`,
      data: ride
    });
  } catch (error) {
    console.error('Update ride status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/my-rides', protect, async (req, res) => {
  try {
    const rides = await Ride.find({
      $or: [
        { rider: req.user._id },
        { driver: req.user._id }
      ]
    })
      .populate('rider', 'name email phone rating')
      .populate('driver', 'name phone rating vehicleInfo')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: rides
    });
  } catch (error) {
    console.error('Get my rides error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/driver-rides', protect, async (req, res) => {
  try {
    console.log(`ACCESSING DRIVER RIDES: user=${req.user._id} role=${req.user.role}`);
    if (req.user.role !== 'driver') {
      return res.status(403).json({
        success: false,
        message: 'Only drivers can view driver rides'
      });
    }

    console.log(`FETCHING DRIVER RIDES for user: ${req.user._id}`);
    const rides = await Ride.find({
      driver: req.user._id
    })
      .populate('rider', 'name email phone rating')
      .sort({ createdAt: -1 })
      .limit(50);
    console.log(`FOUND ${rides.length} RIDES`);

    res.json({
      success: true,
      data: rides
    });
  } catch (error) {
    console.error('Get driver rides error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

router.get('/earnings', protect, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({
        success: false,
        message: 'Only drivers can view earnings'
      });
    }

    const { period = 'today' } = req.query;
    const now = new Date();

    const getStartDate = (p) => {
      const d = new Date(now);
      if (p === 'today') return new Date(d.setHours(0, 0, 0, 0));
      if (p === 'week') return new Date(d.setDate(d.getDate() - 7));
      if (p === 'month') return new Date(d.setMonth(d.getMonth() - 1));
      return new Date(0);
    };

    const startDate = getStartDate(period);

    // Fetch rides for the requested period for recentRides
    const periodRides = await Ride.find({
      driver: req.user._id,
      status: 'completed',
      completedAt: { $gte: startDate }
    }).sort({ completedAt: -1 });

    // Fetch ALL completed rides for total earnings calculation
    const allCompletedRides = await Ride.find({
      driver: req.user._id,
      status: 'completed'
    });

    const earnings = {
      today: 0,
      week: 0,
      month: 0,
      total: 0
    };

    const todayStart = getStartDate('today');
    const weekStart = getStartDate('week');
    const monthStart = getStartDate('month');

    allCompletedRides.forEach(ride => {
      const completedAt = new Date(ride.completedAt);
      earnings.total += ride.fare;
      if (completedAt >= todayStart) earnings.today += ride.fare;
      if (completedAt >= weekStart) earnings.week += ride.fare;
      if (completedAt >= monthStart) earnings.month += ride.fare;
    });

    const recentRides = periodRides.slice(0, 10).map(ride => ({
      fare: ride.fare,
      date: ride.completedAt,
      rider: ride.rider?.name || 'Unknown'
    }));

    res.json({
      success: true,
      data: {
        earnings,
        recentRides
      }
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});
// Get active ride for current logged in user (Rider or Driver)
router.get('/active', protect, async (req, res) => {
  try {
    console.log(`FETCHING ACTIVE RIDE for user: ${req.user._id}`);
    const activeRide = await Ride.findOne({
      $or: [
        { rider: req.user._id },
        { driver: req.user._id }
      ],
      status: { $in: ['pending', 'accepted', 'on_board', 'started', 'picked-up'] }
    })
      .populate('rider', 'name email phone rating profilePicture')
      .populate('driver', 'name phone rating vehicleInfo profilePicture')
      .sort({ createdAt: -1 });
    
    console.log(`ACTIVE RIDE FOUND: ${activeRide ? activeRide._id : 'NONE'}`);

    res.json({
      success: true,
      data: activeRide
    });
  } catch (error) {
    console.error('Get active ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get ride statistics for current user
router.get('/stats', protect, async (req, res) => {
  console.log('Stats route hit for user:', req.user._id);
  try {
    console.log('Querying total trips...');
    const totalTrips = await Ride.countDocuments({
      $or: [
        { rider: req.user._id },
        { driver: req.user._id }
      ]
    });
    console.log('Total trips found:', totalTrips);

    console.log('Querying completed trips...');
    const completedTrips = await Ride.countDocuments({
      $or: [
        { rider: req.user._id },
        { driver: req.user._id }
      ],
      status: 'completed'
    });
    console.log('Completed trips found:', completedTrips);

    res.json({
      success: true,
      data: {
        totalTrips,
        completedTrips,
        rating: req.user.rating || 5.0
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single ride by ID
router.get('/:rideId', protect, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId)
      .populate('rider', 'name email phone rating profilePicture')
      .populate('driver', 'name phone rating vehicleInfo profilePicture');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check if user is authorized to view this ride
    const isRider = ride.rider?._id.toString() === req.user._id.toString();
    const isDriver = ride.driver?._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isRider && !isDriver && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this ride'
      });
    }

    // Only show OTP to rider and driver
    const rideData = ride.toObject();
    if (!isRider && !isDriver && !isAdmin) {
      delete rideData.pickupOTP;
    }

    res.json({
      success: true,
      data: rideData
    });
  } catch (error) {
    console.error('Get ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update driver location
router.put('/:rideId/location', protect, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({
        success: false,
        message: 'Only drivers can update location'
      });
    }

    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    ride.currentDriverLocation = {
      latitude,
      longitude,
      timestamp: new Date()
    };

    ride.locationHistory.push({
      latitude,
      longitude,
      timestamp: new Date()
    });

    await ride.save();

    res.json({
      success: true,
      message: 'Location updated',
      data: {
        latitude,
        longitude,
        timestamp: ride.currentDriverLocation.timestamp
      }
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Verify OTP
router.post('/:rideId/verify-otp', protect, async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({
        success: false,
        message: 'Only drivers can verify OTP'
      });
    }

    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP is required'
      });
    }

    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (ride.otpVerified) {
      return res.json({
        success: true,
        message: 'OTP already verified'
      });
    }

    if (ride.pickupOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    ride.otpVerified = true;
    ride.status = 'on_board';
    ride.onBoardAt = new Date();
    await ride.save();

    // Notify rider in real-time via socket
    try {
      const io = getIO();
      io.to(`ride-${req.params.rideId}`).emit('status-updated', { status: 'on_board' });
      io.to(`ride-${req.params.rideId}`).emit('otp-verification-success', { rideId: req.params.rideId });
      console.log(`🚗 Ride ${req.params.rideId} marked on_board, rider notified via socket`);
    } catch (socketErr) {
      console.warn('Socket emit error (non-fatal):', socketErr.message);
    }

    res.json({
      success: true,
      message: 'OTP verified successfully. Ride is now on board!',
      data: { otpVerified: true, status: 'on_board' }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Rate a completed ride
router.post('/:rideId/rate', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5')
], validateRequest, async (req, res) => {
  try {
    const { rating } = req.body;
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    if (ride.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only rate completed rides' });
    }

    const isRider = req.user.role === 'rider' && ride.rider.toString() === req.user._id.toString();
    const isDriver = req.user.role === 'driver' && ride.driver.toString() === req.user._id.toString();

    if (!isRider && !isDriver) {
      return res.status(403).json({ success: false, message: 'Unauthorized to rate this ride' });
    }

    // Determine the target user to rate
    const targetUserId = isRider ? ride.driver : ride.rider;
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Target user not found' });
    }

    if (isRider) {
      if (ride.driverRating) {
        return res.status(400).json({ success: false, message: 'You have already rated this driver' });
      }
      ride.driverRating = rating;
    } else {
      if (ride.riderRating) {
        return res.status(400).json({ success: false, message: 'You have already rated this rider' });
      }
      ride.riderRating = rating;
    }

    await ride.save();

    // Update target user's average rating
    // Formula: newAverage = ((oldAverage * totalRatings) + newRating) / (totalRatings + 1)
    const totalRatings = targetUser.totalRatings || 0;
    const oldAverage = targetUser.rating || 5.0; // Default to 5.0 if not rated yet

    // Total accumulated rating points before this rating
    const totalRatingPoints = (totalRatings === 0 && oldAverage === 5.0) ? 0 : (oldAverage * totalRatings);

    const newAverage = (totalRatingPoints + rating) / (totalRatings + 1);

    targetUser.rating = parseFloat(newAverage.toFixed(1));
    targetUser.totalRatings = totalRatings + 1;
    await targetUser.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: {
        rideId: ride._id,
        newAverage: targetUser.rating
      }
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

