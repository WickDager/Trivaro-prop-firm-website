/**
 * TermsOfService Page
 */

import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { Card, CardContent } from '../components/common/Card'

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-text-primary mb-8">Terms of Service</h1>
          
          <div className="space-y-8">
            <Card>
              <CardContent className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-semibold text-text-primary mt-6 mb-4">1. Acceptance of Terms</h2>
                <p className="text-text-secondary">
                  By accessing and using Trivaro Prop Firm services, you accept and agree to be bound 
                  by the terms and provisions of this agreement.
                </p>

                <h2 className="text-2xl font-semibold text-text-primary mt-6 mb-4">2. Trading Rules</h2>
                <p className="text-text-secondary">
                  Traders must adhere to all trading rules including profit targets, drawdown limits, 
                  and daily loss limits. Violation of these rules will result in challenge failure.
                </p>

                <h2 className="text-2xl font-semibold text-text-primary mt-6 mb-4">3. Refund Policy</h2>
                <p className="text-text-secondary">
                  Challenge fees are non-refundable once the trading account has been activated. 
                  Refunds may be considered in specific circumstances as outlined in our refund policy.
                </p>

                <h2 className="text-2xl font-semibold text-text-primary mt-6 mb-4">4. Prohibited Activities</h2>
                <p className="text-text-secondary">
                  The following activities are prohibited: arbitrage trading, latency trading, 
                  martingale strategies, and any form of market manipulation.
                </p>

                <h2 className="text-2xl font-semibold text-text-primary mt-6 mb-4">5. Limitation of Liability</h2>
                <p className="text-text-secondary">
                  Trivaro Prop Firm is not liable for any indirect, incidental, special, consequential, 
                  or punitive damages resulting from your use of our services.
                </p>

                <h2 className="text-2xl font-semibold text-text-primary mt-6 mb-4">6. Contact</h2>
                <p className="text-text-secondary">
                  For questions about these Terms, please contact us at legal@trivaro.com
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default TermsOfService
