import calendarIcon from '../assets/icons/calendar.svg'
import checkIcon from '../assets/icons/check.svg'
import infoIcon from '../assets/icons/info.svg'
import locationIcon from '../assets/icons/location.svg'
import mailIcon from '../assets/icons/mail.svg'
import phoneIcon from '../assets/icons/phone.svg'
import sendIcon from '../assets/icons/send.svg'
import timeIcon from '../assets/icons/time.svg'

export const iconPaths = {
  calendar: calendarIcon,
  check: checkIcon,
  info: infoIcon,
  location: locationIcon,
  mail: mailIcon,
  phone: phoneIcon,
  send: sendIcon,
  time: timeIcon,
} as const

export type IconName = keyof typeof iconPaths

type IconProps = {
  name: IconName
  className?: string
  alt?: string
}

export function Icon({ name, className, alt = '' }: IconProps) {
  return (
    <img
      src={iconPaths[name]}
      alt={alt}
      className={className}
      aria-hidden={alt === ''}
    />
  )
}
