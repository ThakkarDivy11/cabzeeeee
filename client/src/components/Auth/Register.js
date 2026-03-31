import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import authService from '../../services/authService';

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
    defaultValues: {
      role: 'rider'
    }
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
        // Redirect to OTP verification page
        setTimeout(() => {
          navigate('/verify-otp', { state: { email: data.email } });
        }, 2000);
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
      <div className="text-center py-4">
        <div
          className="mx-auto flex items-center justify-center h-14 w-14 rounded-2xl bg-green-100 mb-5"
          style={{ animation: 'springPop 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
        >
          <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Account Created!</h2>
        <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
          Check your email for a verification code, then confirm your account to get started.
        </p>
        <p className="mt-5 text-xs text-slate-400">Redirecting to verification...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-7">
        <h2 
          className="text-[26px] font-bold tracking-tight text-slate-900"
          style={{ fontFamily: 'Syne, sans-serif' }}
        >
          Join CabZee
        </h2>
        <p className="text-[13px] mt-1 text-slate-500 mb-8">
          Start your journey today·{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            or sign in instead
          </Link>
        </p>
      </div>

      {/* Role Selector */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3 text-center text-slate-400">
          I want to join as a
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[{
            id: 'rider', label: 'Rider', desc: 'Book rides & travel',
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          }, {
            id: 'driver', label: 'Driver', desc: 'Earn money driving',
            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          }].map((role) => {
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleChange(role.id)}
                className="relative p-4 rounded-2xl border-2 text-left transition-all duration-200 overflow-hidden"
                style={{
                  borderColor: isSelected ? '#3B82F6' : '#F1F5F9',
                  background: isSelected ? '#EFF6FF' : '#F8FAFC',
                }}
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center mb-8 transition-colors duration-200"
                  style={{
                    background: isSelected ? '#3B82F6' : '#E2E8F0',
                    color: isSelected ? '#FFFFFF' : '#94A3B8',
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">{role.icon}</svg>
                </div>
                <p 
                  className="font-bold text-sm transition-colors"
                  style={{ color: isSelected ? '#1E3A8A' : '#64748B' }}
                >
                  {role.label}
                </p>
                <p 
                  className="text-[11px] mt-0.5 transition-colors"
                  style={{ color: isSelected ? '#60A5FA' : '#94A3B8' }}
                >
                  {role.desc}
                </p>
                {isSelected && (
                  <div
                    className="absolute top-4 right-4 w-[18px] h-[18px] rounded-full flex items-center justify-center bg-blue-500"
                    style={{ animation: 'springPop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
                  >
                    <svg className="w-[10px] h-[10px]" fill="#FFFFFF" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5 text-slate-500">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              id="name" type="text" autoComplete="name" {...register('name')}
              placeholder="Your full name"
              className="block w-full pl-10 pr-4 py-3 bg-[#EEF2F6] border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm text-slate-900 transition-all outline-none"
              style={{
                borderColor: errors.name ? '#EF4444' : undefined,
                '--tw-placeholder-color': '#94A3B8',
              }}
            />
          </div>
          {errors.name && <p className="mt-1.5 text-[11px] font-medium flex items-center gap-1 text-red-500"><svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5 text-slate-500">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <input
              id="email" type="email" autoComplete="email" {...register('email')}
              placeholder="you@example.com"
              className="block w-full pl-10 pr-4 py-3 bg-[#EEF2F6] border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm text-slate-900 transition-all outline-none"
              style={{
                borderColor: errors.email ? '#EF4444' : undefined,
                '--tw-placeholder-color': '#94A3B8',
              }}
            />
          </div>
          {errors.email && <p className="mt-1.5 text-[11px] font-medium flex items-center gap-1 text-red-500"><svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5 text-slate-500">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <input
              id="phone" type="tel" autoComplete="tel" {...register('phone')}
              placeholder="+91 9876543210"
              className="block w-full pl-10 pr-4 py-3 bg-[#EEF2F6] border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-sm text-slate-900 transition-all outline-none"
              style={{
                borderColor: errors.phone ? '#EF4444' : undefined,
                '--tw-placeholder-color': '#94A3B8',
              }}
            />
          </div>
          {errors.phone && <p className="mt-1.5 text-[11px] font-medium flex items-center gap-1 text-red-500"><svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="profilePicture" className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5 text-slate-500">
            Profile Picture (Optional)
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-[#EEF2F6] overflow-hidden flex items-center justify-center border-2 border-transparent">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <svg className="h-6 w-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <label className="cursor-pointer bg-white py-2 px-3 border border-slate-200 rounded-lg shadow-sm text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 inline-block transition-colors">
                <span>Upload a photo</span>
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
          </div>
          {errors.profilePicture && (
            <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.profilePicture.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5 text-slate-500">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password" type="password" autoComplete="new-password" {...register('password')}
                placeholder="••••••"
                className="block w-full pl-10 pr-4 py-3 bg-[#EEF2F6] border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-[18px] tracking-[0.2em] text-slate-900 transition-all outline-none"
                style={{
                  borderColor: errors.password ? '#EF4444' : undefined,
                }}
              />
            </div>
            {errors.password && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-[10px] font-bold uppercase tracking-[0.1em] mb-1.5 text-slate-500">
              Confirm
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <input
                id="confirmPassword" type="password" autoComplete="new-password" {...register('confirmPassword')}
                placeholder="••••••"
                className="block w-full pl-10 pr-4 py-3 bg-[#EEF2F6] border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-xl text-[18px] tracking-[0.2em] text-slate-900 transition-all outline-none"
                style={{
                  borderColor: errors.confirmPassword ? '#EF4444' : undefined,
                }}
              />
            </div>
            {errors.confirmPassword && <p className="mt-1.5 text-[11px] text-red-500 font-medium">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <input type="hidden" {...register('role')} />

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-semibold text-white
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B1B3D]/30
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-[0.98] transition-transform hover:-translate-y-0.5"
            style={{
              background: '#0B1B3D',
              boxShadow: '0 8px 16px rgba(11,27,61,0.15)',
            }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating your account...
              </>
            ) : (
              <>
                Get Started
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
