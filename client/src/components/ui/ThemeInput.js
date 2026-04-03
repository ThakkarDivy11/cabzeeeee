import React, { forwardRef } from 'react';

const ThemeInput = forwardRef(({ 
  label, 
  type = 'text', 
  placeholder, 
  required = false, 
  error, 
  className = '', 
  icon: Icon,
  ...props 
}, ref) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-primary transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl py-3.5 
                      ${Icon ? 'pl-11 pr-4' : 'px-4'} 
                      text-sm font-semibold text-[var(--text-main)] placeholder:text-[var(--text-muted)]/50
                      focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 
                      transition-all duration-300 hover:border-primary/30
                      ${error ? 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="text-[10px] font-bold text-red-500 ml-1">{error}</span>}
    </div>
  );
});

ThemeInput.displayName = 'ThemeInput';

export default ThemeInput;
