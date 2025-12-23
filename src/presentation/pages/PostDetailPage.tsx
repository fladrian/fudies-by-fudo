import { useParams, Link } from 'react-router-dom'
import { PostDetail, Comment } from '@presentation/components'

export const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>()

  return (
    <>
      <div className="mb-4">
        <Link
          to="/"
          className="text-primary hover:text-primary-hover font-medium text-sm sm:text-base"
        >
          ← Back to home
        </Link>
      </div>

      <section className="space-y-4">
        <PostDetail postId={postId!} />
        <Comment postId={postId!} />
      </section>
    </>
  )
}
