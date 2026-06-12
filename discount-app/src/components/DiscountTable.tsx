import { Pencil, Trash2 } from 'lucide-react'
import { Discount } from '../types'

interface Props {
    discounts: Discount[]
    onEdit: (d: Discount) => void
    onDelete: (d: Discount) => void
    onToggle: (d: Discount) => void
    canAddManualDiscount?: boolean
    onAddManual?: () => void
}

export function DiscountTable({
    discounts,
    onEdit,
    onDelete,
    onToggle,
    canAddManualDiscount,
    onAddManual,
}: Props) {
    const hasManualDiscount = discounts.some(d => d.isManual)

    // When no discounts exist AND manual discount is disabled — skip rendering
    if (discounts.length === 0 && !canAddManualDiscount) {
        return null
    }

    const getDiscountLabel = (d: Discount) => {
        const value =
            d.valueType === 'percentage'
                ? `${d.value}%`
                : `£${d.value.toFixed(2)}`

        if (d.type === 'one-time') return `- ${value} one time`
        if (d.durationMonths) return `- ${value} monthly first ${d.durationMonths} months`
        return `- ${value} monthly`
    }

    return (
        <div className="border border-brand-light bg-white">
            {/* Header */}
            <div className="h-[40px] flex items-center justify-end px-4 border-b border-brand-light">
                {canAddManualDiscount && !hasManualDiscount && (
                    <button
                        onClick={onAddManual}
                        className="text-brand text-[11px] hover:opacity-80 transition-opacity"
                    >
                        + Add manual discount
                    </button>
                )}
            </div>

            {/* Empty state */}
            {discounts.length === 0 && (
                <div className="py-10 text-center text-[#888] text-sm">
                    No discounts available
                </div>
            )}

            {/* Rows */}
            {discounts.map(d => (
                <div
                    key={d.id}
                    className="flex items-center min-h-[58px] border-b border-[#ececec] px-4 last:border-b-0"
                >
                    {/* Name */}
                    <div className="flex-1 text-[12px] text-[#444] pr-4">
                        {d.name}
                    </div>

                    {/* Label */}
                    <div className="w-[260px] text-[12px] text-[#555]">
                        {getDiscountLabel(d)}
                    </div>

                    {/* Actions: edit + delete */}
                    <div className="w-[60px] flex items-center gap-3 justify-center">
                        <button
                            onClick={() => onEdit(d)}
                            title="Edit discount"
                            className="hover:opacity-70 transition-opacity"
                        >
                            <Pencil size={15} className="text-brand" />
                        </button>
                        <button
                            onClick={() => onDelete(d)}
                            title="Delete discount"
                            className="hover:opacity-70 transition-opacity"
                        >
                            <Trash2 size={15} className="text-[#999]" />
                        </button>
                    </div>

                    {/* Toggle switch */}
                    <div className="w-[60px] flex justify-end">
                        <button
                            onClick={() => onToggle(d)}
                            title={d.status === 'active' ? 'Deactivate discount' : 'Activate discount'}
                            className={`relative w-[40px] h-[18px] transition-colors focus:outline-none ${d.status === 'active' ? 'bg-brand' : 'bg-[#d8d8d8]'
                                }`}
                            role="switch"
                            aria-checked={d.status === 'active'}
                        >
                            <span
                                className={`absolute top-[2px] h-[14px] w-[14px] bg-white transition-all ${d.status === 'active' ? 'right-[2px]' : 'left-[2px]'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            ))}

        </div>
    )
}