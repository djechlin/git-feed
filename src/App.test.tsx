import App from './App';
import { Mock, vi } from 'vitest';

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import * as router from 'react-router';

describe('App', () => {
  let navigateFn: Mock;

  beforeEach(async () => {
    vi.restoreAllMocks();
    navigateFn = vi.fn();
    vi.spyOn(router, 'useNavigate').mockImplementation(() => navigateFn);
  });

  it('navigates to feed page', async () => {
    render(<App />);
    const user = userEvent.setup();
    await act(async () => {
      user.click(await screen.findByPlaceholderText('User/org'));
    });
    await act(async () => {
      fireEvent.change(await screen.findByPlaceholderText('User/org'), {
        target: { value: 'user1' },
      });
      fireEvent.change(await screen.findByPlaceholderText('Repo'), {
        target: { value: 'repo1' },
      });
    });

    await act(async () => {
      fireEvent.submit(await screen.findByDisplayValue('Submit'));
    });

    expect(navigateFn.mock.lastCall).toEqual(['user1/repo1']);
  });
});
