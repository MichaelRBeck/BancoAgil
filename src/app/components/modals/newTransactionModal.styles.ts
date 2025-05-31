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
  background-color: white;
  border-radius: 0.75rem;
  padding: 2rem;
  width: 100%;
  max-width: 40rem;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(18, 23, 20, 0.12);
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: #6b7280;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: #374151;
  }
`;

export const Title = styled.h1`
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700;
  color: #121714;
  margin-bottom: 2rem;
  line-height: 1.25;
`;
