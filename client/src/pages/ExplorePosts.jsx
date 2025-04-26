import React from "react";
import { Box, Typography } from "@mui/material";
import SearchPost from "../components/SearchPost";
import PostList from "../components/PostList";

const ExplorePosts = () => {
  return (
    <Box sx={{ backgroundColor: "#f7f9fc", minHeight: "100vh", py: 4 }}>
      {/* Full-width container using padding instead of MUI Container */}
      <Box sx={{ px: { xs: 2, sm: 4, md: 6, lg: 8 } }}>
        {/* Heading */}

        {/* Search Component */}
        <SearchPost />

        {/* Divider */}
        <Box sx={{ height: 32 }} />

        {/* All Posts Component */}
        <PostList />
      </Box>
    </Box>
  );
};

export default ExplorePosts;
