/**
 * HowItWorks Page
 */

import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { Card, CardContent } from '../components/common/Card'
import { Trophy, TrendingUp, DollarSign } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      icon: <Trophy className="text-secondary" size={48} />,
      title: 'Phase 1',
      description: 'Prove your skills by achieving a 10% profit target while respecting the 10% max drawdown and 5% daily loss limits.',
      details: ['10% Profit Target', '10% Max Drawdown', '5% Daily Loss', '5 Min Trading Days']
    },
    {
      icon: <TrendingUp className="text-accent" size={48} />,
      title: 'Phase 2',
      description: 'Continue demonstrating consistency with a 5% profit target and the same risk management rules.',
      details: ['5% Profit Target', '10% Max Drawdown', '5% Daily Loss', '5 Min Trading Days']
    },
    {
      icon: <DollarSign className="text-green-400" size={48} />,
      title: 'Funded Trader',
      description: 'Trade with our capital and keep up to 90% of the profits you generate. Request payouts every two weeks.',
      details: ['Up to 90% Profit Split', 'Bi-weekly Payouts', 'Scaling Plan Available', 'No Profit Target']
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-text-primary text-center mb-4">
            How It Works
          </h1>
          <p className="text-text-secondary text-center mb-16 max-w-2xl mx-auto">
            Three simple steps to becoming a funded trader with Trivaro Prop Firm
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-6">
                    {step.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-text-primary mb-4">
                    {step.title}
                  </h2>
                  <p className="text-text-secondary mb-6">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="text-sm text-text-secondary">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default HowItWorks
