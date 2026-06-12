import { describe, it, expect } from 'vitest'
import { applyDiscounts, getMonthlyCartLines } from '../utils/PriceCalculator'
import { Discount } from '../types'

const pctDiscount: Discount = {
    id: '1', name: 'Test', type: 'one-time',
    valueType: 'percentage', value: 20, status: 'active'
}
const amtDiscount: Discount = {
    id: '2', name: 'Test2', type: 'monthly',
    valueType: 'amount', value: 5, status: 'active'
}
const timedDiscount: Discount = {
    id: '3', name: 'Test3', type: 'monthly',
    valueType: 'percentage', value: 10, durationMonths: 3, status: 'active'
}

describe('applyDiscounts', () => {
    it('applies percentage discount', () => {
        expect(applyDiscounts(100, [pctDiscount], 'one-time')).toBe(80)
    })
    it('applies fixed amount discount', () => {
        expect(applyDiscounts(50, [amtDiscount], 'monthly')).toBe(45)
    })
    it('ignores inactive discounts', () => {
        const inactive = { ...pctDiscount, status: 'inactive' as const }
        expect(applyDiscounts(100, [inactive], 'one-time')).toBe(100)
    })
    it('does not go below 0', () => {
        const huge = { ...amtDiscount, value: 999 }
        expect(applyDiscounts(50, [huge], 'monthly')).toBe(0)
    })
})

describe('getMonthlyCartLines', () => {
    it('returns single line with no discounts', () => {
        const lines = getMonthlyCartLines(50, [])
        expect(lines).toHaveLength(1)
        expect(lines[0].price).toBe(50)
    })
    it('returns two lines for timed discount', () => {
        const lines = getMonthlyCartLines(50, [timedDiscount])
        expect(lines).toHaveLength(2)
        expect(lines[0].label).toContain('3')
        expect(lines[0].price).toBe(45)
        expect(lines[1].price).toBe(50)
    })
})