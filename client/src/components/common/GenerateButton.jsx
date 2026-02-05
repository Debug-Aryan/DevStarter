import React from 'react';
import { Zap, ArrowRight, Play } from 'lucide-react';

const GenerateButton = React.forwardRef(({
  onClick,
  label = 'Generate Boilerplate',
  className = '',
  wrapperClassName = '',
  type = 'button',
  disabled = false,
  mobileIcon: MobileIcon,
  mobileIconClassName = '',
  mobileIconAlt = '',
  mobileIconOnly = false,
  ariaLabel,
  ...buttonProps
}, ref) => {
  const labelNormalized = String(label).trim().toLowerCase();
  const isViewDemo = labelNormalized === 'view demo';
  const isTextOnly = labelNormalized === 'back' || labelNormalized === 'reset all' || labelNormalized === 'reset';

  const effectiveAriaLabel = ariaLabel || (mobileIconOnly ? String(label) : undefined);

  return (
    <div className={`flex items-center justify-center p-2 sm:p-4 ${wrapperClassName}`}>
      <button
        ref={ref}
        onClick={onClick}
        type={type}
        disabled={disabled}
        aria-label={effectiveAriaLabel}
        {...buttonProps}
        className={`group relative flex items-center gap-2 sm:gap-3 px-5 py-3 sm:px-8 sm:py-4 bg-[#161B22] border border-gray-700 rounded-full cursor-pointer transition-all duration-300 hover:border-blue-500/50 hover:bg-[#1f2631] active:scale-95 shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 ${mobileIconOnly ? 'gap-0 sm:gap-3' : ''} ${className}`}
      >
        {/* Subtle Background Glow on Hover */}
        <div className="absolute inset-0 rounded-full bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Icons */}
        {mobileIconOnly && MobileIcon && (
          typeof MobileIcon === 'string' ? (
            <img
              src={MobileIcon}
              alt={mobileIconAlt}
              aria-hidden="true"
              draggable="false"
              className={`h-5 w-5 object-contain filter sm:hidden ${mobileIconClassName}`}
            />
          ) : (
            <MobileIcon className={`h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-300 sm:hidden ${mobileIconClassName}`} />
          )
        )}

        {!isTextOnly &&
          (isViewDemo ? (
            <Play className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
          ) : (
            <Zap className="h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
          ))}
        
        {/* Main Text */}
        {mobileIconOnly ? (
          <>
            <span className="sr-only sm:hidden">{label}</span>
            <span className="relative z-10 hidden sm:inline text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
              {label}
            </span>
          </>
        ) : (
          <span className="relative z-10 text-base sm:text-lg font-semibold text-gray-200 group-hover:text-white transition-colors duration-300">
            {label}
          </span>
        )}

        {/* Arrow that slides in on hover */}
        {!isViewDemo && !isTextOnly && (
          <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
        )}
        
        {/* Bottom "Glow Line" - purely decorative for that dark-mode depth */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
});

GenerateButton.displayName = 'GenerateButton';

export default GenerateButton;