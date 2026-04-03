import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { User as UserIcon, Mail, Phone, Lock, Camera, ArrowRight, Car, CheckCircle2 } from 'lucide-react';
import authService from '../../services/authService';
import ThemeButton from '../ui/ThemeButton';
import ThemeInput from '../ui/ThemeInput';
import { motion, AnimatePresence } from 'framer-motion';

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phone: yup.string().matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').required('Phone number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
  role: yup.string().oneOf(['rider', 'driver', 'admin'], 'Invalid role').required('Role is required'),
  profilePicture: yup.mixed().optional()
});

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'rider' }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('password', data.password);
      formData.append('role', data.role);

      if (data.profilePicture && data.profilePicture[0]) {
        formData.append('profilePicture', data.profilePicture[0]);
      }

      const response = await authService.register(formData);

      if (response.success) {
        toast.success('Registration successful! Please verify your email.');
        setRegistrationSuccess(true);
        setTimeout(() => {
          navigate('/verify-otp', { state: { email: data.email } });
        }, 2500);
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    setValue('role', role);
  };

  if (registrationSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10 space-y-6"
      >
        <div className="mx-auto w-20 h-20 rounded-3xl bg-green-500/20 flex items-center justify-center text-green-500 shadow-lg shadow-green-500/20 border border-green-500/30">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
            <h2 className="text-3xl font-black text-[var(--text-main)]">Account Created!</h2>
            <p className="text-[var(--text-muted)] max-w-xs mx-auto leading-relaxed">
            We've sent a verification code to your email. You're almost there!
            </p>
        </div>
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-primary uppercase tracking-widest animate-pulse">
          Redirecting to verification
          <span className="flex gap-1">
            <span className="w-1 h-1 bg-primary rounded-full" />
            <span className="w-1 h-1 bg-primary rounded-full" />
            <span className="w-1 h-1 bg-primary rounded-full" />
          </span>
        </div>
      </motion.div>
    );
  }

  const roles = [
    { id: 'rider', label: 'Rider', desc: 'Book rides', icon: UserIcon },
    { id: 'driver', label: 'Driver', desc: 'Earn money', icon: Car },
  ];

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      {/* Heading */}
      <div className="text-center space-y-2">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold tracking-tight text-[var(--text-main)]"
        >
          Create Account
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-[var(--text-muted)]"
        >
          Join thousands of smart commuters today ·{' '}
          <Link to="/login" className="font-bold text-primary hover:underline underline-offset-4 transition-all">
            Sign in instead
          </Link>
        </motion.p>
      </div>

      {/* Role Selector */}
      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center text-[var(--text-muted)]">
          I want to join as a
        </p>
        <div className="grid grid-cols-2 gap-4">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleChange(role.id)}
                className={`relative p-5 rounded-2xl border text-left transition-all duration-300 overflow-hidden group ${
                  isSelected
                    ? 'glass border-primary/50 shadow-lg shadow-primary/10'
                    : 'border-[var(--border-color)] hover:border-primary/20 bg-white/5'
                }`}
              >
                <div className={`mb-3 p-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-primary text-white' : 'bg-white/5 text-[var(--text-muted)]'}`}>
                  <Icon size={20} />
                </div>
                <p className={`font-bold text-sm ${isSelected ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
                  {role.label}
                </p>
                <p className={`text-[10px] font-medium opacity-60`}>
                  {role.desc}
                </p>
                {isSelected && (
                  <motion.div 
                    layoutId="reg-role-check"
                    className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center bg-primary text-white shadow-lg shadow-primary/30"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Full Name */}
        <ThemeInput
          label="Full Name"
          placeholder="John Doe"
          icon={UserIcon}
          error={errors.name?.message}
          {...register('name')}
        />

        {/* Email */}
        <ThemeInput
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Phone */}
        <ThemeInput
          label="Phone Number"
          type="tel"
          placeholder="+91 9876543210"
          icon={Phone}
          error={errors.phone?.message}
          {...register('phone')}
        />

        {/* Profile Picture */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">
            Profile Picture
          </label>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl glass border border-[var(--border-color)] overflow-hidden flex items-center justify-center shadow-lg group-hover:neon-border transition-all">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera size={20} className="text-[var(--text-muted)]" />
              )}
            </div>
            <label className="flex-1 cursor-pointer glass hover:bg-primary/10 border border-[var(--border-color)] hover:neon-border py-3 px-4 rounded-xl text-center transition-all">
              <span className="text-xs font-bold text-[var(--text-muted)]">Choose Image</span>
              <input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/*"
                className="sr-only"
                {...register('profilePicture', {
                  onChange: (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setPreview(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }
                })}
              />
            </label>
          </div>
          {errors.profilePicture && (
            <p className="text-[10px] font-bold text-red-500 ml-1">{errors.profilePicture.message}</p>
          )}
        </div>

        {/* Passwords */}
        <ThemeInput
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.password?.message}
          {...register('password')}
        />
        <ThemeInput
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <input type="hidden" {...register('role')} />

        {/* Submit */}
        <div className="md:col-span-2 pt-4">
          <ThemeButton
            type="submit"
            disabled={isLoading}
            className="w-full py-4"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Get Started Now
                <ArrowRight size={18} />
              </div>
            )}
          </ThemeButton>
        </div>
      </form>
    </div>
  );
};

export default Register;
