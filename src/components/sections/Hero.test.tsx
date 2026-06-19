import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Hero from './Hero';

describe('Hero', () => {
  it('renders the name and CTAs', () => {
    render(
      <MemoryRouter initialEntries={['/fr']}>
        <Routes>
          <Route path="/:lang" element={<Hero />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Remy Parent' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contacter/i })).toBeInTheDocument();
  });
});
