export type DiscountType = 'one-time' | 'monthly'
export type DiscountValueType = 'percentage' | 'amount'
export type DiscountStatus = 'active' | 'inactive'

export interface Discount {
    id: string
    name: string
    type: DiscountType
    valueType: DiscountValueType
    value: number
    durationMonths?: number
    status: DiscountStatus
    isManual?: boolean
}

export interface CartProduct {
    name: string
    oneTimePrice: number
    monthlyPrice: number
}