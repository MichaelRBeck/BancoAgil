import styled from 'styled-components';

export const PageWrapper = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background: white;
  overflow-x: hidden;
`;

export const LayoutContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  height: 100%;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  padding: 1.25rem 1.5rem;

  @media (min-width: 640px) {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
`;

export const ContentInner = styled.div`
  width: 100%;
  max-width: 80rem;
`;
