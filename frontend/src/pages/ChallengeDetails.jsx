/**
 * ChallengeDetails Page
 */

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card'
import { PageLoader } from '../components/common/Loader'
import { Button } from '../components/common/Button'
import challengeService from '../services/challengeService'
import { formatCurrency, formatPercentage } from '../utils/formatters'

const ChallengeDetails = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [challenge, setChallenge] = useState(null)

  useEffect(() => {
    fetchChallenge()
  }, [id])

  const fetchChallenge = async () => {
    try {
      const response = await challengeService.getChallengeDetails(id)
      setChallenge(response.data)
    } catch (error) {
      console.error('Failed to fetch challenge:', error)
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

  if (!challenge) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-text-primary mb-4">Challenge not found</h1>
            <Link to="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <Link to="/dashboard" className="inline-flex items-center text-text-secondary hover:text-text-primary mb-6">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              ${challenge.accountSize.toLocaleString()} {challenge.accountType} Challenge
            </h1>
            <p className="text-text-secondary">
              Phase {challenge.phase} • Status: <span className="text-accent">{challenge.status}</span>
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="text-center">
                <p className="text-text-secondary text-sm mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-text-primary">
                  ${challenge.currentBalance?.toLocaleString() || challenge.initialBalance.toLocaleString()}
                </p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-text-secondary text-sm mb-1">Profit/Loss</p>
                <p className={`text-2xl font-bold ${
                  challenge.currentBalance >= challenge.initialBalance
                    ? 'text-accent'
                    : 'text-error'
                }`}>
                  {formatPercentage(
                    ((challenge.currentBalance - challenge.initialBalance) / challenge.initialBalance) * 100
                  )}
                </p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-text-secondary text-sm mb-1">Profit Target</p>
                <p className="text-2xl font-bold text-text-primary">
                  {formatPercentage((challenge.profitTarget / challenge.initialBalance) * 100)}
                </p>
              </div>
            </Card>

            <Card>
              <div className="text-center">
                <p className="text-text-secondary text-sm mb-1">Trading Days</p>
                <p className="text-2xl font-bold text-text-primary">
                  {challenge.tradingDays} / 5
                </p>
              </div>
            </Card>
          </div>

          {/* Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Trading Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-accent mt-1" size={20} />
                  <div>
                    <p className="text-text-primary font-medium">Max Drawdown</p>
                    <p className="text-text-secondary text-sm">
                      {challenge.maxDrawdown / challenge.initialBalance * 100}% of initial balance
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-accent mt-1" size={20} />
                  <div>
                    <p className="text-text-primary font-medium">Daily Loss Limit</p>
                    <p className="text-text-secondary text-sm">
                      {challenge.dailyDrawdownLimit / challenge.initialBalance * 100}% per day
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="text-accent mt-1" size={20} />
                  <div>
                    <p className="text-text-primary font-medium">Min Trading Days</p>
                    <p className="text-text-secondary text-sm">5 days required</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default ChallengeDetails
