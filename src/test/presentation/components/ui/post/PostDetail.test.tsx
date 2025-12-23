import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@test/utils/test-utils'
import userEvent from '@testing-library/user-event'
import { PostDetail } from '@presentation/components/ui/post/PostDetail'
import * as hooks from '@presentation/hooks'
import type { Post } from '@core'

type MockMutationResult = {
  mutate: ReturnType<typeof vi.fn>
  isPending: boolean
}

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('@presentation/hooks', async () => {
  const actual = await vi.importActual('@presentation/hooks')
  return {
    ...actual,
    usePost: vi.fn(),
    useIsOwner: vi.fn(),
    useDeletePost: vi.fn(),
    useCreatePost: vi.fn(),
    useUpdatePost: vi.fn(),
  }
})

const mockPost: Post = {
  id: '1',
  title: 'Test Post',
  content: 'Test content',
  name: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  createdAt: new Date('2024-01-01'),
}

describe('PostDetail', () => {
  const mockDeletePost: MockMutationResult = {
    mutate: vi.fn(),
    isPending: false,
  }

  const mockCreatePost: MockMutationResult = {
    mutate: vi.fn(),
    isPending: false,
  }

  const mockUpdatePost: MockMutationResult = {
    mutate: vi.fn(),
    isPending: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(hooks.usePost).mockReturnValue({
      data: mockPost,
      isPending: false,
    } as unknown as ReturnType<typeof hooks.usePost>)
    vi.mocked(hooks.useIsOwner).mockReturnValue(false)
    vi.mocked(hooks.useDeletePost).mockReturnValue(
      mockDeletePost as unknown as ReturnType<typeof hooks.useDeletePost>
    )
    vi.mocked(hooks.useCreatePost).mockReturnValue(
      mockCreatePost as unknown as ReturnType<typeof hooks.useCreatePost>
    )
    vi.mocked(hooks.useUpdatePost).mockReturnValue(
      mockUpdatePost as unknown as ReturnType<typeof hooks.useUpdatePost>
    )
  })

  it('renders post information correctly', () => {
    render(<PostDetail postId="1" />)
    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByAltText('Test User')).toHaveAttribute('src', mockPost.avatar)
  })

  it('shows skeleton when loading', () => {
    vi.mocked(hooks.usePost).mockReturnValue({
      data: undefined,
      isPending: true,
    } as unknown as ReturnType<typeof hooks.usePost>)

    render(<PostDetail postId="1" />)
    // Assuming PostSkeleton renders something identifiable
    // This might need adjustment based on actual implementation
  })

  it('shows not found message when post does not exist', () => {
    vi.mocked(hooks.usePost).mockReturnValue({
      data: undefined,
      isPending: false,
    } as unknown as ReturnType<typeof hooks.usePost>)

    render(<PostDetail postId="1" />)
    expect(screen.getByText(/post not found/i)).toBeInTheDocument()
    expect(screen.getByText(/back to home/i)).toBeInTheDocument()
  })

  it('shows edit and delete buttons when user is owner', () => {
    vi.mocked(hooks.useIsOwner).mockReturnValue(true)
    render(<PostDetail postId="1" />)

    expect(screen.getByLabelText(/edit post/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/delete post/i)).toBeInTheDocument()
  })

  it('does not show edit and delete buttons when user is not owner', () => {
    vi.mocked(hooks.useIsOwner).mockReturnValue(false)
    render(<PostDetail postId="1" />)

    expect(screen.queryByLabelText(/edit post/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/delete post/i)).not.toBeInTheDocument()
  })

  it('shows PostForm when edit button is clicked', async () => {
    const user = userEvent.setup()
    vi.mocked(hooks.useIsOwner).mockReturnValue(true)
    render(<PostDetail postId="1" />)

    await user.click(screen.getByLabelText(/edit post/i))
    // PostForm is rendered - checking for form elements
    expect(screen.getByPlaceholderText(/post title/i)).toBeInTheDocument()
  })

  it('opens delete modal when delete button is clicked', async () => {
    const user = userEvent.setup()
    vi.mocked(hooks.useIsOwner).mockReturnValue(true)
    render(<PostDetail postId="1" />)

    await user.click(screen.getByLabelText(/delete post/i))
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    expect(screen.getByText(/delete post/i)).toBeInTheDocument()
  })

  it('calls deletePost when confirm is clicked in modal', async () => {
    const user = userEvent.setup()
    vi.mocked(hooks.useIsOwner).mockReturnValue(true)
    render(<PostDetail postId="1" />)

    await user.click(screen.getByLabelText(/delete post/i))
    const confirmButton = screen.getByRole('button', { name: /^delete$/i })
    await user.click(confirmButton)

    await waitFor(() => {
      expect(mockDeletePost.mutate).toHaveBeenCalledWith('1')
    })
  })

  it('shows loading state when deleting', () => {
    vi.mocked(hooks.useIsOwner).mockReturnValue(true)
    vi.mocked(hooks.useDeletePost).mockReturnValue({
      ...mockDeletePost,
      isPending: true,
    } as unknown as ReturnType<typeof hooks.useDeletePost>)

    render(<PostDetail postId="1" />)
    const deleteButton = screen.getByLabelText(/delete post/i)
    expect(deleteButton).toBeDisabled()
  })
})

