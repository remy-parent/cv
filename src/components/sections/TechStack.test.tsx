import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import TechStack from './TechStack';

describe('TechStack', () => {
  it('renders each category with its skills', () => {
    render(
      <MemoryRouter initialEntries={['/en']}>
        <Routes>
          <Route path="/:lang" element={<TechStack />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Back-end' })).toBeInTheDocument();
    expect(screen.getByText('Magento 2')).toBeInTheDocument();
  });
});
