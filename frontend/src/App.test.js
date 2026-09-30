import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: () => Promise.resolve({
      data: {
        movies: [],
        pagination: {
          page: 1,
          limit: 24,
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      },
    }),
    post: () => Promise.resolve({ data: {} }),
    isCancel: () => false,
  },
}));

import App from './App';

// Polyfill window.scrollTo and IntersectionObserver in jsdom environment if not defined
beforeAll(() => {
  if (typeof window.scrollTo !== 'function') {
    window.scrollTo = jest.fn();
  }
  if (typeof global.IntersectionObserver !== 'function') {
    global.IntersectionObserver = class {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
});

test('renders CineMatch branding and core navigation', () => {
  render(<App />);
  const logoElements = screen.getAllByAltText(/CineMatch Logo/i);
  expect(logoElements.length).toBeGreaterThan(0);
  expect(screen.getByText(/Discover Films Through/i)).toBeInTheDocument();
});
