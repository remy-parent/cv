import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Education from './Education';

describe('Education', () => {
  it('renders the title and the single education entry', () => {
    render(
      <MemoryRouter initialEntries={['/fr']}>
        <Routes>
          <Route path="/:lang" element={<Education />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Formation' })).toBeInTheDocument();
    expect(screen.getByText(/Collège de Maisonneuve/)).toBeInTheDocument();
  });
});
