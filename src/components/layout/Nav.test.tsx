import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Nav from './Nav';

describe('Nav', () => {
  it('renders the logo and anchor links', () => {
    render(
      <MemoryRouter initialEntries={['/fr']}>
        <Routes>
          <Route path="/:lang" element={<Nav />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'RP.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact');
  });
});
