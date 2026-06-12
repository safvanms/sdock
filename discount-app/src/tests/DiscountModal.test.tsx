import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DiscountModal } from '../components/DiscountModal'

const noop = vi.fn()

describe('DiscountModal', () => {
    it('renders Add title in add mode', () => {
        render(<DiscountModal mode="add" onSave={noop} onClose={noop} />)
        expect(screen.getByText('Add Discount')).toBeTruthy()
    })

    it('renders Edit title in edit mode', () => {
        const d = {
            id: '1', name: 'X', type: 'one-time' as const,
            valueType: 'percentage' as const, value: 10, status: 'active' as const
        }
        render(<DiscountModal mode="edit" initial={d} onSave={noop} onClose={noop} />)
        expect(screen.getByText('Edit Discount')).toBeTruthy()
    })

    it('shows duration field only for monthly type', () => {
        render(<DiscountModal mode="add" onSave={noop} onClose={noop} />)
        expect(screen.queryByText(/Duration/)).toBeNull()
        fireEvent.click(screen.getByText('Monthly'))
        expect(screen.getByText(/Duration/)).toBeTruthy()
    })

    it('shows status field only in edit mode', () => {
        render(<DiscountModal mode="add" onSave={noop} onClose={noop} />)
        expect(screen.queryByText('Status')).toBeNull()
    })

    it('validates empty name', () => {
        render(<DiscountModal mode="add" onSave={noop} onClose={noop} />)
        fireEvent.click(screen.getByText('Add Discount', { selector: 'button' }))
        expect(screen.getByText('Discount name is required')).toBeTruthy()
    })
})