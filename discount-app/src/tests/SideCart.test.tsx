import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SideCart } from '../components/SideCart';
import type { CartProduct, Discount } from '../types';

vi.mock('../utils/PriceCalculator', () => ({
    applyDiscounts: vi.fn(),
    getMonthlyCartLines: vi.fn(),
    formatCurrency: vi.fn(),
}));

import {
    applyDiscounts,
    getMonthlyCartLines,
    formatCurrency,
} from '../utils/PriceCalculator';

const mockProduct: CartProduct = {
    name: 'Premium Plan',
    oneTimePrice: 100,
    monthlyPrice: 20,
};

const mockDiscounts: Discount[] = [
    {
        id: 'd1',
        name: 'Setup Discount',
        type: 'one-time',
        valueType: 'percentage',
        value: 10,
        status: 'active',
    },
    {
        id: 'd2',
        name: 'Inactive Discount',
        type: 'one-time',
        valueType: 'percentage' as const,
        value: 5,
        status: 'inactive',
    },
];

describe('SideCart', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(formatCurrency).mockImplementation(
            (value: number) => `$${value}`
        );

        vi.mocked(applyDiscounts).mockReturnValue(90);

        vi.mocked(getMonthlyCartLines).mockReturnValue([
            {
                label: 'Months 1-3',
                price: 15,
            },
            {
                label: 'Month 4+',
                price: 20,
            },
        ]);
    });

    it('renders overview section', () => {
        render(
            <SideCart
                product={mockProduct}
                discounts={mockDiscounts}
            />
        );

        expect(screen.getByText('Overview')).toBeInTheDocument();
        expect(screen.getByText('Premium Plan')).toBeInTheDocument();
        expect(screen.getByText('Monthly price')).toBeInTheDocument();
    });

    it('renders edit button', () => {
        render(
            <SideCart
                product={mockProduct}
                discounts={mockDiscounts}
            />
        );

        expect(
            screen.getByRole('button', { name: /edit/i })
        ).toBeInTheDocument();
    });

    it('renders monthly pricing breakdown', () => {
        render(
            <SideCart
                product={mockProduct}
                discounts={mockDiscounts}
            />
        );

        expect(screen.getByText('Months 1-3')).toBeInTheDocument();
        expect(screen.getByText('Month 4+')).toBeInTheDocument();
        expect(screen.getByText('$15')).toBeInTheDocument();
        expect(screen.getAllByText('$20').length).toBeGreaterThan(0);
    });

    it('renders only active one-time discounts', () => {
        render(
            <SideCart
                product={mockProduct}
                discounts={mockDiscounts}
            />
        );

        expect(
            screen.getByText('Setup Discount')
        ).toBeInTheDocument();

        expect(
            screen.queryByText('Inactive Discount')
        ).not.toBeInTheDocument();
    });

    it('renders discount description for percentage discounts', () => {
        render(
            <SideCart
                product={mockProduct}
                discounts={mockDiscounts}
            />
        );

        expect(
            screen.getByText('- 10% one time')
        ).toBeInTheDocument();
    });

    it('renders subtotal and discounted total', () => {
        render(
            <SideCart
                product={mockProduct}
                discounts={mockDiscounts}
            />
        );

        expect(
            screen.getByText('Subtotal one-time costs excl. btw')
        ).toBeInTheDocument();

        expect(
            screen.getByText('One-time costs excl. btw')
        ).toBeInTheDocument();

        expect(screen.getByText('$90')).toBeInTheDocument();
    });

    it('passes only active discounts to pricing utilities', () => {
        render(
            <SideCart
                product={mockProduct}
                discounts={mockDiscounts}
            />
        );

        expect(applyDiscounts).toHaveBeenCalledWith(
            100,
            [mockDiscounts[0]],
            'one-time'
        );

        expect(getMonthlyCartLines).toHaveBeenCalledWith(
            20,
            [mockDiscounts[0]]
        );
    });
});