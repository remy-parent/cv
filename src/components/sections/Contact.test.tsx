import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Contact from './Contact';

describe('Contact', () => {
  it('renders the GitHub profile link in a new tab', () => {
    render(<Contact />);

    const github = screen.getByRole('link', { name: 'github.com/xyphoide' });
    expect(github).toHaveAttribute('href', 'https://github.com/xyphoide');
    expect(github).toHaveAttribute('target', '_blank');
    expect(github).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });

  it('still renders the email and LinkedIn links', () => {
    render(<Contact />);

    expect(screen.getByRole('link', { name: 'remy.email@icloud.com' })).toHaveAttribute(
      'href',
      'mailto:remy.email@icloud.com',
    );
    expect(screen.getByRole('link', { name: 'linkedin.com/in/remyparent' })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/remyparent',
    );
  });
});
