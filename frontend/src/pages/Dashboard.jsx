/**
 * Dashboard Page
 */

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, TrendingUp, Award, AlertCircle, DollarSign } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { Button } from '../components/common/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card'
import { PageLoader } from '../components/common/Loader'
import challengeService from '../services/challengeService'
import { formatCurrency, formatPercentage } from '../utils/formatters'
import { STATUS_COLORS } from '../utils/constants'

const Dashboard = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [challenges, setChallenges] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    passed: 0,
    failed: 0,
  })

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      const response = await challengeService.getChallenges()
      setChallenges(response.data)
      
      // Calculate stats
      setStats({
        total: response.data.length,
        active: response.data.filter(c => c.status === 'active').length,
        passed: response.data.filter(c => c.status === 'passed').length,
        failed: response.data.filter(c => c.status === 'failed').length,
      })
    } catch (error) {
      console.error('Failed to fetch challenges:', error)
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
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Welcome back, {user?.firstName || 'Trader'}!
              </h1>
              <p className="text-text-secondary">Manage your trading challenges</p>
            </div>
            <Link to="/purchase">
              <Button>
                <Plus size={18} className="mr-2" />
                New Challenge
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm mb-1">Total Challenges</p>
                  <p className="text-3xl font-bold text-text-primary">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="text-secondary" size={24} />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm mb-1">Active</p>
                  <p className="text-3xl font-bold text-accent">{stats.active}</p>
                </div>
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Award className="text-accent" size={24} />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm mb-1">Passed</p>
                  <p className="text-3xl font-bold text-green-400">{stats.passed}</p>
                </div>
                <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                  <DollarSign className="text-green-400" size={24} />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm mb-1">Failed</p>
                  <p className="text-3xl font-bold text-error">{stats.failed}</p>
                </div>
                <div className="w-12 h-12 bg-error/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="text-error" size={24} />
                </div>
              </div>
            </Card>
          </div>

          {/* Challenges List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Challenges</CardTitle>
            </CardHeader>
            <CardContent>
              {challenges.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="mx-auto text-text-muted mb-4" size={48} />
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    No challenges yet
                  </h3>
                  <p className="text-text-secondary mb-6">
                    Start your trading journey by purchasing your first challenge
                  </p>
                  <Link to="/purchase">
                    <Button>
                      <Plus size={18} className="mr-2" />
                      Buy Challenge
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-4 px-4 text-text-secondary font-medium">Account</th>
                        <th className="text-left py-4 px-4 text-text-secondary font-medium">Type</th>
                        <th className="text-left py-4 px-4 text-text-secondary font-medium">Phase</th>
                        <th className="text-left py-4 px-4 text-text-secondary font-medium">Balance</th>
                        <th className="text-left py-4 px-4 text-text-secondary font-medium">Profit</th>
                        <th className="text-left py-4 px-4 text-text-secondary font-medium">Status</th>
                        <th className="text-left py-4 px-4 text-text-secondary font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {challenges.map((challenge) => (
                        <tr key={challenge._id} className="border-b border-gray-800/50">
                          <td className="py-4 px-4 text-text-primary">
                            ${challenge.accountSize.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-text-secondary capitalize">
                            {challenge.accountType}
                          </td>
                          <td className="py-4 px-4 text-text-secondary">
                            Phase {challenge.phase}
                          </td>
                          <td className="py-4 px-4 text-text-primary">
                            ${challenge.currentBalance?.toLocaleString() || challenge.initialBalance.toLocaleString()}
                          </td>
                          <td className={`py-4 px-4 ${
                            challenge.currentBalance > challenge.initialBalance
                              ? 'text-accent'
                              : 'text-error'
                          }`}>
                            {formatPercentage(
                              ((challenge.currentBalance - challenge.initialBalance) / challenge.initialBalance) * 100
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`badge ${STATUS_COLORS[challenge.status]}`}>
                              {challenge.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Link
                              to={`/challenges/${challenge._id}`}
                              className="text-secondary hover:underline"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard
