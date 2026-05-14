/**
 * Card Component
 */

import { cn } from '../../utils/cn'

export const Card = ({
  children,
  className,
  hover = true,
  padding = 'md',
  ...props
}) => {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-gray-800',
        hover && 'hover:border-secondary transition-all duration-300',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className }) => (
  <div className={cn('mb-4', className)}>{children}</div>
)

export const CardTitle = ({ children, className }) => (
  <h3 className={cn('text-xl font-semibold text-text-primary', className)}>{children}</h3>
)

export const CardDescription = ({ children, className }) => (
  <p className={cn('text-sm text-text-secondary', className)}>{children}</p>
)

export const CardContent = ({ children, className }) => (
  <div className={cn('', className)}>{children}</div>
)

export const CardFooter = ({ children, className }) => (
  <div className={cn('mt-4 pt-4 border-t border-gray-800', className)}>{children}</div>
)
