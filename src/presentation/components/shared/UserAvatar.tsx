import { useState } from 'react'
import { tw } from '@presentation/utils'

interface UserAvatarProps {
  name: string
  avatar?: string | null
  date?: string | Date
  size?: 'sm' | 'md' | 'lg'
  showDate?: boolean
  dateFormatter?: (date: string | Date) => string
  avatarOnly?: boolean
}

const getInitials = (name: string): string => {
  const words = name.trim().split(/\s+/)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].charAt(0).toUpperCase()
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

const sizeClasses = {
  sm: {
    avatar: 'w-8 h-8',
    text: 'text-xs',
    name: 'text-sm',
  },
  md: {
    avatar: 'w-10 h-10',
    text: 'text-sm',
    name: 'text-base',
  },
  lg: {
    avatar: 'w-12 h-12',
    text: 'text-sm',
    name: 'text-base',
  },
}

export const UserAvatar = ({
  name,
  avatar,
  date,
  size = 'md',
  showDate = false,
  dateFormatter,
  avatarOnly = false,
}: UserAvatarProps) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const initials = getInitials(name)
  const sizeConfig = sizeClasses[size]
  const hasValidAvatar = avatar && !imageError

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
  }

  const avatarElement = (
    <div className={tw('relative flex-shrink-0', sizeConfig.avatar)}>
      {hasValidAvatar ? (
        <>
          {!imageLoaded && (
            <div
              className={tw(
                'absolute inset-0 flex items-center justify-center rounded-full bg-primary text-white font-semibold',
                sizeConfig.text
              )}
            >
              {initials}
            </div>
          )}
          <img
            src={avatar}
            alt={name}
            className={tw(
              'rounded-full object-cover',
              sizeConfig.avatar,
              !imageLoaded && 'opacity-0'
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </>
      ) : (
        <div
          className={tw(
            'flex items-center justify-center rounded-full bg-primary text-white font-semibold',
            sizeConfig.avatar,
            sizeConfig.text
          )}
        >
          {initials}
        </div>
      )}
    </div>
  )

  if (avatarOnly) {
    return avatarElement
  }

  return (
    <div className="flex items-center space-x-3">
      {avatarElement}
      <div>
        <p className={tw('font-semibold text-gray-dark', sizeConfig.name)}>{name}</p>
        {showDate && date && dateFormatter && (
          <p className={tw('text-gray', sizeConfig.text)}>{dateFormatter(date)}</p>
        )}
      </div>
    </div>
  )
}

