import { useState } from 'react'
import { Discount, CartProduct } from './types'
import { useDiscounts } from './hooks/useDiscounts'
import { DiscountTable } from './components/DiscountTable'
import { DiscountModal } from './components/DiscountModal'
import { SideCart } from './components/SideCart'
import { DeleteConfirmModal } from './components/DeleteConfirmModal'
// Demo product — replace with real data source
const PRODUCT: CartProduct = {
  name: 'Kortingja',
  oneTimePrice: 1500.0,
  monthlyPrice: 37.5,
}

// Pre-seeded automatic discounts (as if coming from admin)
const INITIAL_DISCOUNTS: Discount[] = [
  {
    id: 'auto-1',
    name: 'Discount name',
    type: 'one-time',
    valueType: 'percentage',
    value: 17.5,
    status: 'active',
    isManual: false,
  },
  {
    id: 'auto-2',
    name: 'Discount name',
    type: 'monthly',
    valueType: 'percentage',
    value: 25,
    durationMonths: 3,
    status: 'active',
    isManual: false,
  },
  {
    id: 'auto-3',
    name: 'Discount name',
    type: 'monthly',
    valueType: 'amount',
    value: 5,
    status: 'active',
    isManual: false,
  },
]

type ModalState =
  | { open: false }
  | { open: true; mode: 'add' }
  | { open: true; mode: 'edit'; discount: Discount }

export default function App() {
  const { discounts, addDiscount, updateDiscount, deleteDiscount, toggleDiscount } =
    useDiscounts(INITIAL_DISCOUNTS)
  const [deleteTarget, setDeleteTarget] = useState<Discount | null>(null)

  const [modal, setModal] = useState<ModalState>({ open: false })

  // Admin flag — toggle this to simulate admin enabling/disabling manual discounts
  const [canAddManualDiscount] = useState(true)

  const handleSave = (data: Omit<Discount, 'id'>) => {
    if (modal.open && modal.mode === 'edit') {
      updateDiscount(modal.discount.id, data)
    } else {
      addDiscount({ ...data, isManual: true })
    }
  }

  const handleEdit = (d: Discount) => {
    setModal({ open: true, mode: 'edit', discount: d })
  }

  const handleDelete = (d: Discount) => {
    setDeleteTarget(d)
  }

  const handleToggle = (d: Discount) => {
    toggleDiscount(d.id)
  }

  const steps = [
    'Discounts',
    'Klantgegevens',
    'Productgegevens',
    'Checkout',
  ]

  const [activeStep, setActiveStep] = useState('Discounts')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}

      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col min-[851px]:flex-row">
          {/* Main Content */}
          <main className="flex-1 p-2 md:p-2 min-w-0">

            {deleteTarget && (
              <DeleteConfirmModal
                discountName={deleteTarget.name}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => {
                  deleteDiscount(deleteTarget.id)
                  setDeleteTarget(null)
                }}
              />
            )}

            <div className="border border-brand-light bg-white">
              {/* Active Header */}
              <div className="bg-brand text-white px-4 h-[40px] flex items-center text-sm font-medium">
                {activeStep}
              </div>

              {/* Content */}
              <div className="min-h-[450px]">
                {activeStep === 'Discounts' ? (
                  <DiscountTable
                    discounts={discounts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                    canAddManualDiscount={canAddManualDiscount}
                    onAddManual={() =>
                      setModal({
                        open: true,
                        mode: 'add',
                      })
                    }
                  />
                ) : (
                  <div className="h-full min-h-[450px] flex items-center justify-center">
                    <span className="text-[#999]">
                      No data available
                    </span>
                  </div>
                )}
              </div>

              {/* Inactive Pages */}
              <div>
                {steps
                  .filter(step => step !== activeStep)
                  .map(step => (
                    <button
                      key={step}
                      onClick={() => setActiveStep(step)}
                      className="
            w-full
            text-left
            px-4
            py-4
            text-sm
            bg-[#d8d8d8]
            text-[#666]
            border-t
            border-[#cfcfcf]
            hover:bg-[#cfcfcf]
            transition-colors
          "
                    >
                      {step}
                    </button>
                  ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
              <button className="text-brand text-sm hover:underline">
                Previous
              </button>

              <button className="bg-brand hover:bg-brand-hover text-white px-6 py-2 text-sm transition-colors">
                Next
              </button>
            </div>
          </main>

          {/* Side Cart */}
          <aside
            className="
        w-full
        min-[851px]:w-[320px]
        shrink-0
        min-[851px]:border-t-0
        order-last
    "
          >
            <div className="p-2 md:p-2">
              <SideCart
                product={PRODUCT}
                discounts={discounts}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <DiscountModal
          mode={modal.mode}
          initial={
            modal.mode === 'edit'
              ? modal.discount
              : undefined
          }
          onSave={handleSave}
          onClose={() =>
            setModal({ open: false })
          }
        />
      )}
    </div>
  )
}