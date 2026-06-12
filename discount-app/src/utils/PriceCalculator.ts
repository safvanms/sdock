import { Discount } from '../types'

export function applyDiscounts(
    basePrice: number,
    discounts: Discount[],
    type: 'one-time' | 'monthly'
): number {
    let price = basePrice
    const relevant = discounts.filter(d => d.type === type && d.status === 'active')
    for (const d of relevant) {
        if (d.valueType === 'percentage') {
            price = price - (price * d.value) / 100
        } else {
            price = price - d.value
        }
    }
    return Math.max(0, price)
}

export function getMonthlyCartLines(
    baseMonthly: number,
    discounts: Discount[]
): { label: string; price: number }[] {
    const monthlyDiscounts = discounts.filter(
        d => d.type === 'monthly' && d.status === 'active'
    )

    if (monthlyDiscounts.length === 0) {
        return [{ label: 'Monthly', price: baseMonthly }]
    }

    const durDiscounts = monthlyDiscounts.filter(d => d.durationMonths)
    if (durDiscounts.length === 0) {
        const discounted = applyDiscounts(baseMonthly, discounts, 'monthly')
        return [{ label: 'Monthly', price: discounted }]
    }

    const maxDuration = Math.max(...durDiscounts.map(d => d.durationMonths!))

    // First N months: apply ALL monthly discounts (including duration-limited ones)
    const firstNPrice = applyDiscounts(baseMonthly, discounts, 'monthly')

    // After N months: only apply permanent monthly discounts
    const permanentDiscounts = monthlyDiscounts.filter(d => !d.durationMonths)
    const afterNPrice = applyDiscounts(baseMonthly, permanentDiscounts, 'monthly')

    return [
        { label: `First ${maxDuration} months`, price: firstNPrice },
        { label: `Month ${maxDuration + 1}+`, price: afterNPrice },
    ]
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value)
}