/**
 * PrivacyPolicy Page
 */

import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { Card, CardContent } from '../components/common/Card'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-text-primary mb-8">Privacy Policy</h1>
          
          <div className="space-y-8">
            <Card>
              <CardContent className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-semibold text-text-primary mt-6 mb-4">1. Information We Collect</h2>
                <p className="text-text-secondary">
                  We collect information you provide directly to us, including your name, email address, 
                  phone number, and payment information when you register for our services.
                </p>

                <h2 className="text-2xl font-semibold text-text-primary mt-6 mb-4">2. How We Use Your Information</h2>
                <p className="text-text-secondary">
                  We use the information we collect to provide, maintain, and improve our services, 
                  process transactions, and send you related information.
                </p>

                <h2 className="text-2xl font-semibold text-text-primary mt-6 mb-4">3. Data Security</h2>
                <p className="text-text-secondary">
                  We implement appropriate technical and organizational measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction.
                </p>

                <h2 className="text-2xl font-semibold text-text-primary mt-6 mb-4">4. Your Rights</h2>
                <p className="text-text-secondary">
                  You have the right to access, update, or delete your personal information. 
                  Contact us at privacy@trivaro.com for any data-related requests.
                </p>

                <h2 className="text-2xl font-semibold text-text-primary mt-6 mb-4">5. Contact Us</h2>
                <p className="text-text-secondary">
                  If you have any questions about this Privacy Policy, please contact us at privacy@trivaro.com
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

export default PrivacyPolicy
