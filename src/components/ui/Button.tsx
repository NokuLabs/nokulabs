import * as React from 'react'
import { cn } from '@/lib/utils'

type CommonProps = {
  variant?: 'primary' | 'secondary'
  className?: string
  href?: string
}

type AnchorProps = CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
type NativeButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }

type ButtonProps = AnchorProps | NativeButtonProps

export default function Button(props: ButtonProps) {
  const { variant = 'primary', className, ...rest } = props

  const base =
    'inline-flex items-center justify-center px-8 py-4 text-body font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-primary text-background hover:bg-accent focus:ring-primary',
    secondary: 'border border-border text-primary hover:border-primary focus:ring-primary',
  } as const

  if ('href' in rest && rest.href) {
    const { href, ...aProps } = rest
    return (
      <a href={href} className={cn(base, variants[variant], className)} {...aProps} />
    )
  }

  return (
    <button className={cn(base, variants[variant], className)} {...(rest as NativeButtonProps)} />
  )
}