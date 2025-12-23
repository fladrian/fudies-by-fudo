import type { ButtonHTMLAttributes } from 'react'
import { Button } from './Button'

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  icon: React.ReactNode
  'aria-label': string
}

export const IconButton = ({
  variant = 'ghost',
  size = 'sm',
  isLoading = false,
  icon,
  'aria-label': ariaLabel,
  className = '',
  ...props
}: IconButtonProps) => {
  const paddingStyles = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  }

  return (
    <Button
      variant={variant}
      size={size}
      isLoading={isLoading}
      className={`${paddingStyles[size]} ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      {!isLoading && icon}
    </Button>
  )
}
