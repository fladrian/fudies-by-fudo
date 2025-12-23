import { twMerge } from 'tailwind-merge'

export const tw = (...classes: (string | undefined | null | false)[]): string => {
  return twMerge(classes.filter(Boolean).join(' '))
}
