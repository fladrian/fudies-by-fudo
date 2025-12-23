import { PostCard, EmptyState, PostSkeletonList } from '@presentation/components'
import { usePosts } from '@presentation/hooks'

export const PostList = () => {
  const { data: posts, isLoading } = usePosts()

  if (isLoading) {
    return <PostSkeletonList count={3} />
  }

  if (!posts || posts.length === 0) {
    return <EmptyState content="No posts yet. Create the first one!" />
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
