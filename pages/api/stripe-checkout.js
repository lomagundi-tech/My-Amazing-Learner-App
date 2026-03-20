// Dummy Stripe checkout endpoint
// TODO: Replace with real Stripe integration before go-live
// When live: install stripe npm package, use STRIPE_SECRET_KEY env var,
// create a real checkout session or apply coupon to subscription

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { voucherCode, action } = req.body

  if (!voucherCode) {
    return res.status(400).json({ error: 'No voucher code provided' })
  }

  // Simulate processing delay (remove in production)
  // In production: validate code against Stripe coupons, apply to customer subscription

  if (action === 'apply') {
    return res.status(200).json({
      success: true,
      mock: true, // REMOVE this flag when Stripe is live
      voucherCode,
      message: 'Voucher saved! It will be applied automatically to your next billing cycle.',
      appliedToStripe: false, // will be true when live
    })
  }

  if (action === 'validate') {
    return res.status(200).json({
      success: true,
      mock: true,
      voucherCode,
      valid: true,
      message: 'Voucher is valid and ready to use.',
    })
  }

  return res.status(400).json({ error: 'Unknown action' })
}
