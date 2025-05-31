import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(4px);
`;

export const ModalBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 32rem; /* max-w-lg */
  border-radius: 0.75rem;
  background-color: var(--neutral);
  padding: 2rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h1`
  color: var(--text);
  font-size: 1.375rem; /* 22px */
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.015em;
  padding: 1.25rem 0 0.75rem;
  text-align: left;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #6b7280; /* gray-500 */
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #374151; /* gray-700 */
  }
`;
