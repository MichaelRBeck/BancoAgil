'use client';
import styled from 'styled-components';

export const MainContainer = styled.section`
  background-color: var(--accent);
  padding: 5rem 0;
  position: relative;
  overflow: hidden;
`;

export const MainTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: var(--primary);
  line-height: 1.2;
`;

export const MainButton = styled.button`
  background-color: var(--primary);
  color: var(--neutral);
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--secondary);
  }
`;

export const FeatureCard = styled.div`
  background-color: var(--neutral);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border: 1px solid var(--accent);
  text-align: center;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  }
`;

export const FAQContainer = styled.div`
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
`;
