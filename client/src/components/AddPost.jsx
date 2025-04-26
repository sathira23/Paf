import React, { useState } from "react";
import axios from "axios";

const AddPost = () => {
  const [userId, setUserId] = useState("");
  const [post, setPost] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState(""); // comma-separated string input
  const [likes, setLikes] = useState(0);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setError("You can only upload up to 3 images.");
      return;
    }

    const promises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((base64Images) => {
      setImages(base64Images);
      setVideo(null); // clear video
      setError("");
    });
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideo(reader.result);
        setImages([]); // clear images
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId || !post || !description) {
      setError("User ID, Post, and Description are required.");
      return;
    }

    if (images.length > 0 && video) {
      setError("You can only upload images OR a video, not both.");
      return;
    }

    const newPost = {
      userId,
      post,
      description,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      likes: parseInt(likes),
      imageBase64List: images,
      videoBase64: video,
      date: new Date().toISOString(),
    };

    axios
      .post("http://localhost:8080/api/posts", newPost)
      .then(() => {
        alert("Post added successfully!");
        setUserId("");
        setPost("");
        setDescription("");
        setTags("");
        setLikes(0);
        setImages([]);
        setVideo(null);
        setError("");
      })
      .catch((err) => {
        console.error("Error adding post:", err);
      });
  };

  return (
    <div>
      <h2>Add New Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID:</label>
          <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />
        </div>

        <div>
          <label>Post Title:</label>
          <input type="text" value={post} onChange={(e) => setPost(e.target.value)} required />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            cols={40}
          />
        </div>

        <div>
          <label>Tags (comma separated):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., engineering, ui, backend"
          />
        </div>

        <div>
          <label>Likes:</label>
          <input
            type="number"
            value={likes}
            onChange={(e) => setLikes(e.target.value)}
            min="0"
          />
        </div>

        <div>
          <label>Upload Images (max 3):</label>
          <input type="file" accept="image/*" multiple disabled={!!video} onChange={handleImageChange} />
        </div>

        <div>
          <label>Or Upload Video:</label>
          <input type="file" accept="video/*" disabled={images.length > 0} onChange={handleVideoChange} />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {images.length > 0 && (
          <div style={{ marginTop: "10px" }}>
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`preview-${index}`}
                style={{
                  maxWidth: "150px",
                  marginRight: "10px",
                  marginBottom: "10px",
                  border: "1px solid #ccc",
                }}
              />
            ))}
          </div>
        )}

        {video && (
          <div style={{ marginTop: "10px" }}>
            <video
              src={video}
              controls
              style={{ maxWidth: "300px", border: "1px solid #ccc" }}
            />
          </div>
        )}

        <button type="submit" style={{ marginTop: "10px" }}>
          Add Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
