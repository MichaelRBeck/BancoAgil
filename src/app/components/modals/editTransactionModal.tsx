'use client';

import styled from 'styled-components';

const Wrapper = styled.div`
  min-height: 100vh;
  background-color: white;
  padding: 4rem 1rem;
`;

const FormContainer = styled.main`
  max-width: 36rem; /* max-w-xl */
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.h1`
  font-size: 1.875rem; /* text-3xl */
  font-weight: 700;
  color: #121714;
  margin-bottom: 2rem;
`;

const FormLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export default function EditTransactionModal() {
  return (
    <Wrapper>
      <FormContainer>
        <Title>Edite a transação</Title>

        <form className="flex flex-col gap-6">
          {/* Type */}
          <FormLabel>
            <span className="font-medium text-[#121714]">Type</span>
            <select className="w-full rounded-xl border border-[#dce4e0] bg-white px-4 py-3 text-base text-[#121714] focus:outline-none focus:ring-2 focus:ring-[#82e3a9]">
              <option>Select an option</option>
              <option>Income</option>
              <option>Expense</option>
              <option>Transfer</option>
            </select>
          </FormLabel>

          {/* Amount */}
          <FormLabel>
            <span className="font-medium text-[#121714]">Amount</span>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="$0.00"
              className="w-full rounded-xl border border-[#dce4e0] bg-white px-4 py-3 text-base text-[#121714] focus:outline-none focus:ring-2 focus:ring-[#82e3a9]"
            />
            <p className="text-sm text-[#668572]">The amount must be greater than $0</p>
          </FormLabel>

          {/* Date */}
          <FormLabel>
            <span className="font-medium text-[#121714]">Date</span>
            <input
              type="date"
              className="w-full rounded-xl border border-[#dce4e0] bg-white px-4 py-3 text-base text-[#121714] focus:outline-none focus:ring-2 focus:ring-[#82e3a9]"
            />
          </FormLabel>

          {/* Description */}
          <FormLabel>
            <span className="font-medium text-[#121714]">Description</span>
            <input
              type="text"
              placeholder="Enter a description"
              className="w-full rounded-xl border border-[#dce4e0] bg-white px-4 py-3 text-base text-[#121714] focus:outline-none focus:ring-2 focus:ring-[#82e3a9]"
            />
          </FormLabel>

          {/* Category */}
          <FormLabel>
            <span className="font-medium text-[#121714]">Category</span>
            <select className="w-full rounded-xl border border-[#dce4e0] bg-white px-4 py-3 text-base text-[#121714] focus:outline-none focus:ring-2 focus:ring-[#82e3a9]">
              <option>Select an option</option>
              <option>Food & Dining</option>
              <option>Transport</option>
              <option>Utilities</option>
            </select>
          </FormLabel>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-full bg-[#82e3a9] py-3 text-base font-semibold text-[#121714] transition hover:bg-teal-400"
          >
            Save
          </button>
        </form>
      </FormContainer>
    </Wrapper>
  );
}
