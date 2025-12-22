import type { Post } from "@core";
import { useComments } from "@presentation/hooks";
import { CommentSkeletonList, CommentTree, CreateComment, EmptyState } from "@presentation/components";

interface CommentProps {
	postId: Post['id'];
}

export const Comment = ({ postId }: CommentProps) => {
	const { data:comments, isPending, isError } = useComments(postId!);
	const hasComments = !isError && comments && comments.length > 0;

	return (
		<section className="bg-surface rounded-lg shadow-card p-6">
		<h2 className="text-2xl font-display font-bold text-gray-dark mb-6">
			Comments {hasComments && `(${comments.length})`}
		</h2>

		<div className="mb-6">
			<CreateComment postId={postId!} showToggleButton={true} />
		</div>


			{isPending && <CommentSkeletonList count={3} />}

			{!isPending && hasComments 
				? <CommentTree 
						comments={comments!} 
						postId={postId!} /> 
				: !isPending && <EmptyState 
						content="No comments yet. Be the first to comment!" 
						className="py-8" />}
    </section>
  );
};