/**
 * Input Component
 */

import { forwardRef } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const Input = forwardRef(({
  type = 'text',
  label,
  error,
  helperText,
  className,
  icon,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full bg-card border border-gray-700 rounded-lg px-4 py-3',
            'text-text-primary placeholder-text-muted',
            'focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary',
            'transition-all duration-200',
            error && 'border-error focus:border-error focus:ring-error',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-text-muted">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
