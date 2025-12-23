import { create } from 'zustand'
import type { StateCreator } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PersistOptions } from 'zustand/middleware'

interface UserState {
  name: string | null
  avatar: string | null
  setName: (name: string) => void
  setAvatar: (avatar: string) => void
  clearUser: () => void
  hasUser: () => boolean
}

type UserStatePersist = (
  config: StateCreator<UserState>,
  options: PersistOptions<UserState>
) => StateCreator<UserState>

export const useUserStore = create<UserState>()(
  (persist as UserStatePersist)(
    (set, get) => ({
      name: null,
      avatar: null,

      setName: (name: string) => {
        set({ name })
      },

      setAvatar: (avatar: string) => {
        set({ avatar })
      },

      clearUser: () => {
        set({ name: null, avatar: null })
      },

      hasUser: () => {
        const state = get()
        return !!(state.name && state.avatar)
      },
    }),
    {
      name: 'user-storage',
    }
  )
)
