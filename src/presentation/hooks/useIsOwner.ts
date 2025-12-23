import { useOwnershipStore } from '@application'

export const OWNERSHIP_TYPES = {
  POST: 'post',
  COMMENT: 'comment',
} as const

type OwnershipType = (typeof OWNERSHIP_TYPES)[keyof typeof OWNERSHIP_TYPES]

export const useIsOwner = (type: OwnershipType, id: string): boolean => {
  const isPostOwner = useOwnershipStore(state => state.isPostOwner)
  const isCommentOwner = useOwnershipStore(state => state.isCommentOwner)

  if (type === 'post') {
    return isPostOwner(id)
  }

  return isCommentOwner(id)
}
