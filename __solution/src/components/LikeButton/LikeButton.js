import React from 'react';
import styled from 'styled-components';

import { range } from '../../utils';

import PoppingCircle from '../PoppingCircle';
import ScaleIn from '../ScaleIn';

import ConfettiPiece from './ConfettiPiece';
import Heart from './Heart';

const PARTICLE_COLORS = ['#e53935', '#1e88e5', '#43a047', '#fdd835', '#fb8c00'];

const LikeButton = ({ isLiked, numOfConfettiPieces = 10, size = 40 }) => {
  const heartSize = size * 0.6;

  const heart = <Heart width={heartSize} isToggled={isLiked} />;

  return (
    <Wrapper style={{ width: size, height: size }}>
      <Foreground>
        {/* Part I: Update ScaleIn to do the springy scale effect */}
        {isLiked ? <ScaleIn>{heart}</ScaleIn> : heart}
      </Foreground>

      <Background>
        {/* Part II: Update the PoppingCircle */}
        {isLiked && <PoppingCircle color="#E790F7" size={size} />}

        {/* Part III: update ConfettiPiece, add several more: */}
        {isLiked &&
          range(numOfConfettiPieces).map(i => (
            <ConfettiPiece
              key={i}
              parentSize={size}
              angle={i * 28}
              distance={Math.random() * 15 + 13}
              color={PARTICLE_COLORS[i % PARTICLE_COLORS.length]}
            />
          ))}
      </Background>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Background = styled.div`
  position: absolute;
  z-index: 0;
`;

const Foreground = styled.div`
  position: relative;
  z-index: 1;
`;

export default LikeButton;
