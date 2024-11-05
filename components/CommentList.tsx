import Comment from "./Comment";
import { FC } from "react";

interface CommentData {
  id: number;
  user: string;
  content: string;
  comments?: CommentData[];
}

interface CommentListProps {
  comments: CommentData[];
}

const CommentList: FC<CommentListProps> = ({ comments }) => (
  <>
    {comments.map((comment) => (
      <Comment key={comment.id} comment={comment} />
    ))}
  </>
);

export default CommentList;
