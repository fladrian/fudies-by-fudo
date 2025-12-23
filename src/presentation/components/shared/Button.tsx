import { tw } from '@presentation/utils/tw'
import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react'

interface ButtonProps extends PropsWithChildren, ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: ReactNode
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  leftIcon,
  className = '',
  ...props
}: ButtonProps) => {
  const hasIcons = !!leftIcon
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed uppercase'
  const iconGap = hasIcons ? 'gap-2' : ''

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-none',
    danger: 'bg-error text-white hover:opacity-80 focus:ring-error',
    secondary: 'text-primary hover:text-primary-hover border border-primary focus:ring-none',
    ghost: 'text-primary hover:text-primary-hover focus:ring-none',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  const spinnerSize = size === 'sm' ? 'size-3' : size === 'lg' ? 'size-5' : 'size-4'
  const spinnerMargin = size === 'sm' ? 'mr-1.5' : 'mr-2'

  const spinner = (
    <svg
      className={`animate-spin ${spinnerMargin} ${spinnerSize}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )

  return (
    <button
      className={tw(baseStyles, iconGap, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && spinner}

      {!isLoading && leftIcon}

      <div className="leading-none">{children}</div>
    </button>
  )
}
