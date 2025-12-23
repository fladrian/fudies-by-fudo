interface EmptyStateProps {
  content: string
  className?: string
}

export const EmptyState = ({ content, className = '' }: EmptyStateProps) => {
  return (
    <div className={`bg-surface rounded-lg shadow-card p-8 text-center ${className}`}>
      <p className="text-gray">{content}</p>
    </div>
  )
}
