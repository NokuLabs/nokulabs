import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export default function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        'text-small font-medium uppercase tracking-wider text-secondary mb-6',
        className
      )}
    >
      {children}
    </p>
  )
}
