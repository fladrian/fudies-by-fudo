import { CreatePost, PostList } from '../components'

export const HomePage = () => (
  <section className="space-y-6">
    <CreatePost />
    <PostList />
  </section>
)
