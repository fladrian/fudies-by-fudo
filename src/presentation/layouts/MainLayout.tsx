import { Link } from 'react-router-dom'
import fudiesLogo from '@assets/fudies-logo.png'
import fudoLogo from '@assets/fudo-short-logo.svg'
import { getCurrentYear } from '@presentation/utils/dateUtils'
import type { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

const currentYear = getCurrentYear()

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-surface-background flex flex-col">
      <header className="bg-surface shadow-card border-b border-surface-muted">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-center sm:justify-between gap-4">
            <Link
              to="/"
              className="flex flex-col items-start space-y-1 hover:opacity-80 transition-opacity"
            >
              <img src={fudiesLogo} alt="Fudies Logo" className="h-6 sm:h-8 w-auto" />

              <div className="flex items-center gap-2">
                <p className="text-sm sm:text-base font-medium text-primary italic">by</p>

                <img src={fudoLogo} alt="Fudo Logo" className="size-4 sm:size-5 w-auto" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 sm:py-8">{children}</main>

      <footer className="bg-surface border-t border-surface-muted mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
          <p className="text-center text-sm text-gray">
            © {currentYear} Fudies. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
