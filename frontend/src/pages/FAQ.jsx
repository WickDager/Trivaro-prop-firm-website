/**
 * FAQ Page
 */

import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { Card, CardContent } from '../components/common/Card'

const FAQ = () => {
  const faqs = [
    {
      question: 'What is a prop firm challenge?',
      answer: 'A prop firm challenge is an evaluation process where traders demonstrate their skills by meeting specific profit targets while adhering to risk management rules. Upon passing, traders receive funded accounts.'
    },
    {
      question: 'How long do I have to complete the challenge?',
      answer: 'There is no time limit! You can take as long as you need to complete both phases, as long as you follow the trading rules.'
    },
    {
      question: 'What is the profit split?',
      answer: 'Traders keep up to 90% of the profits they generate. The profit split starts at 80% and can scale up to 90% based on performance.'
    },
    {
      question: 'Can I use EAs (Expert Advisors)?',
      answer: 'Yes! EAs are allowed as long as they do not engage in prohibited activities like arbitrage or latency trading.'
    },
    {
      question: 'What happens if I violate a rule?',
      answer: 'If you violate a trading rule, your challenge will be marked as failed. You can choose to retry the challenge with a discount.'
    },
    {
      question: 'How do payouts work?',
      answer: 'Funded traders can request payouts every two weeks. Payouts are processed within 3-5 business days via your chosen payment method.'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-text-primary text-center mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-text-secondary text-center mb-12">
            Everything you need to know about Trivaro Prop Firm
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-text-secondary">{faq.answer}</p>
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

export default FAQ
