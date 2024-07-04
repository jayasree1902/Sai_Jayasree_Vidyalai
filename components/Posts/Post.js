import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';

const PostContainer = styled.div(() => ({
  width: '300px',
  margin: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  overflow: 'hidden',
}));

const CarouselContainer = styled.div(() => ({
  position: 'relative',
}));

const Carousel = styled.div(() => ({
  display: 'flex',
  overflow: 'hidden',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

const CarouselItem = styled.div(() => ({
  flex: '0 0 100%',
  scrollSnapAlign: 'start',
}));

const Image = styled.img(() => ({
  width: '100%',
  height: 'auto',
  maxHeight: '300px',
}));

const Content = styled.div(() => ({
  padding: '10px',
  '& > h2': {
    marginBottom: '16px',
  },
}));

const Button = styled.button(() => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  border: 'none',
  color: '#000',
  fontSize: '20px',
  cursor: 'pointer',
  height: '50px',
  zIndex: 1,
}));

const PrevButton = styled(Button)`
  left: 10px;
`;

const NextButton = styled(Button)`
  right: 10px;
`;

const UserInfo = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  backgroundColor: '#f1f1f1',
  borderBottom: '1px solid #ccc',
}));

const UserInitials = styled.div(() => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#ccc',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '16px',
  marginRight: '10px',
}));

const UserNameEmail = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const UserName = styled.div(() => ({
  fontWeight: 'bold',
}));

const Post = ({ post }) => {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: currentIndex * carouselRef.current.offsetWidth,
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % post.images.length);
  };

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? post.images.length - 1 : prevIndex - 1
    );
  };

  const getInitials = (name) => {
    const [firstName, lastName] = name.split(' ');
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  const userName = post.user ? post.user.name : 'Leanne Graham';
  const userEmail = post.user ? post.user.email : 'Sincere@april.biz';
  const userInitials = post.user ? getInitials(post.user.name) : 'LG';

  return (
    <PostContainer>
      <UserInfo>
        <UserInitials>{userInitials}</UserInitials>
        <UserNameEmail>
          <UserName>{userName}</UserName>
          <div>{userEmail}</div>
        </UserNameEmail>
      </UserInfo>
      <CarouselContainer>
        <Carousel ref={carouselRef}>
          {post.images.map((image, index) => (
            <CarouselItem key={index}>
              <Image src={image.url} alt={post.title} />
            </CarouselItem>
          ))}
        </Carousel>
        <PrevButton onClick={handlePrevClick}>&#10094;</PrevButton>
        <NextButton onClick={handleNextClick}>&#10095;</NextButton>
      </CarouselContainer>
      <Content>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </Content>
    </PostContainer>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      })
    ).isRequired,
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
    }),
  }).isRequired,
};

export default Post;
