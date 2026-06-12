import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { Discount, DiscountType, DiscountValueType } from '../types'

interface Props {
    mode: 'add' | 'edit'
    initial?: Discount
    onSave: (data: Omit<Discount, 'id'>) => void
    onClose: () => void
    /** When true, the price-type toggle (one-time vs monthly) is hidden */
    singlePriceType?: 'one-time' | 'monthly'
}

const EMPTY: Omit<Discount, 'id'> = {
    name: '',
    type: 'one-time',
    valueType: 'percentage',
    value: 0,
    durationMonths: undefined,
    status: 'active',
}

export function DiscountModal({ mode, initial, onSave, onClose, singlePriceType }: Props) {
    const [form, setForm] = useState<Omit<Discount, 'id'>>(
        initial ? { ...initial } : { ...EMPTY, type: singlePriceType ?? 'one-time' }
    )
    const [errors, setErrors] = useState<Partial<Record<keyof Discount, string>>>({})

    useEffect(() => {
        setForm(
            initial
                ? { ...initial }
                : { ...EMPTY, type: singlePriceType ?? 'one-time' }
        )
        setErrors({})
    }, [initial, mode, singlePriceType])

    const set = <K extends keyof Omit<Discount, 'id'>>(
        key: K,
        value: Omit<Discount, 'id'>[K]
    ) => {
        setForm(prev => ({ ...prev, [key]: value }))
        setErrors(prev => ({ ...prev, [key]: undefined }))
    }

    const validate = () => {
        const e: typeof errors = {}
        if (!form.name.trim()) e.name = 'Discount name is required'
        if (form.value <= 0) e.value = 'Value must be greater than 0'
        if (form.valueType === 'percentage' && form.value > 100)
            e.value = 'Percentage cannot exceed 100'
        if (
            form.type === 'monthly' &&
            form.durationMonths !== undefined &&
            form.durationMonths < 1
        )
            e.durationMonths = 'Duration must be at least 1 month'
        return e
    }

    const handleSave = () => {
        const e = validate()
        if (Object.keys(e).length > 0) { setErrors(e); return }
        const payload = { ...form }
        if (payload.type === 'one-time') delete payload.durationMonths
        onSave(payload)
        onClose()
    }

    const title = mode === 'add' ? 'Add Discount' : 'Edit Discount'

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white w-[760px] shadow-xl rounded-sm"
                onClick={e => e.stopPropagation()}
            >
                <div className="px-8 py-8">
                    <h2 className="text-[18px] font-semibold text-[#333] mb-8">
                        {title}
                    </h2>

                    {/* Price Type — hidden when product has only one price type */}
                    {!singlePriceType && (
                        <div className="mb-6">
                            <label className="block text-[13px] text-[#555] mb-3">
                                For which price do you calculate the discount?
                            </label>
                            <div className="flex gap-2">
                                {([
                                    { value: 'one-time', label: 'One time price' },
                                    { value: 'monthly', label: 'Monthly price' },
                                ] as { value: DiscountType; label: string }[]).map(item => {
                                    const active = form.type === item.value
                                    return (
                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() => set('type', item.value)}
                                            className={clsx(
                                                'w-[185px] h-[60px] px-4 rounded-[8px] flex items-center justify-between transition-colors',
                                                active
                                                    ? 'bg-brand text-white'
                                                    : 'bg-[#efefef] text-[#666666]'
                                            )}
                                        >
                                            <span className="text-[14px] font-medium">
                                                {item.label}
                                            </span>
                                            <span
                                                className={clsx(
                                                    'w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold',
                                                    active
                                                        ? 'bg-white text-brand'
                                                        : 'bg-white text-transparent'
                                                )}
                                            >
                                                ✓
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Discount value */}
                    <div className="mb-5">
                        <label className="block text-[13px] text-[#555] mb-2">
                            Discount
                        </label>
                        <div className="flex">
                            <select
                                value={form.valueType}
                                onChange={e =>
                                    set('valueType', e.target.value as DiscountValueType)
                                }
                                className="w-[60px] border border-[#d8d8d8] border-r-0 px-2 bg-gray-100 text-[13px] focus:outline-none"
                            >
                                <option value="percentage">%</option>
                                <option value="amount">£</option>
                            </select>
                            <input
                                type="number"
                                min={0}
                                value={form.value || ''}
                                onChange={e => set('value', Number(e.target.value))}
                                className="flex-1 border border-[#d8d8d8] px-3 py-2 text-[13px] focus:outline-none focus:border-brand"
                            />
                        </div>
                        {errors.value && (
                            <span className="text-red-500 text-xs mt-1 block">
                                {errors.value}
                            </span>
                        )}
                    </div>

                    {/* Duration — only visible for monthly type */}
                    {form.type === 'monthly' && (
                        <div className="mb-5">
                            <label className="block text-[13px] text-[#555] mb-2">
                                Duration
                            </label>
                            <input
                                type="number"
                                min={1}
                                placeholder="Number of months"
                                value={form.durationMonths ?? ''}
                                onChange={e =>
                                    set(
                                        'durationMonths',
                                        e.target.value ? Number(e.target.value) : undefined
                                    )
                                }
                                className="w-full border border-[#d8d8d8] px-3 py-2 text-[13px] focus:outline-none focus:border-brand"
                            />
                            {errors.durationMonths && (
                                <span className="text-red-500 text-xs mt-1 block">
                                    {errors.durationMonths}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Description / Name */}
                    <div className="mb-10">
                        <label className="block text-[13px] text-[#555] mb-2">
                            Description
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => set('name', e.target.value)}
                            className="w-full border border-[#d8d8d8] px-3 py-2 text-[13px] focus:outline-none focus:border-brand"
                        />
                        {errors.name && (
                            <span className="text-red-500 text-xs mt-1 block">
                                {errors.name}
                            </span>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={onClose}
                            className="text-[#28c1db] text-sm hover:underline"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="bg-[#28c1db] text-white px-6 py-2 text-sm hover:bg-brand-hover transition-colors"
                        >
                            {mode === 'add' ? 'Add' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}