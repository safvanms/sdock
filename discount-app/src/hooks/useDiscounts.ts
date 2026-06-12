import { useState, useCallback } from 'react'
import { Discount } from '../types'

let idCounter = 1

export function useDiscounts(initial: Discount[] = []) {
    const [discounts, setDiscounts] = useState<Discount[]>(initial)

    const addDiscount = useCallback((data: Omit<Discount, 'id'>) => {
        setDiscounts(prev => [...prev, { ...data, id: String(idCounter++) }])
    }, [])

    const updateDiscount = useCallback((id: string, data: Omit<Discount, 'id'>) => {
        setDiscounts(prev =>
            prev.map(d => (d.id === id ? { ...data, id } : d))
        )
    }, [])

    const deleteDiscount = useCallback((id: string) => {
        setDiscounts(prev => prev.filter(d => d.id !== id))
    }, [])

    const toggleDiscount = useCallback((id: string) => {
        setDiscounts(prev =>
            prev.map(d =>
                d.id === id
                    ? { ...d, status: d.status === 'active' ? 'inactive' : 'active' }
                    : d
            )
        )
    }, [])

    return { discounts, addDiscount, updateDiscount, deleteDiscount, toggleDiscount }
}