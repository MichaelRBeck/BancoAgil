import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
`;

export const ModalContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 32rem; /* max-w-lg */
  border-radius: 1rem; /* rounded-xl */
  background-color: var(--neutral);
  padding: 2rem; /* p-8 */
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
  max-height: 90vh;
  overflow-y: auto;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem; /* top-4 */
  right: 1rem; /* right-4 */
  color: #6b7280; /* gray-500 */
  cursor: pointer;
  background: none;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
  transition: color 0.2s ease;

  &:hover {
    color: #374151; /* gray-700 */
  }
`;

export const Title = styled.h1`
  color: var(--text);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.015em;
  padding-bottom: 0.75rem; /* pb-3 */
  padding-top: 1.25rem; /* pt-5 */
  text-align: left;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* gap-6 */
  padding-top: 1rem; /* pt-4 */
`;

export const ShowPasswordLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text);
`;

export const CheckboxInput = styled.input`
  height: 1rem; /* h-4 */
  width: 1rem;  /* w-4 */
  border-radius: 0.25rem; /* rounded */
  border: 1px solid #dce4e0;
  cursor: pointer;

  &:checked {
    background-color: var(--green);
    border-color: var(--green);
  }

  &:focus {
    outline: none;
  }
`;

export const TermsLabel = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding-left: 0.25rem;
  color: var(--text);
`;

export const TermsCheckbox = styled.input`
  margin-top: 0.25rem;
  height: 1.25rem; /* h-5 */
  width: 1.25rem;  /* w-5 */
  border-radius: 0.3125rem; /* rounded */
  border: 2px solid #dce4e0;
  background-color: transparent;
  color: var(--green);
  cursor: pointer;

  &:checked {
    background-color: var(--green);
    border-color: var(--green);
  }

  &:focus {
    outline: none;
  }
`;

export const TermsText = styled.span`
  font-size: 1rem;
  & > span {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const SubmitButton = styled.button<{ disabled: boolean }>`
  height: 3rem; /* h-12 */
  width: 100%;
  border-radius: 1rem; /* rounded-xl */
  color: white;
  font-weight: 600;
  font-size: 1.125rem; /* text-lg */
  transition: background-color 0.3s ease;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  background-color: ${({ disabled }) =>
    disabled ? '#9ca3af' /* gray-400 */ : 'var(--primary)'};

  &:hover {
    background-color: ${({ disabled }) =>
      disabled ? '#9ca3af' : '#1f3550'};
  }
`;
