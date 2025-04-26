import React, { useEffect, useState } from "react";
import axios from "axios";
import AddComment from "./AddComment";
import CommentList from "./CommentList";
import PostSlider from "./PostSlider";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Grid,
  Button,
  Modal,
} from "@mui/material";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [commentCounts, setCommentCounts] = useState({});
  const [commentRefresh, setCommentRefresh] = useState({});
  const [openCommentPostId, setOpenCommentPostId] = useState(null);
  const [expandedPost, setExpandedPost] = useState(null);
  const [expandedMedia, setExpandedMedia] = useState(null); // ✅ Only for media

  const fetchCommentsCount = async (postId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/comments/post/${postId}`);
      return res.data.length;
    } catch (err) {
      console.error("Error fetching comment count:", err);
      return 0;
    }
  };

  const fetchAllPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/posts");
      const postsData = res.data;
      setPosts(postsData);

      const counts = await Promise.all(postsData.map((post) => fetchCommentsCount(post.postId)));

      const countMap = {};
      const refreshMap = {};
      postsData.forEach((post, idx) => {
        countMap[post.postId] = counts[idx];
        refreshMap[post.postId] = 0;
      });

      setCommentCounts(countMap);
      setCommentRefresh(refreshMap);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const handleDelete = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      axios
        .delete(`http://localhost:8080/api/posts/${postId}`)
        .then(() => {
          setPosts((prev) => prev.filter((p) => p.postId !== postId));
        })
        .catch((err) => console.error("Error deleting post:", err));
    }
  };

  const handleLike = (postId) => {
    axios
      .put(`http://localhost:8080/api/posts/${postId}/like`)
      .then((res) => {
        const updatedPost = res.data;
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.postId === postId ? { ...post, likes: updatedPost.likes } : post
          )
        );
      })
      .catch((err) => console.error("Error liking post:", err));
  };

  const openCommentPopup = (postId) => {
    setOpenCommentPostId(postId);
  };

  const closeCommentPopup = () => {
    setOpenCommentPostId(null);
  };

  const handleCommentAdded = (postId) => {
    setCommentCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1,
    }));
    setCommentRefresh((prev) => ({
      ...prev,
      [postId]: prev[postId] + 1,
    }));
  };

  return (
    <Box sx={{ mt: 4, maxWidth: "600px", mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        All Posts
      </Typography>
      <Grid container spacing={3} direction="column">
        {posts.map((post) => (
          <Grid item xs={12} key={post.postId}>
            <Card
              sx={{ borderRadius: 3, boxShadow: 3, cursor: "pointer" }}
              onClick={() => setExpandedPost(post)}
            >
              {/* Media Section with click-to-expand */}
              {post.videoBase64 ? (
                <Box onClick={(e) => {
                  e.stopPropagation();
                  setExpandedMedia({ type: "video", content: post.videoBase64 });
                }}>
                  <CardMedia
                    component="video"
                    src={post.videoBase64}
                    autoPlay
                    loop
                    muted
                    playsInline
                    sx={{ height: 500 }}
                  />
                </Box>
              ) : post.imageBase64List?.length > 1 ? (
                <Box onClick={(e) => {
                  e.stopPropagation();
                  setExpandedMedia({ type: "slider", content: post.imageBase64List });
                }}>
                  <PostSlider images={post.imageBase64List} />
                </Box>
              ) : post.imageBase64List?.length === 1 ? (
                <Box onClick={(e) => {
                  e.stopPropagation();
                  setExpandedMedia({ type: "image", content: post.imageBase64List[0] });
                }}>
                  <CardMedia
                    component="img"
                    src={post.imageBase64List[0]}
                    alt="Post image"
                    sx={{ height: 500, objectFit: "cover" }}
                  />
                </Box>
              ) : (
                <CardMedia
                  component="img"
                  src="https://via.placeholder.com/800x300?text=No+Media"
                  alt="No media"
                />
              )}

              <CardContent>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  Post ID: {post.postId}
                </Typography>
                <Typography variant="h6">{post.post}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {post.description}
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post.postId);
                    }}
                  >
                    ❤️ {post.likes}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      openCommentPopup(post.postId);
                    }}
                  >
                    💬 {commentCounts[post.postId] || 0}
                  </Button>
                </Box>
                <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                  By: {post.userId} | Date: {post.date}
                </Typography>
                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {post.tags?.map((tag, index) => (
                    <Chip key={index} label={tag} variant="outlined" size="small" />
                  ))}
                </Box>
                <CommentList
                  postId={post.postId}
                  refreshTrigger={commentRefresh[post.postId] || 0}
                />
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Edit ${post.postId}`);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(post.postId);
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Comment Modal */}
            <Modal
              open={openCommentPostId === post.postId}
              onClose={closeCommentPopup}
              aria-labelledby="add-comment-popup"
              sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 600,
                  bgcolor: "background.paper",
                  borderRadius: "12px 12px 0 0",
                  boxShadow: 24,
                  p: 2,
                  mb: 1,
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Add Comment
                </Typography>
                <AddComment
                  postId={post.postId}
                  onCommentAdded={() => {
                    fetchCommentsCount(post.postId);
                    closeCommentPopup();
                  }}
                />
              </Box>
            </Modal>
          </Grid>
        ))}
      </Grid>

      {/* Expanded Post Modal (Full Post View) */}
      <Modal
        open={!!expandedPost}
        onClose={() => setExpandedPost(null)}
        aria-labelledby="expanded-post"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: 800,
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          {expandedPost && (
            <>
              {expandedPost.videoBase64 ? (
                <video
                  src={expandedPost.videoBase64}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: "100%", maxHeight: 400, objectFit: "cover", marginBottom: 16 }}
                />
              ) : expandedPost.imageBase64List?.length > 1 ? (
                <PostSlider images={expandedPost.imageBase64List} />
              ) : expandedPost.imageBase64List?.length === 1 ? (
                <img
                  src={expandedPost.imageBase64List[0]}
                  alt="expanded"
                  style={{ width: "100%", maxHeight: 400, objectFit: "cover", marginBottom: 16 }}
                />
              ) : (
                <img
                  src="https://via.placeholder.com/800x300?text=No+Media"
                  alt="No media"
                  style={{ width: "100%", maxHeight: 300, objectFit: "cover", marginBottom: 16 }}
                />
              )}

              <Typography variant="h6">{expandedPost.post}</Typography>
              <Typography sx={{ mt: 1 }}>{expandedPost.description}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                By: {expandedPost.userId} | Date: {expandedPost.date}
              </Typography>

              <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleLike(expandedPost.postId)}
                >
                  ❤️ {expandedPost.likes}
                </Button>
              </Box>

              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {expandedPost.tags?.map((tag, i) => (
                  <Chip key={i} label={tag} variant="outlined" size="small" />
                ))}
              </Box>

              <CommentList
                postId={expandedPost.postId}
                refreshTrigger={commentRefresh[expandedPost.postId] || 0}
              />
            </>
          )}
        </Box>
      </Modal>

      {/* Expanded Media Modal (Only Media) */}
      <Modal
        open={!!expandedMedia}
        onClose={() => setExpandedMedia(null)}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: "90%",
            maxWidth: 1000,
            maxHeight: "90vh",
            overflow: "auto",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 2,
          }}
        >
          {expandedMedia?.type === "video" && (
            <video
              src={expandedMedia.content}
              controls
              autoPlay
              loop
              muted
              style={{ width: "100%", objectFit: "contain" }}
            />
          )}
          {expandedMedia?.type === "image" && (
            <img
              src={expandedMedia.content}
              alt="Expanded"
              style={{ width: "100%", objectFit: "contain" }}
            />
          )}
          {expandedMedia?.type === "slider" && (
            <PostSlider images={expandedMedia.content} />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default PostList;
