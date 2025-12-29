'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CreditCard, Loader2 } from 'lucide-react'

interface PaymentFormProps {
  amount: number
  onPaymentSuccess: (paymentMethod: string, transactionId: string) => void
  disabled?: boolean
}

export function PaymentForm({ amount, onPaymentSuccess, disabled }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'card'>('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  })

  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // Format card number with spaces
    if (e.target.name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
      if (value.length > 19) return
    }

    // Format expiry as MM/YY
    if (e.target.name === 'expiry') {
      value = value.replace(/\D/g, '')
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4)
      }
      if (value.length > 5) return
    }

    // Limit CVV to 3-4 digits
    if (e.target.name === 'cvv') {
      value = value.replace(/\D/g, '')
      if (value.length > 4) return
    }

    setCardInfo({
      ...cardInfo,
      [e.target.name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate a mock transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Call success callback
    onPaymentSuccess(paymentMethod, transactionId)
    
    setIsProcessing(false)
  }

  const handleStripePayment = async () => {
    setIsProcessing(true)
    
    // In a real app, you would integrate with Stripe's Payment Intent API here
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const transactionId = `STRIPE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    onPaymentSuccess('stripe', transactionId)
    
    setIsProcessing(false)
  }

  const handlePayPalPayment = async () => {
    setIsProcessing(true)
    
    // In a real app, you would integrate with PayPal's SDK here
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const transactionId = `PAYPAL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    onPaymentSuccess('paypal', transactionId)
    
    setIsProcessing(false)
  }

  return (
    <div className="space-y-6">
      <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
        <div className="flex items-center space-x-2 border border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/50">
          <RadioGroupItem value="card" id="card" />
          <Label htmlFor="card" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <span>Credit/Debit Card</span>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-2 border border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/50">
          <RadioGroupItem value="stripe" id="stripe" />
          <Label htmlFor="stripe" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M13.5 2C9.91 2 7 4.91 7 8.5V12H4V22H20V12H17V8.5C17 4.91 14.09 2 10.5 2H13.5Z" fill="currentColor"/>
              </svg>
              <span>Stripe</span>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-2 border border-border rounded-lg p-4 cursor-pointer hover:bg-secondary/50">
          <RadioGroupItem value="paypal" id="paypal" />
          <Label htmlFor="paypal" className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.32 21.97a.546.546 0 01-.26-.32c-.03-.15-.01-.3.07-.43l2.12-3.67c.1-.17.28-.28.48-.28h4.99c2.26 0 4.11-1.85 4.11-4.11 0-2.27-1.84-4.11-4.11-4.11H9.28L7.31 2.36A.77.77 0 006.53 2H3.51c-.15 0-.3.09-.37.23-.07.14-.06.31.02.44l4.25 7.36-2.12 3.67c-.1.17-.11.37-.03.55.08.18.24.3.43.3h2.63z"/>
              </svg>
              <span>PayPal</span>
            </div>
          </Label>
        </div>
      </RadioGroup>

      {/* Card Payment Form */}
      {paymentMethod === 'card' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number *</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardInfo.cardNumber}
              onChange={handleCardInfoChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name *</Label>
            <Input
              id="cardName"
              name="cardName"
              placeholder="John Doe"
              value={cardInfo.cardName}
              onChange={handleCardInfoChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date *</Label>
              <Input
                id="expiry"
                name="expiry"
                placeholder="MM/YY"
                value={cardInfo.expiry}
                onChange={handleCardInfoChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV *</Label>
              <Input
                id="cvv"
                name="cvv"
                type="password"
                placeholder="123"
                value={cardInfo.cvv}
                onChange={handleCardInfoChange}
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
            disabled={disabled || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${amount.toFixed(2)}`
            )}
          </Button>
        </form>
      )}

      {/* Stripe Button */}
      {paymentMethod === 'stripe' && (
        <div className="space-y-4">
          <div className="bg-secondary/30 border border-border rounded-lg p-4 text-sm text-muted-foreground">
            <p>You will be redirected to Stripe's secure payment page.</p>
          </div>
          <Button
            onClick={handleStripePayment}
            className="w-full bg-[#635BFF] hover:bg-[#635BFF]/90 text-white h-12"
            disabled={disabled || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${amount.toFixed(2)} with Stripe`
            )}
          </Button>
        </div>
      )}

      {/* PayPal Button */}
      {paymentMethod === 'paypal' && (
        <div className="space-y-4">
          <div className="bg-secondary/30 border border-border rounded-lg p-4 text-sm text-muted-foreground">
            <p>You will be redirected to PayPal's secure payment page.</p>
          </div>
          <Button
            onClick={handlePayPalPayment}
            className="w-full bg-[#0070BA] hover:bg-[#0070BA]/90 text-white h-12"
            disabled={disabled || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${amount.toFixed(2)} with PayPal`
            )}
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Your payment information is secure and encrypted.
      </p>
    </div>
  )
}
