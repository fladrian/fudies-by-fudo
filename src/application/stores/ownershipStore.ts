import { create } from 'zustand'
import type { StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PersistOptions } from 'zustand/middleware'

interface OwnershipState {
  ownedPostIds: Set<string>
  ownedCommentIds: Set<string>
  addOwnedPost: (postId: string) => void
  addOwnedComment: (commentId: string) => void
  removeOwnedPost: (postId: string) => void
  removeOwnedComment: (commentId: string) => void
  isPostOwner: (postId: string) => boolean
  isCommentOwner: (commentId: string) => boolean
}

type OwnershipStatePersist = (
  config: StateCreator<OwnershipState>,
  options: PersistOptions<OwnershipState>
) => StateCreator<OwnershipState>

export const useOwnershipStore = create<OwnershipState>()(
  (persist as OwnershipStatePersist)(
    (set, get) => ({
      ownedPostIds: new Set<string>(),
      ownedCommentIds: new Set<string>(),

      addOwnedPost: (postId: string) => {
        set(state => {
          const newSet = new Set(state.ownedPostIds)
          newSet.add(postId)
          return { ownedPostIds: newSet }
        })
      },

      addOwnedComment: (commentId: string) => {
        set(state => {
          const newSet = new Set(state.ownedCommentIds)
          newSet.add(commentId)
          return { ownedCommentIds: newSet }
        })
      },

      removeOwnedPost: (postId: string) => {
        set(state => {
          const newSet = new Set(state.ownedPostIds)
          newSet.delete(postId)
          return { ownedPostIds: newSet }
        })
      },

      removeOwnedComment: (commentId: string) => {
        set(state => {
          const newSet = new Set(state.ownedCommentIds)
          newSet.delete(commentId)
          return { ownedCommentIds: newSet }
        })
      },

      isPostOwner: (postId: string) => {
        return get().ownedPostIds.has(postId)
      },

      isCommentOwner: (commentId: string) => {
        return get().ownedCommentIds.has(commentId)
      },
    }),
    {
      name: 'ownership-storage',
      storage: {
        getItem: name => {
          const str = localStorage.getItem(name)
          if (!str) return null
          const parsed = JSON.parse(str)
          return {
            state: {
              ...parsed.state,
              ownedPostIds: new Set(parsed.state.ownedPostIds || []),
              ownedCommentIds: new Set(parsed.state.ownedCommentIds || []),
            },
            version: parsed.version,
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(
            name,
            JSON.stringify({
              state: {
                ...value.state,
                ownedPostIds: Array.from(value.state.ownedPostIds),
                ownedCommentIds: Array.from(value.state.ownedCommentIds),
              },
              version: value.version,
            })
          )
        },
        removeItem: name => localStorage.removeItem(name),
      },
    }
  )
)
