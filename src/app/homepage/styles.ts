import styled from 'styled-components';

export const PageWrapper = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: white;
  overflow-x: hidden;
`;

export const LayoutContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  height: 100%;
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 1.25rem 2.5rem;

  @media (min-width: 640px) {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
`;

export const ContentInner = styled.div`
  width: 100%;
  max-width: 80rem;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 1rem;
  margin-bottom: 1.5rem;
`;

export const NewTransactionButton = styled.button`
  cursor: pointer;
  height: 2.5rem;
  min-width: 180px;
  border-radius: 12px;
  padding: 0 1.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.015em;
  transition: background-color 0.3s ease;
  color: #FAFAFA;
  background-color: var(--primary);
  border: none;

  &:hover {
    background-color: var(--secondary);
  }
`;

export const BalanceContainer = styled.div`
  padding: 1rem;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
`;
