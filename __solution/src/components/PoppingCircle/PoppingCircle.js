import React from 'react';
import styled, { keyframes } from 'styled-components';

const PoppingCircle = ({ size, color }) => {
  return <Wrapper style={{ width: size, height: size, background: color }} />;
};

const scale = keyframes`
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
`;

const fade = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const Wrapper = styled.div`
  display: block;
  border-radius: 50%;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${fade} 500ms ease-in forwards,
      ${scale} 300ms cubic-bezier(0.44, 0.11, 0.93, 0.72) forwards;
  }
  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

export default PoppingCircle;
