import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, User as UserIcon, Car } from 'lucide-react';
import authService from '../../services/authService';
import ThemeButton from '../ui/ThemeButton';
import ThemeInput from '../ui/ThemeInput';
import { motion } from 'framer-motion';

const schema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
  role: yup.string().oneOf(['rider', 'driver', 'admin'], 'Invalid role').required('Role is required'),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'rider' },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      if (response.success) {
        toast.success('Welcome back!');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        switch (response.data.user.role) {
          case 'rider': navigate('/rider'); break;
          case 'driver': navigate('/driver'); break;
          default: navigate('/dashboard');
        }
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'rider', label: 'Rider', desc: 'Book rides', icon: UserIcon },
    { id: 'driver', label: 'Driver', desc: 'Earn money', icon: Car },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Heading */}
      <div className="text-center space-y-2">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold tracking-tight text-[var(--text-main)]"
        >
          Welcome Back
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-[var(--text-muted)]"
        >
          Sign in to your CabZee portal ·{' '}
          <Link
            to="/register"
            className="font-bold text-primary hover:underline underline-offset-4 transition-all"
          >
            Create account
          </Link>
        </motion.p>
      </div>

      {/* Role selector */}
      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center text-[var(--text-muted)]">
          Account Type
        </p>
        <div className="grid grid-cols-2 gap-4">
          {roles.map((role) => {
            const isSelected = selectedRole === role.id;
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setValue('role', role.id)}
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
                    layoutId="role-check"
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

      <input type="hidden" {...register('role')} />

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <ThemeInput
          label="Email Address"
          placeholder="your@cabzee.com"
          type="email"
          icon={Mail}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="space-y-1">
          <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <ThemeInput
            placeholder="••••••••"
            type="password"
            icon={Lock}
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <ThemeButton
          type="submit"
          disabled={isLoading}
          className="w-full py-4"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Authenticating...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Continue to Dashboard
              <ArrowRight size={18} />
            </div>
          )}
        </ThemeButton>
      </form>
    </div>
  );
};

export default Login;
