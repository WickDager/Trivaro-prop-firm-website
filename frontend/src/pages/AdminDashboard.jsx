/**
 * AdminDashboard Page
 */

import { useState, useEffect } from 'react'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card'
import { PageLoader } from '../components/common/Loader'
import adminService from '../services/adminService'
import { formatCurrency } from '../utils/formatters'

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await adminService.getStats()
      setStats(response.data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageLoader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-text-primary mb-8">Admin Dashboard</h1>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-text-primary mb-2">
                    {stats.users.total}
                  </p>
                  <p className="text-text-secondary">
                    {stats.users.active} active users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-text-primary mb-2">
                    {stats.challenges.total}
                  </p>
                  <p className="text-text-secondary">
                    {stats.challenges.active} active challenges
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Financial</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-accent mb-2">
                    {formatCurrency(stats.financial.totalRevenue)}
                  </p>
                  <p className="text-text-secondary text-sm">
                    Revenue • {formatCurrency(stats.financial.totalPayouts)} paid out
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-text-secondary">
                More admin features coming soon...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AdminDashboard
