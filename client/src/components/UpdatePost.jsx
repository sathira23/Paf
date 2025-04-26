import React, { useEffect, useState } from "react";
import axios from "axios";

const UpdatePost = ({ postId, onUpdateSuccess }) => {
  const [post, setPost] = useState("");
  const [likes, setLikes] = useState(0);
  const [image, setImage] = useState(null); // base64
  const [loading, setLoading] = useState(true);

  // Fetch post data on mount
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/posts`)
      .then((res) => {
        const found = res.data.find((p) => p.postId === postId);
        if (found) {
          setPost(found.post);
          setLikes(found.likes);
          setImage(found.imageBase64 || null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        setLoading(false);
      });
  }, [postId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedPost = {
      post,
      likes: parseInt(likes),
      imageBase64: image,
    };

    axios
      .put(`http://localhost:8080/api/posts/${postId}`, updatedPost)
      .then(() => {
        alert("Post updated successfully!");
        if (onUpdateSuccess) onUpdateSuccess(); // optional callback
      })
      .catch((err) => {
        console.error("Error updating post:", err);
      });
  };

  if (loading) return <p>Loading post...</p>;

  return (
    <div>
      <h2>Update Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Post:</label>
          <input
            type="text"
            value={post}
            onChange={(e) => setPost(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Likes:</label>
          <input
            type="number"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
          />
        </div>
        <div>
          <label>Change Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        {image && (
          <div style={{ marginTop: "10px" }}>
            <img
              src={image}
              alt="Preview"
              style={{ maxWidth: "200px", border: "1px solid #ccc" }}
            />
          </div>
        )}
        <button type="submit" style={{ marginTop: "10px" }}>
          Update Post
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;
