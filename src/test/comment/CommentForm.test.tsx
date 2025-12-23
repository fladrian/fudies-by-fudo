import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@test/utils/testUtils'
import userEvent from '@testing-library/user-event'
import { CommentForm } from '@presentation/components/ui/comment/CommentForm'
import * as hooks from '@presentation/hooks'
import * as userStore from '@application'

type MockMutationResult = {
  mutate: ReturnType<typeof vi.fn>
  isPending: boolean
}

vi.mock('@presentation/hooks', () => ({
  useCreateComment: vi.fn(),
  useUpdateComment: vi.fn(),
}))

vi.mock('@application', () => ({
  useUserStore: vi.fn(),
}))

const mockComment = {
  id: '1',
  content: 'Test comment',
  name: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  parentId: null,
  createdAt: new Date('2024-01-01'),
}

describe('CommentForm', () => {
  const mockCreateComment: MockMutationResult = {
    mutate: vi.fn(),
    isPending: false,
  }

  const mockUpdateComment: MockMutationResult = {
    mutate: vi.fn(),
    isPending: false,
  }

  const mockUserStore = {
    avatar: null,
    name: null,
    hasUser: () => false,
    setName: vi.fn(),
    setAvatar: vi.fn(),
    clearUser: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(hooks.useCreateComment).mockReturnValue(
      mockCreateComment as unknown as ReturnType<typeof hooks.useCreateComment>
    )
    vi.mocked(hooks.useUpdateComment).mockReturnValue(
      mockUpdateComment as unknown as ReturnType<typeof hooks.useUpdateComment>
    )
    vi.mocked(userStore.useUserStore).mockImplementation(
      ((selector: (state: unknown) => unknown) => {
        return selector(mockUserStore)
      }) as unknown as Parameters<ReturnType<typeof vi.mocked<typeof userStore.useUserStore>>['mockImplementation']>[0]
    )
  })

  it('renders create form correctly', () => {
    render(<CommentForm postId="1" />)
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Write your comment here...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /comment/i })).toBeInTheDocument()
  })

  it('renders edit form correctly', () => {
    render(<CommentForm postId="1" comment={mockComment} />)
    expect(screen.getByDisplayValue('Test comment')).toBeInTheDocument()
    // Name and avatar fields are not shown when editing
    expect(screen.queryByDisplayValue('Test User')).not.toBeInTheDocument()
    expect(screen.getByLabelText(/edit comment/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument()
  })

  it('shows reply label when parentId is provided', () => {
    render(<CommentForm postId="1" parentId="parent-1" />)
    expect(screen.getByLabelText(/reply/i)).toBeInTheDocument()
  })

  it('shows UserDisplay when user is stored', () => {
    vi.mocked(userStore.useUserStore).mockImplementation(
      ((selector: (state: unknown) => unknown) => {
        const store = {
          ...mockUserStore,
          hasUser: () => true,
          name: 'Stored User',
          avatar: 'https://example.com/stored.jpg',
        }
        return selector(store)
      }) as unknown as Parameters<ReturnType<typeof vi.mocked<typeof userStore.useUserStore>>['mockImplementation']>[0]
    )

    render(<CommentForm postId="1" />)
    expect(screen.queryByPlaceholderText('Your name')).not.toBeInTheDocument()
  })

  it('does not show name/avatar fields when editing', () => {
    render(<CommentForm postId="1" comment={mockComment} />)
    expect(screen.queryByPlaceholderText('Your name')).not.toBeInTheDocument()
  })

  it('calls createComment on submit', async () => {
    const user = userEvent.setup()
    render(<CommentForm postId="1" />)

    await user.type(screen.getByPlaceholderText('Your name'), 'New User')
    await user.type(screen.getByPlaceholderText('Write your comment here...'), 'New Comment')
    await user.click(screen.getByRole('button', { name: /comment/i }))

    await waitFor(() => {
      expect(mockCreateComment.mutate).toHaveBeenCalled()
    })
  })

  it('calls updateComment when editing', async () => {
    const user = userEvent.setup()
    render(<CommentForm postId="1" comment={mockComment} />)

    const contentInput = screen.getByDisplayValue('Test comment')
    await user.clear(contentInput)
    await user.type(contentInput, 'Updated Comment')
    await user.click(screen.getByRole('button', { name: /update/i }))

    await waitFor(() => {
      expect(mockUpdateComment.mutate).toHaveBeenCalledWith({
        postId: '1',
        commentId: '1',
        comment: expect.objectContaining({
          content: 'Updated Comment',
        }),
      })
    })
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<CommentForm postId="1" onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalled()
  })

  it('shows loading state when submitting', () => {
    vi.mocked(hooks.useCreateComment).mockReturnValue({
      ...mockCreateComment,
      isPending: true,
    } as unknown as ReturnType<typeof hooks.useCreateComment>)

    render(<CommentForm postId="1" />)
    const submitButton = screen.getByRole('button', { name: /comment/i })
    expect(submitButton).toBeDisabled()
  })
})

