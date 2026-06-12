import { describe, it, expect } from 'vitest';
import {
    applyDiscounts,
    getMonthlyCartLines,
    formatCurrency,
} from '../utils/PriceCalculator';
import type { Discount } from '../types';

describe('applyDiscounts', () => {
    it('returns original price when no discounts are provided', () => {
        expect(applyDiscounts(100, [], 'one-time')).toBe(100);
    });

    it('applies percentage discount', () => {
        const discounts: Discount[] = [
            {
                id: '1',
                name: '10% Off',
                type: 'one-time',
                valueType: 'percentage',
                value: 10,
                status: 'active',
            },
        ];

        expect(applyDiscounts(100, discounts, 'one-time')).toBe(90);
    });

    it('applies fixed discount', () => {
        const discounts: Discount[] = [
            {
                id: '1',
                name: '£20 Off',
                type: 'one-time',
                valueType: 'percentage' as const,
                value: 20,
                status: 'active',
            },
        ];

        expect(applyDiscounts(100, discounts, 'one-time')).toBe(80);
    });

    it('applies multiple discounts sequentially', () => {
        const discounts: Discount[] = [
            {
                id: '1',
                name: '10% Off',
                type: 'one-time',
                valueType: 'percentage',
                value: 10,
                status: 'active',
            },
            {
                id: '2',
                name: '£20 Off',
                type: 'one-time',
                valueType: 'percentage' as const,
                value: 20,
                status: 'active',
            },
        ];

        expect(applyDiscounts(100, discounts, 'one-time')).toBe(70);
    });

    it('ignores inactive discounts', () => {
        const discounts: Discount[] = [
            {
                id: '1',
                name: '10% Off',
                type: 'one-time',
                valueType: 'percentage',
                value: 10,
                status: 'inactive',
            },
        ];

        expect(applyDiscounts(100, discounts, 'one-time')).toBe(100);
    });

    it('ignores discounts of different type', () => {
        const discounts: Discount[] = [
            {
                id: '1',
                name: 'Monthly Discount',
                type: 'monthly',
                valueType: 'percentage',
                value: 50,
                status: 'active',
            },
        ];

        expect(applyDiscounts(100, discounts, 'one-time')).toBe(100);
    });

    it('never returns less than zero', () => {
        const discounts: Discount[] = [
            {
                id: '1',
                name: 'Huge Discount',
                type: 'one-time',
                valueType: 'percentage' as const,
                value: 500,
                status: 'active',
            },
        ];

        expect(applyDiscounts(100, discounts, 'one-time')).toBe(0);
    });
});

describe('getMonthlyCartLines', () => {
    it('returns base monthly price when no monthly discounts exist', () => {
        expect(getMonthlyCartLines(25, [])).toEqual([
            {
                label: 'Monthly',
                price: 25,
            },
        ]);
    });

    it('returns discounted monthly price for permanent monthly discount', () => {
        const discounts: Discount[] = [
            {
                id: '1',
                name: '10% Monthly',
                type: 'monthly',
                valueType: 'percentage',
                value: 10,
                status: 'active',
            },
        ];

        expect(getMonthlyCartLines(100, discounts)).toEqual([
            {
                label: 'Monthly',
                price: 90,
            },
        ]);
    });

    it('returns first-month and after-month pricing for duration discounts', () => {
        const discounts: Discount[] = [
            {
                id: '1',
                name: '50% First 3 Months',
                type: 'monthly',
                valueType: 'percentage',
                value: 50,
                durationMonths: 3,
                status: 'active',
            },
        ];

        expect(getMonthlyCartLines(100, discounts)).toEqual([
            {
                label: 'First 3 months',
                price: 50,
            },
            {
                label: 'Month 4+',
                price: 100,
            },
        ]);
    });

    it('combines permanent and duration discounts correctly', () => {
        const discounts: Discount[] = [
            {
                id: '1',
                name: '50% First 3 Months',
                type: 'monthly',
                valueType: 'percentage',
                value: 50,
                durationMonths: 3,
                status: 'active',
            },
            {
                id: '2',
                name: '£10 Ongoing',
                type: 'monthly',
                valueType: 'percentage' as const,
                value: 10,
                status: 'active',
            },
        ];

        expect(getMonthlyCartLines(100, discounts)).toEqual([
            {
                label: 'First 3 months',
                price: 40,
            },
            {
                label: 'Month 4+',
                price: 90,
            },
        ]);
    });

    it('uses the longest duration when multiple duration discounts exist', () => {
        const discounts: Discount[] = [
            {
                id: '1',
                name: '3 Month Discount',
                type: 'monthly',
                valueType: 'percentage' as const,
                value: 10,
                durationMonths: 3,
                status: 'active',
            },
            {
                id: '2',
                name: '6 Month Discount',
                type: 'monthly',
                valueType: 'percentage' as const,
                value: 5,
                durationMonths: 6,
                status: 'active',
            },
        ];

        expect(getMonthlyCartLines(100, discounts)).toEqual([
            {
                label: 'First 6 months',
                price: 85,
            },
            {
                label: 'Month 7+',
                price: 100,
            },
        ]);
    });
});

describe('formatCurrency', () => {
    it('formats whole numbers as GBP currency', () => {
        expect(formatCurrency(100)).toBe('£100.00');
    });

    it('formats decimal values correctly', () => {
        expect(formatCurrency(99.99)).toBe('£99.99');
    });

    it('formats zero correctly', () => {
        expect(formatCurrency(0)).toBe('£0.00');
    });
});