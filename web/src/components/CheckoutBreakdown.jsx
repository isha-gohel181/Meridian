import React from 'react'

const CheckoutBreakdown = ({ basePrice = 0, discount = 0, gstRate = 0.18, couponData = null, className = '', compact = false }) => {
  const format = (v) => `₹${Number(v || 0).toFixed(2)}`
  const discountedBase = Math.max(0, basePrice - discount)
  const gstAmount = discountedBase * Number(gstRate || 0)
  const total = discountedBase + gstAmount
  const savingsPercent = couponData && couponData.discountType === 'percentage' && couponData.discountPercent

  if (compact) {
    return (
      <div className={`rounded-xl p-4 bg-black/50 border border-accent/25 backdrop-blur-md shadow-lg max-w-sm ${className}`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-jetbrains text-[10px] font-bold uppercase tracking-[0.2em] text-amber-100/90">Price Breakdown</h4>
            {savingsPercent && <span className="font-jetbrains inline-block mt-0.5 text-[9px] text-accent-secondary font-bold uppercase tracking-wider">Save {savingsPercent}%</span>}
          </div>
          {couponData?.code && (
            <span className="font-jetbrains text-[10px] bg-accent/20 text-amber-100 border border-accent/35 px-2 py-0.5 rounded-full font-bold">
              {couponData.code}
            </span>
          )}
        </div>

        <dl className="font-montserrat space-y-1.5 text-xs">
          <div className="flex justify-between items-center text-amber-100/80">
            <dt>Base Price</dt>
            <dd className="font-semibold">{format(basePrice)}</dd>
          </div>

          {discount > 0 && (
            <div className="flex justify-between items-center text-accent-secondary">
              <dt>Discount</dt>
              <dd className="font-bold">-{format(discount)}</dd>
            </div>
          )}

          <div className="flex justify-between items-center text-amber-100/80">
            <dt>GST ({(Number(gstRate || 0) * 100).toFixed(0)}%)</dt>
            <dd className="font-semibold">{format(gstAmount)}</dd>
          </div>

          <div className="h-[1px] bg-white/10 my-2" />

          <div className="flex justify-between items-center text-white">
            <dt className="font-bold">Total</dt>
            <dd className="font-newsreader italic font-bold text-accent-secondary text-sm">{format(total)}</dd>
          </div>
        </dl>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-card-border shadow-sm rounded-2xl p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4 pb-3 border-b border-amber-100">
        <div>
          <h4 className="font-jetbrains text-[10px] font-bold text-description uppercase tracking-[0.2em]">Price Breakdown</h4>
          {savingsPercent && (
            <span className="font-jetbrains inline-flex items-center gap-1 mt-1 text-[9px] text-accent bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Save {savingsPercent}%
            </span>
          )}
        </div>
        {couponData?.code && (
          <span className="font-jetbrains text-[10px] bg-amber-50 text-accent border border-amber-200 px-2.5 py-1 rounded-full font-bold">
            {couponData.code}
          </span>
        )}
      </div>

      <dl className="font-montserrat space-y-3 text-sm">
        <div className="flex justify-between items-center text-description">
          <dt>Base Course Price</dt>
          <dd className="font-semibold text-normal">{format(basePrice)}</dd>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-accent">
            <dt className="font-medium">Coupon Discount</dt>
            <dd className="font-bold">-{format(discount)}</dd>
          </div>
        )}

        <div className="flex justify-between items-center text-description">
          <dt>GST ({(Number(gstRate || 0) * 100).toFixed(0)}%)</dt>
          <dd className="font-semibold text-normal">{format(gstAmount)}</dd>
        </div>

        <div className="h-[1px] bg-amber-100 my-2" />

        <div className="flex justify-between items-center text-normal">
          <dt className="font-semibold text-base">Total Amount</dt>
          <dd className="font-newsreader italic font-bold text-xl text-accent">{format(total)}</dd>
        </div>
      </dl>

      <p className="font-montserrat mt-4 pt-3 border-t border-amber-100 text-xs text-description leading-relaxed">
        You will be charged the exact amount above. Taxes are computed after discounts are applied.
      </p>
    </div>
  )
}

export default CheckoutBreakdown
