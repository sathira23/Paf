import React, { useEffect, useState } from "react";
import axios from "axios";

const CommentList = ({ postId, refreshTrigger }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/comments/post/${postId}`)
      .then((res) => setComments(res.data))
      .catch((err) => console.error("Error fetching comments:", err));
  }, [postId, refreshTrigger]); // 🔁 re-fetch when postId or refreshTrigger changes

  return (
    <div style={{ marginTop: "10px" }}>
      <h4>Comments</h4>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.commentId}>
              {comment.comment} - ❤️ {comment.likes}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentList;
