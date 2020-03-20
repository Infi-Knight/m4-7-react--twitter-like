import React from 'react';
import styled from 'styled-components';

import Heart from './Heart';

const PARTICLE_COLORS = ['#e53935', '#1e88e5', '#43a047', '#fdd835', '#fb8c00'];

const LikeButton = ({ isLiked, size = 40 }) => {
  const heartSize = size * 0.6;

  return (
    <Wrapper style={{ width: size, height: size }}>
      <Heart width={heartSize} isToggled={isLiked} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default LikeButton;
