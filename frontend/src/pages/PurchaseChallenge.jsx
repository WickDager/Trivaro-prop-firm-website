/**
 * PurchaseChallenge Page
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { Navbar } from '../components/common/Navbar'
import { Footer } from '../components/common/Footer'
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card'
import { Button } from '../components/common/Button'
import { ACCOUNT_SIZES, ACCOUNT_TYPES } from '../utils/constants'
import { formatCurrency } from '../utils/formatters'
import challengeService from '../services/challengeService'
import toast from 'react-hot-toast'

const PurchaseChallenge = () => {
  const navigate = useNavigate()
  const [selectedSize, setSelectedSize] = useState(10000)
  const [selectedType, setSelectedType] = useState('balance-based')
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)
    try {
      const response = await challengeService.purchaseChallenge({
        accountSize: selectedSize,
        accountType: selectedType,
        paymentMethod: 'stripe'
      })
      
      toast.success('Challenge purchase initiated!')
      // In production, redirect to payment
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to purchase challenge')
    } finally {
      setLoading(false)
    }
  }

  const selectedPrice = ACCOUNT_SIZES.find(s => s.value === selectedSize)?.price || 0

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/dashboard" className="inline-flex items-center text-text-secondary hover:text-text-primary mb-6">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>

          <h1 className="text-3xl font-bold text-text-primary mb-8">Purchase Challenge</h1>

          {/* Account Size Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Account Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {ACCOUNT_SIZES.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setSelectedSize(size.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedSize === size.value
                        ? 'border-secondary bg-secondary/10'
                        : 'border-gray-800 bg-card hover:border-secondary/50'
                    }`}
                  >
                    <div className="text-sm text-text-secondary mb-1">{size.label}</div>
                    <div className="text-2xl font-bold text-text-primary">${size.price}</div>
                    {selectedSize === size.value && (
                      <div className="mt-2 flex justify-center">
                        <Check className="text-secondary" size={20} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Account Type Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Account Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACCOUNT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`p-6 rounded-lg border-2 text-left transition-all ${
                      selectedType === type.value
                        ? 'border-secondary bg-secondary/10'
                        : 'border-gray-800 bg-card hover:border-secondary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-text-primary">{type.label}</h3>
                      {selectedType === type.value && (
                        <Check className="text-secondary" size={20} />
                      )}
                    </div>
                    <p className="text-text-secondary text-sm mb-4">{type.description}</p>
                    <ul className="space-y-2">
                      {type.features.map((feature, index) => (
                        <li key={index} className="text-sm text-text-secondary flex items-center">
                          <Check className="text-accent mr-2" size={14} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Summary & Purchase */}
          <Card>
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="text-text-secondary mb-1">Total Price</p>
                  <p className="text-3xl font-bold text-text-primary">${selectedPrice}</p>
                </div>
                <Button
                  onClick={handlePurchase}
                  loading={loading}
                  size="lg"
                  className="w-full md:w-auto"
                >
                  Proceed to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default PurchaseChallenge
