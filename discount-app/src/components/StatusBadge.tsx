import clsx from 'clsx'

interface Props {
    status: 'active' | 'inactive'
}

export function StatusBadge({ status }: Props) {
    return (
        <span
            className={clsx(
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                status === 'active'
                    ? 'bg-[#e6f9fb] text-brand'
                    : 'bg-gray-100 text-gray-400'
            )}
        >
            {status === 'active' ? 'Active' : 'Inactive'}
        </span>
    )
}