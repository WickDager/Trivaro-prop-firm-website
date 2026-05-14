/**
 * Footer Component
 */

import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center mb-4" aria-label="Trivaro home">
              <img src="/images/logo.svg" alt="Trivaro" className="h-8" />
            </Link>
            <p className="text-text-secondary max-w-md">
              Professional forex trading challenges with instant funding. 
              Prove your skills and trade with our capital.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="text-text-secondary hover:text-text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-text-secondary hover:text-text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-text-secondary hover:text-text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-text-secondary hover:text-text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-text-muted text-sm">
              © {new Date().getFullYear()} Trivaro Prop Firm. All rights reserved.
            </p>
            <p className="text-text-muted text-sm mt-2 md:mt-0">
              Trading forex involves substantial risk of loss.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
