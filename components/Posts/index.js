import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
import { useWindowWidth } from '../hooks/WindowcontextAPI';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [morePosts, setMorePosts] = useState(true);
  const [page, setPage] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const { isSmallerDevice } = useWindowWidth();

  const fetchPosts = async (page) => {
    setIsLoading(true);
    try {
      const limit = isSmallerDevice ? 5 : 10;
      const { data: postsData } = await axios.get('/api/v1/posts', {
        params: { start: page * limit, limit },
      });
      const { data: users } = await axios.get('/api/v1/users', {
        params: { start: page * limit, limit },
      });
      const { data: photos } = await axios.get(
        'https://jsonplaceholder.typicode.com/albums/1/photos',
        {
          params: { start: page * limit, limit },
        }
      );
      const postsWithPhotos = postsData.map((post) => ({
        ...post,
        photo: photos.find((photo) => photo.id === post.id),
        user: users.find((user) => user.id === post.id),
      }));

      setPosts((prevPosts) => [...prevPosts, ...postsWithPhotos]);
      setMorePosts(postsWithPhotos.length === limit);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setMorePosts(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page, isSmallerDevice]);

  const handleClick = () => {
    setIsLoading(true);
    setPage((prevPage) => prevPage + 1);
    setClickCount((prevCount) => prevCount + 1);
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </PostListContainer>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {morePosts && clickCount < 2 && (
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        )}
      </div>
    </Container>
  );
};

export default Posts;
