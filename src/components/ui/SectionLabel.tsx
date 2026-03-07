import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export default function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <p
      className={cn(
        'font-mono text-[11px] uppercase tracking-[0.22em] text-secondary mb-6',
        className
      )}
    >
      {children}
    </p>
  )
}
