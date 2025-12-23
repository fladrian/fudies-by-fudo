import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@test/utils/test-utils'
import userEvent from '@testing-library/user-event'
import { PostForm } from '@presentation/components/ui/post/PostForm'
import * as hooks from '@presentation/hooks'
import * as userStore from '@application'

type MockMutationResult = {
  mutate: ReturnType<typeof vi.fn>
  isPending: boolean
}

// Mock hooks
vi.mock('@presentation/hooks', () => ({
  useCreatePost: vi.fn(),
  useUpdatePost: vi.fn(),
}))

vi.mock('@application', () => ({
  useUserStore: vi.fn(),
}))

const mockPost = {
  id: '1',
  title: 'Test Post',
  content: 'Test content',
  name: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  createdAt: new Date('2024-01-01'),
}

describe('PostForm', () => {
  const mockCreatePost: MockMutationResult = {
    mutate: vi.fn(),
    isPending: false,
  }

  const mockUpdatePost: MockMutationResult = {
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
    vi.mocked(hooks.useCreatePost).mockReturnValue(
      mockCreatePost as unknown as ReturnType<typeof hooks.useCreatePost>
    )
    vi.mocked(hooks.useUpdatePost).mockReturnValue(
      mockUpdatePost as unknown as ReturnType<typeof hooks.useUpdatePost>
    )
    vi.mocked(userStore.useUserStore).mockImplementation(
      ((selector: (state: unknown) => unknown) => {
        return selector(mockUserStore)
      }) as unknown as Parameters<ReturnType<typeof vi.mocked<typeof userStore.useUserStore>>['mockImplementation']>[0]
    )
  })

  it('renders create form correctly', () => {
    render(<PostForm />)
    expect(screen.getByText('Create New Post')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Post title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Write your content here...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /publish/i })).toBeInTheDocument()
  })

  it('renders edit form correctly', () => {
    render(<PostForm post={mockPost} />)
    expect(screen.getByText('Edit Post')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Post')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test content')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument()
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

    render(<PostForm />)
    // UserDisplay should be rendered instead of name/avatar inputs
    expect(screen.queryByPlaceholderText('Your name')).not.toBeInTheDocument()
  })

  it('calls createPost on submit', async () => {
    const user = userEvent.setup()
    render(<PostForm />)

    await user.type(screen.getByPlaceholderText('Your name'), 'New User')
    await user.type(screen.getByPlaceholderText('Post title'), 'New Title')
    await user.type(screen.getByPlaceholderText('Write your content here...'), 'New Content')
    await user.click(screen.getByRole('button', { name: /publish/i }))

    await waitFor(() => {
      expect(mockCreatePost.mutate).toHaveBeenCalled()
    })
  })

  it('calls updatePost when editing', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    render(<PostForm post={mockPost} onSuccess={onSuccess} />)

    const titleInput = screen.getByDisplayValue('Test Post')
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated Title')
    await user.click(screen.getByRole('button', { name: /update/i }))

    await waitFor(() => {
      expect(mockUpdatePost.mutate).toHaveBeenCalledWith({
        postId: '1',
        post: expect.objectContaining({
          title: 'Updated Title',
        }),
      })
    })
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<PostForm onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalled()
  })

  it('shows loading state when submitting', () => {
    vi.mocked(hooks.useCreatePost).mockReturnValue({
      ...mockCreatePost,
      isPending: true,
    } as unknown as ReturnType<typeof hooks.useCreatePost>)

    render(<PostForm />)
    const submitButton = screen.getByRole('button', { name: /publish/i })
    expect(submitButton).toBeDisabled()
  })
})

