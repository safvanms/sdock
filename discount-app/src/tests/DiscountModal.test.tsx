import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DiscountModal } from '../components/DiscountModal';

const mockOnSave = vi.fn();
const mockOnClose = vi.fn();

describe('DiscountModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders Add title in add mode', () => {
        render(
            <DiscountModal
                mode="add"
                onSave={mockOnSave}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText('Add Discount')).toBeInTheDocument();
    });

    it('renders Edit title in edit mode', () => {
        const discount = {
            id: '1',
            name: 'X',
            type: 'one-time' as const,
            valueType: 'percentage' as const,
            value: 10,
            status: 'active' as const,
        };

        render(
            <DiscountModal
                mode="edit"
                initial={discount}
                onSave={mockOnSave}
                onClose={mockOnClose}
            />
        );

        expect(screen.getByText('Edit Discount')).toBeInTheDocument();
    });

    it('shows duration field only for monthly type', async () => {
        const user = userEvent.setup();

        render(
            <DiscountModal
                mode="add"
                onSave={mockOnSave}
                onClose={mockOnClose}
            />
        );

        expect(screen.queryByText(/Duration/i)).not.toBeInTheDocument();

        await user.click(screen.getByText('Monthly'));

        expect(screen.getByText(/Duration/i)).toBeInTheDocument();
    });

    it('shows status field only in edit mode', () => {
        render(
            <DiscountModal
                mode="add"
                onSave={mockOnSave}
                onClose={mockOnClose}
            />
        );

        expect(screen.queryByText('Status')).not.toBeInTheDocument();
    });

    it('validates empty name', async () => {
        const user = userEvent.setup();

        render(
            <DiscountModal
                mode="add"
                onSave={mockOnSave}
                onClose={mockOnClose}
            />
        );

        await user.click(
            screen.getByRole('button', { name: /add discount/i })
        );

        expect(
            screen.getByText('Discount name is required')
        ).toBeInTheDocument();
    });
});