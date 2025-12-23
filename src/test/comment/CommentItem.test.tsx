import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@test/utils/testUtils'
import userEvent from '@testing-library/user-event'
import { CommentItem } from '@presentation/components/ui/comment/CommentItem'
import * as hooks from '@presentation/hooks'
import type { Comment } from '@core'

type MockMutationResult = {
  mutate: ReturnType<typeof vi.fn>
  isPending: boolean
}

vi.mock('@presentation/hooks', async () => {
  const actual = await vi.importActual('@presentation/hooks')
  return {
    ...actual,
    useDeleteComment: vi.fn(),
    useIsOwner: vi.fn(),
    useCreateComment: vi.fn(),
    useUpdateComment: vi.fn(),
  }
})

const mockComment: Comment = {
  id: '1',
  content: 'Test comment',
  name: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  parentId: null,
  createdAt: new Date('2024-01-01'),
}

describe('CommentItem', () => {
  const mockDeleteComment: MockMutationResult = {
    mutate: vi.fn(),
    isPending: false,
  }

  const mockCreateComment: MockMutationResult = {
    mutate: vi.fn(),
    isPending: false,
  }

  const mockUpdateComment: MockMutationResult = {
    mutate: vi.fn(),
    isPending: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(hooks.useDeleteComment).mockReturnValue(mockDeleteComment as unknown as ReturnType<typeof hooks.useDeleteComment>)
    vi.mocked(hooks.useIsOwner).mockReturnValue(false)
    vi.mocked(hooks.useCreateComment).mockReturnValue(mockCreateComment as unknown as ReturnType<typeof hooks.useCreateComment>)
    vi.mocked(hooks.useUpdateComment).mockReturnValue(mockUpdateComment as unknown as ReturnType<typeof hooks.useUpdateComment>)
  })

  it('renders comment information correctly', () => {
    render(<CommentItem comment={mockComment} postId="1" level={0} />)
    expect(screen.getByText('Test comment')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByAltText('Test User')).toHaveAttribute('src', mockComment.avatar)
  })

  it('shows reply button for all users', () => {
    render(<CommentItem comment={mockComment} postId="1" level={0} />)
    expect(screen.getByLabelText(/reply/i)).toBeInTheDocument()
  })

  it('shows edit and delete buttons when user is owner', () => {
    vi.mocked(hooks.useIsOwner).mockReturnValue(true)
    render(<CommentItem comment={mockComment} postId="1" level={0} />)

    expect(screen.getByLabelText(/edit comment/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/delete comment/i)).toBeInTheDocument()
  })

  it('does not show edit and delete buttons when user is not owner', () => {
    vi.mocked(hooks.useIsOwner).mockReturnValue(false)
    render(<CommentItem comment={mockComment} postId="1" level={0} />)

    expect(screen.queryByLabelText(/edit comment/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/delete comment/i)).not.toBeInTheDocument()
  })

  it('shows CommentForm when reply button is clicked', async () => {
    const user = userEvent.setup()
    render(<CommentItem comment={mockComment} postId="1" level={0} />)

    await user.click(screen.getByLabelText(/reply/i))
    // CreateComment component renders CommentForm
    expect(screen.getByPlaceholderText(/write your comment here/i)).toBeInTheDocument()
  })

  it('shows CommentForm when edit button is clicked', async () => {
    const user = userEvent.setup()
    vi.mocked(hooks.useIsOwner).mockReturnValue(true)
    render(<CommentItem comment={mockComment} postId="1" level={0} />)

    await user.click(screen.getByLabelText(/edit comment/i))
    expect(screen.getByDisplayValue('Test comment')).toBeInTheDocument()
  })

  it('opens delete modal when delete button is clicked', async () => {
    const user = userEvent.setup()
    vi.mocked(hooks.useIsOwner).mockReturnValue(true)
    render(<CommentItem comment={mockComment} postId="1" level={0} />)

    await user.click(screen.getByLabelText(/delete comment/i))
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    expect(screen.getByText(/delete comment/i)).toBeInTheDocument()
  })

  it('calls deleteComment when confirm is clicked in modal', async () => {
    const user = userEvent.setup()
    vi.mocked(hooks.useIsOwner).mockReturnValue(true)
    render(<CommentItem comment={mockComment} postId="1" level={0} />)

    await user.click(screen.getByLabelText(/delete comment/i))
    const confirmButton = screen.getByRole('button', { name: /^delete$/i })
    await user.click(confirmButton)

    await waitFor(() => {
      expect(mockDeleteComment.mutate).toHaveBeenCalledWith({
        postId: '1',
        commentId: '1',
      })
    })
  })

  it('shows loading state when deleting', () => {
    vi.mocked(hooks.useIsOwner).mockReturnValue(true)
    vi.mocked(hooks.useDeleteComment).mockReturnValue({
      ...mockDeleteComment,
      isPending: true,
    } as unknown as ReturnType<typeof hooks.useDeleteComment>)

    render(<CommentItem comment={mockComment} postId="1" level={0} />)
    const deleteButton = screen.getByLabelText(/delete comment/i)
    expect(deleteButton).toBeDisabled()
  })

  it('applies nested styles when level > 0', () => {
    const { container } = render(<CommentItem comment={mockComment} postId="1" level={1} />)
    // Check for nested comment styling (border-left, margin-left)
    const commentElement = container.querySelector('.bg-surface-muted')
    expect(commentElement).toBeInTheDocument()
  })
})

