import { useState } from 'react';
import { usePosts, useCreatePost } from '@presentation';

export const PostList = () => {
    const { data: posts, isLoading } = usePosts();
    const createPost = useCreatePost();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && content) {
            createPost.mutate({
                title,
                content,
                authorId: '1', // Hardcoded for demo
                published: true,
            });
            setTitle('');
            setContent('');
        }
    };

    if (isLoading) return <div>Loading posts...</div>;

    return (
        <div className="p-4 bg-white rounded-lg shadow-md mt-4 lg:mt-0">
            <h2 className="text-xl font-bold mb-4">Posts</h2>
            <div className="space-y-4 mb-4 h-64 overflow-y-auto">
                {posts?.map((post) => (
                    <div key={post.id} className="p-3 bg-gray-50 rounded">
                        <h3 className="font-semibold">{post.title}</h3>
                        <p className="text-sm text-gray-600">{post.content}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="text"
                    placeholder="Post Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-green-500 h-24 resize-none"
                />
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors mt-2">
                    Add Post
                </button>
            </form>
        </div>
    );
};
