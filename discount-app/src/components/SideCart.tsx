import { CartProduct, Discount } from '../types'
import {
    applyDiscounts,
    getMonthlyCartLines,
    formatCurrency,
} from '../utils/PriceCalculator'

interface Props {
    product: CartProduct
    discounts: Discount[]
}

export function SideCart({ product, discounts }: Props) {
    // Only show active discounts in cart summary
    const activeDiscounts = discounts.filter(d => d.status === 'active')

    const discountedOneTime = applyDiscounts(
        product.oneTimePrice,
        activeDiscounts,
        'one-time'
    )

    const monthlyLines = getMonthlyCartLines(product.monthlyPrice, activeDiscounts)

    const getDiscountDescription = (discount: Discount) => {
        const value =
            discount.valueType === 'percentage'
                ? `${discount.value}%`
                : formatCurrency(discount.value)

        if (discount.type === 'one-time') return `${value} one time`
        if (discount.durationMonths)
            return `${value} monthly first ${discount.durationMonths} months`
        return `${value} monthly`
    }

    // Active one-time and monthly discounts for display in totals
    const activeOneTimeDiscounts = activeDiscounts.filter(d => d.type === 'one-time')

    return (
        <aside className="bg-white border border-[#e3e3e3] w-full">
            {/* Overview */}
            <div className="p-5">
                <h3 className="text-[24px] text-[#555555] mb-4">Overview</h3>

                <div className="flex justify-between text-[12px] text-[#555] mb-1">
                    <span>{product.name}</span>
                    <span>{formatCurrency(product.oneTimePrice)}</span>
                </div>

                <div className="flex justify-between text-[12px] text-[#555] mb-3">
                    <span>Monthly price</span>
                    <span>{formatCurrency(product.monthlyPrice)}</span>
                </div>

                <button className="text-brand text-[11px] hover:underline">
                    Edit
                </button>
            </div>

            {/* Monthly Pricing Breakdown */}
            <div className="bg-[#f3f7f9] border-y border-[#ececec] px-5 py-4">
                {monthlyLines.map(line => (
                    <div
                        key={line.label}
                        className="flex justify-between text-[12px] text-[#444] font-semibold mb-1 last:mb-0"
                    >
                        <span>{line.label}</span>
                        <span>{formatCurrency(line.price)}</span>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="p-5">
                <div className="flex justify-between text-[12px] text-[#555] mb-3">
                    <span>Subtotal one-time costs excl. btw</span>
                    <span>{formatCurrency(product.oneTimePrice)}</span>
                </div>

                {/* Active discounts listed individually */}
                {activeOneTimeDiscounts.map(discount => (
                    <div
                        key={discount.id}
                        className="flex justify-between text-[12px] text-[#555] mb-2"
                    >
                        <span>{discount.name}</span>
                        <span>- {getDiscountDescription(discount)}</span>
                    </div>
                ))}

                <div className="flex justify-between font-semibold text-[13px] mt-4 pt-3 border-t border-[#ececec]">
                    <span>One-time costs excl. btw</span>
                    <span>{formatCurrency(discountedOneTime)}</span>
                </div>
            </div>
        </aside>
    )
}