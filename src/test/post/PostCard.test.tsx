import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@test/utils/testUtils'
import userEvent from '@testing-library/user-event'
import { PostCard } from '@presentation/components/ui/post/PostCard'
import * as hooks from '@presentation/hooks'
import type { Post } from '@core'

type MockDeletePostResult = {
  mutateAsync: ReturnType<typeof vi.fn>
  isPending: boolean
}

type MockMutationResult = {
  mutate: ReturnType<typeof vi.fn>
  isPending: boolean
}

vi.mock('@presentation/hooks', async () => {
  const actual = await vi.importActual('@presentation/hooks')
  return {
    ...actual,
    useDeletePost: vi.fn(),
    useIsOwner: vi.fn(),
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

describe('PostCard', () => {
  const mockDeletePost: MockDeletePostResult = {
    mutateAsync: vi.fn().mockResolvedValue(undefined),
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
    vi.mocked(hooks.useDeletePost).mockReturnValue(
      mockDeletePost as unknown as ReturnType<typeof hooks.useDeletePost>
    )
    vi.mocked(hooks.useIsOwner).mockReturnValue(false)
    vi.mocked(hooks.useCreatePost).mockReturnValue(
      mockCreatePost as unknown as ReturnType<typeof hooks.useCreatePost>
    )
    vi.mocked(hooks.useUpdatePost).mockReturnValue(
      mockUpdatePost as unknown as ReturnType<typeof hooks.useUpdatePost>
    )
  })

  it('renders post information correctly', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.getByText('Test content')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByAltText('Test User')).toHaveAttribute('src', mockPost.avatar)
  })

  it('renders Read more link with correct href', () => {
    render(<PostCard post={mockPost} />)
    const link = screen.getByRole('link', { name: /read more/i })
    expect(link).toHaveAttribute('href', '/post/1')
  })

  it('shows edit and delete buttons when user is owner', () => {
    vi.mocked(hooks.useIsOwner).mockReturnValue(true)
    render(<PostCard post={mockPost} />)

    expect(screen.getByLabelText(/edit post/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/delete post/i)).toBeInTheDocument()
  })

  it('does not show edit and delete buttons when user is not owner', () => {
    vi.mocked(hooks.useIsOwner).mockReturnValue(false)
    render(<PostCard post={mockPost} />)

    expect(screen.queryByLabelText(/edit post/i)).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/delete post/i)).not.toBeInTheDocument()
  })

  it('shows PostForm when edit button is clicked', async () => {
    const user = userEvent.setup()
    vi.mocked(hooks.useIsOwner).mockReturnValue(true)
    render(<PostCard post={mockPost} />)

    await user.click(screen.getByLabelText(/edit post/i))
    // PostForm is rendered - checking for form elements
    expect(screen.getByPlaceholderText(/post title/i)).toBeInTheDocument()
  })

  it('opens delete modal when delete button is clicked', async () => {
    const user = userEvent.setup()
    vi.mocked(hooks.useIsOwner).mockReturnValue(true)
    render(<PostCard post={mockPost} />)

    await user.click(screen.getByLabelText(/delete post/i))
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()
    expect(screen.getByText(/delete post/i)).toBeInTheDocument()
  })

  it('calls deletePost when confirm is clicked in modal', async () => {
    const user = userEvent.setup()
    vi.mocked(hooks.useIsOwner).mockReturnValue(true)
    render(<PostCard post={mockPost} />)

    await user.click(screen.getByLabelText(/delete post/i))
    const confirmButton = screen.getByRole('button', { name: /^delete$/i })
    await user.click(confirmButton)

    await waitFor(() => {
      expect(mockDeletePost.mutateAsync).toHaveBeenCalledWith('1')
    })
  })

  it('shows loading state when deleting', () => {
    vi.mocked(hooks.useIsOwner).mockReturnValue(true)
    vi.mocked(hooks.useDeletePost).mockReturnValue({
      ...mockDeletePost,
      isPending: true,
    } as unknown as ReturnType<typeof hooks.useDeletePost>)

    render(<PostCard post={mockPost} />)
    const deleteButton = screen.getByLabelText(/delete post/i)
    expect(deleteButton).toBeDisabled()
  })

  it('renders correctly with onPostUpdated callback', () => {
    const onPostUpdated = vi.fn()
    vi.mocked(hooks.useIsOwner).mockReturnValue(true)
    render(<PostCard post={mockPost} onPostUpdated={onPostUpdated} />)

    expect(screen.getByText('Test Post')).toBeInTheDocument()
    // onPostUpdated is called through PostForm onSuccess, which is tested in PostForm tests
  })
})

