import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Components
import AppAppBar from './components/AppAppBar';
import Footer from './components/Footer';
import UserList from './components/UserList';
import PostList from './components/PostList';
import AddPost from './components/AddPost';
import SearchPost from './components/SearchPost';
import PostGallery from './components/PostGallery';
import MainContent from './components/MainContent';
import ExplorePosts from './pages/ExplorePosts';
import HomePostList from './components/HomePostList';

function HomePage() {
  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 5 }}>
      <Typography variant="h5" gutterBottom>Create a New Post</Typography>
      <AddPost />

      <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>Search Posts</Typography>
      <SearchPost />

      <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>All Posts</Typography>
      <PostList />

      <Typography variant="h5" gutterBottom sx={{ mt: 5 }}>All Users</Typography>
      <UserList />
    </Container>
  );
}

function App() {
  return (
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePostList />} />
    <Route path="/feed" element={<PostGallery />} />
    <Route path="/create" element={<HomePage />} />
  </Routes>
</BrowserRouter>

  );
}

export default App;
