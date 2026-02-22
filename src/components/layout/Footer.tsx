import type { NavItem } from '@/types'

const navItems: NavItem[] = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Approach', href: '#approach' },
  { label: 'Reference Work', href: '#systems' },
  { label: 'Contact', href: '#engagement' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-content mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-h3-mobile md:text-h3-desktop mb-4">
              NOKU LABS
            </h3>
            <p className="text-body text-secondary max-w-md">
              Systems built to last.
            </p>
          </div>

          <div>
            <h4 className="text-h4 mb-4">Navigation</h4>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-body text-secondary hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-small text-muted">
              © {currentYear} NOKU LABS. All rights reserved.
            </p>
            
            <div className="flex gap-6">
              <a
                href="#privacy"
                className="text-small text-muted hover:text-secondary transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                className="text-small text-muted hover:text-secondary transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
