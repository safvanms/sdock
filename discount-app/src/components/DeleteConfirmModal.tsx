interface Props {
    discountName: string
    onConfirm: () => void
    onClose: () => void
}

export function DeleteConfirmModal({
    onConfirm,
    onClose,
}: Props) {
    return (
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white w-[500px] max-w-[calc(100vw-2rem)] shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#bcbcbc] text-xl hover:text-[#888]"
                >
                    ×
                </button>

                <div className="p-6">
                    <h2 className="text-[18px] font-semibold text-[#666] mb-6">
                        Delete discount
                    </h2>

                    <p className="text-[14px] text-[#777]">
                        Are you sure you want to delete this discount?
                    </p>

                    <div className="flex justify-end mt-10">
                        <button
                            onClick={() => {
                                onConfirm()
                                onClose()
                            }}
                            className="bg-[#d85b45] hover:bg-[#c84e39] text-white px-3 py-2 text-xs font-medium transition-colors"
                        >
                            Delete discount
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}