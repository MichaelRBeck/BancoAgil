import styled from 'styled-components';

export const HeaderSection = styled.section`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ActionSection = styled.section`
  margin-top: 1.5rem;
`;

export const TransactionsSection = styled.section`
  margin-top: 2rem;
`;

export const AnalyticsSection = styled.section`
  margin-top: 3rem;
`;


export const PageWrapper = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: var(--background);
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

export const NewTransactionButtonStyle = styled.button`
  cursor: pointer;
  height: 2.5rem;
  min-width: 180px;
  border-radius: 12px;
  padding: 0 1.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.015em;
  transition: background-color 0.3s ease;
  color: var(--neutral);
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



interface ChartCardProps {
  colSpan?: number;
  rowSpan?: number;
  colStart?: number;
  rowStart?: number;
}

export const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 350px;
  gap: 24px;
  margin-top: 32px;
`;


export const ChartCard = styled.div<ChartCardProps>`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 250px;

  grid-column: ${({ colStart, colSpan = 1 }) =>
    colStart ? `${colStart} / span ${colSpan}` : `span ${colSpan}`};

  grid-row: ${({ rowStart, rowSpan = 1 }) =>
    rowStart ? `${rowStart} / span ${rowSpan}` : `span ${rowSpan}`};
`;



export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--text-primary);
`;

export const SectionCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.05);
  margin-bottom: 2.5rem;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

export const SectionDivider = styled.hr`
  border: none;
  border-top: 1px solid var(--border-light);
  margin: 2.5rem 0;
`;

export const ResponsiveChartsGrid = styled(ChartsGrid)`
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Avatar = styled.div`
  width: 64px;
  height: 64px;
  background-color: var(--primary);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--neutral);
  font-weight: 700;
  font-size: 1.5rem;
  user-select: none;
`;

export const UserName = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
`;

export const BalanceSummary = styled.div`
  text-align: center;

  @media (min-width: 640px) {
    text-align: right;
  }
`;

export const BalanceAmount = styled.p`
  font-size: 2.25rem;
  font-weight: 900;
  color: var(--primary);
  margin: 0.25rem 0;
`;

export const KPICards = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (min-width: 640px) {
    justify-content: flex-end;
  }
`;

export const KPICard = styled.div`
  background: var(--neutral);
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  min-width: 120px;
  text-align: center;
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.1);

  p {
    margin: 0.25rem 0;
    font-weight: 700;
    color: var(--text-primary);
  }

  span {
    font-size: 1.25rem;
    font-weight: 900;
    color: var(--primary);
  }
`;

export const SparklineContainer = styled.div`
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
`;


export const SummaryCard = styled.div`
  flex: 1 1 300px;
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.05);
`;

export const SparklineCard = styled(SummaryCard)`
  display: flex;
  flex-direction: column;
`;



