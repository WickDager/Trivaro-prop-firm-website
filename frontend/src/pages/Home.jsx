/**
 * Home Page
 */

import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Shield, Zap, Award, DollarSign, Users } from 'lucide-react'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { Button } from '../components/common/Button'
import { Card } from '../components/common/Card'
import { ACCOUNT_SIZES } from '../utils/constants'

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6">
            Become a <span className="text-gradient">Funded Trader</span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto">
            Prove your trading skills with our evaluation challenge and get funded up to $100,000.
            Keep up to 90% of your profits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Your Challenge
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">$50M+</div>
              <div className="text-text-secondary">Paid to Traders</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">10,000+</div>
              <div className="text-text-secondary">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">90%</div>
              <div className="text-text-secondary">Profit Split</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">24/7</div>
              <div className="text-text-secondary">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Account Sizes */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-text-primary mb-4">
            Choose Your Account Size
          </h2>
          <p className="text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            Select the challenge that fits your trading style and experience level
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {ACCOUNT_SIZES.map((account) => (
              <Card key={account.value} className="text-center hover:glow transition-all">
                <div className="text-2xl font-bold text-secondary mb-2">
                  {account.label}
                </div>
                <div className="text-3xl font-bold text-text-primary mb-4">
                  ${account.price}
                </div>
                <ul className="text-sm text-text-secondary space-y-2 mb-6">
                  <li>10% Profit Target</li>
                  <li>10% Max Drawdown</li>
                  <li>5% Daily Loss</li>
                  <li>5 Min Trading Days</li>
                </ul>
                <Link to="/register">
                  <Button className="w-full" size="sm">
                    Get Started
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-card">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-text-primary mb-12">
            Why Choose Trivaro?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-secondary" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                High Profit Split
              </h3>
              <p className="text-text-secondary">
                Keep up to 90% of your trading profits with our scalable profit split program.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-accent" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Secure Platform
              </h3>
              <p className="text-text-secondary">
                Bank-level security with encrypted data and secure payment processing.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-secondary" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Instant Funding
              </h3>
              <p className="text-text-secondary">
                Get funded immediately after passing both phases. Start earning real profits.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-accent" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No Time Limits
              </h3>
              <p className="text-text-secondary">
                Trade at your own pace. No pressure to meet arbitrary deadlines.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="text-secondary" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Bi-Weekly Payouts
              </h3>
              <p className="text-text-secondary">
                Request your profits every two weeks. Fast and reliable payments.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-accent" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                24/7 Support
              </h3>
              <p className="text-text-secondary">
                Our team is always available to help you with any questions or issues.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-text-secondary mb-8">
            Join thousands of traders who have already started their funded trading career with Trivaro.
          </p>
          <Link to="/register">
            <Button size="lg">
              Create Free Account
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
