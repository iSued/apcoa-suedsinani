import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';
import '@testing-library/jest-dom';

// Create a mock adapter for axios
const mock = new MockAdapter(axios);

describe('App Component', () => {
  // Reset the mock adapter before each test
  beforeEach(() => {
    mock.reset();
  });

  // Test to check if the component renders correctly
  it('renders the component correctly', async () => {
    // Mock the API response for fetching all countries
    mock.onGet('https://restcountries.com/v3.1/all').reply(200, [
      {
        name: {
          common: 'France',
          official: 'French Republic',
          nativeName: {
            fra: {
              official: 'République française',
              common: 'France'
            }
          }
        },
        capital: ['Paris'],
        region: 'Europe',
        population: 67081000,
        flags: {
          png: 'https://flagcdn.com/w320/fr.png',
          svg: 'https://flagcdn.com/fr.svg'
        }
      },
      {
        name: {
          common: 'Germany',
          official: 'Federal Republic of Germany',
          nativeName: {
            deu: {
              official: 'Bundesrepublik Deutschland',
              common: 'Deutschland'
            }
          }
        },
        capital: ['Berlin'],
        region: 'Europe',
        population: 83166711,
        flags: {
          png: 'https://flagcdn.com/w320/de.png',
          svg: 'https://flagcdn.com/de.svg'
        }
      }
    ]);

    // Render the App component
    render(<App />);

    // Wait for the countries to be displayed and check if they are in the document
    await waitFor(() => {
      expect(screen.getByText('France')).toBeInTheDocument();
      expect(screen.getByText('Germany')).toBeInTheDocument();
    });
  });

  // Test to check if the search functionality works
  it('search functionality works', async () => {
    // Mock the API response for fetching all countries (empty response)
    mock.onGet('https://restcountries.com/v3.1/all').reply(200, []);
    // Mock the API response for searching a country by name
    mock.onGet('https://restcountries.com/v3.1/name/France').reply(200, [
      {
        name: {
          common: 'France',
          official: 'French Republic',
          nativeName: {
            fra: {
              official: 'République française',
              common: 'France'
            }
          }
        },
        capital: ['Paris'],
        region: 'Europe',
        population: 67081000,
        flags: {
          png: 'https://flagcdn.com/w320/fr.png',
          svg: 'https://flagcdn.com/fr.svg'
        }
      }
    ]);

    // Render the App component
    render(<App />);

    // Simulate typing 'France' into the search input
    fireEvent.change(screen.getByLabelText('Search Country'), {
      target: { value: 'France' },
    });

    // Wait for the country to be displayed and check if it is in the document
    await waitFor(() => {
      expect(screen.getByText('France')).toBeInTheDocument();
    });
  });

  // Test to check if the favourite functionality works
  it('favourite functionality works', async () => {
    // Mock the API response for fetching all countries
    mock.onGet('https://restcountries.com/v3.1/all').reply(200, [
      {
        name: {
          common: 'France',
          official: 'French Republic',
          nativeName: {
            fra: {
              official: 'République française',
              common: 'France'
            }
          }
        },
        capital: ['Paris'],
        region: 'Europe',
        population: 67081000,
        flags: {
          png: 'https://flagcdn.com/w320/fr.png',
          svg: 'https://flagcdn.com/fr.svg'
        }
      }
    ]);

    // Render the App component
    render(<App />);

    // Wait for the country to be displayed and check if it is in the document
    await waitFor(() => {
      expect(screen.getByText('France')).toBeInTheDocument();
    });

    // Get the checkbox element
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    // Simulate clicking the checkbox to mark as favourite
    fireEvent.click(checkbox);

    // Wait for the checkbox to be checked and verify it
    await waitFor(() => {
      expect(checkbox).toBeChecked();
    });

    // Simulate clicking the checkbox again to unmark as favourite
    fireEvent.click(checkbox);

    // Wait for the checkbox to be unchecked and verify it
    await waitFor(() => {
      expect(checkbox).not.toBeChecked();
    });
  });
});