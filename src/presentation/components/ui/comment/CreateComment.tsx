import { useState } from 'react'
import { CommentForm, Button } from '@presentation/components'
import { Plus, X } from 'lucide-react'

interface CreateCommentProps {
  postId: string
  parentId?: string | null
  onSuccess?: () => void
  showToggleButton?: boolean
}

export const CreateComment = ({
  postId,
  parentId,
  onSuccess,
  showToggleButton = false,
}: CreateCommentProps) => {
  const [isVisible, setIsVisible] = useState(!showToggleButton)

  const handleToggle = () => {
    setIsVisible(prev => !prev)
  }

  const handleSuccess = () => {
    setIsVisible(false)
    onSuccess?.()
  }

  if (!showToggleButton) {
    return (
      <CommentForm postId={postId} parentId={parentId} onSuccess={onSuccess} onCancel={onSuccess} />
    )
  }

  return (
    <div className="relative">
      <>
        <div className="flex justify-end mb-4">
          <Button
            onClick={handleToggle}
            variant={isVisible ? 'secondary' : 'primary'}
            leftIcon={isVisible ? <X size={16} /> : <Plus size={16} />}
          >
            {isVisible ? 'Cancel' : 'New Comment'}
          </Button>
        </div>
        {isVisible && (
          <CommentForm
            postId={postId}
            parentId={parentId}
            onSuccess={handleSuccess}
            onCancel={handleToggle}
          />
        )}
      </>
    </div>
  )
}
