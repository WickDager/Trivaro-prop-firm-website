/**
 * NotFound Page
 */

import { Link } from 'react-router-dom'
import { Button } from '../components/common/Button'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-text-primary mb-4">404</h1>
        <p className="text-2xl text-text-secondary mb-8">Page not found</p>
        <p className="text-text-muted mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
