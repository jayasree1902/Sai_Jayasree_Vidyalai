const express = require('express');
const axios = require('axios');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await fetchPosts();

    const postsWithImagesAndUsers = await Promise.all(posts.map(async (post) => {
      try {
        const { data: images } = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
        const { data: user } = await fetchUserById(post.userId);
        
        return {
          ...post,
          images: images.slice(0, 3).map(img => ({ url: img.url })),
          user,
        };
      } catch (error) {
        console.error(`Error fetching data for post ${post.id}:`, error.message);
        
        return {
          ...post,
          images: [], 
          user: null, 
        };
      }
    }));

    res.json(postsWithImagesAndUsers);
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

module.exports = router;
