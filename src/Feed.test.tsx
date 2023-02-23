import { Mock, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Feed } from './Feed';
import axios from 'axios';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

vi.mock('axios');

const TODAY = '2023-01-10T12:00:00Z';

/** Returns a valid fake commit for the given author, date and message. */
function fakeCommit(author: string, date: string, message: string) {
  return {
    commit: {
      author: {
        name: author,
        date: date,
      },
      message: message,
    },
    sha: 'abc'
  };
}

describe('Feed', () => {
  let getMock: Mock;
  beforeEach(() => {
    getMock = axios.get as Mock;
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders', () => {
    render(<Feed user='a' repo='b'></Feed>);
  });

  it('fetches on load', async () => {
    getMock.mockResolvedValueOnce({
      data: [fakeCommit('Alice', TODAY, 'some message')],
    });
    render(<Feed user='a' repo='b'></Feed>);
    await waitFor(async () => {
      expect(
        await screen.findByText('January 10th, 2023 at 12:00 PM')
      ).toBeInTheDocument();
      expect(await screen.findByText('Alice')).toBeInTheDocument();
      expect(await screen.findByText('some message')).toBeInTheDocument();
    });
  });

  it('loads more when "Load more" is clicked', async () => {
    getMock.mockResolvedValueOnce({
      data: [fakeCommit('Alice', TODAY, 'some message')],
    });
    getMock.mockResolvedValueOnce({
      data: [fakeCommit('Bob', TODAY, 'more changes')],
    });

    render(<Feed user='a' repo='b'></Feed>);
    await waitFor(async () => {
      expect(await screen.findByText('Alice')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await act(async () => {
      user.click(await screen.findByText('Load more'));
    });

    await waitFor(async () => {
      expect(await screen.findByText('Bob')).toBeInTheDocument();
    });
  });

  it('does not show "Load more" button after an empty page', async () => {
    getMock.mockResolvedValueOnce({ data: [] });
    render(<Feed user='a' repo='b'></Feed>);
    await waitFor(() =>
      expect(screen.queryAllByText('Load more').length).toBe(0)
    );
  });

  it('shows 404 when repo not found', () => {
    getMock.mockImplementation(() => {
      throw { response: { status: 404 } };
    });
  });

  describe('commit parsing', () => {
    it('displays default values if commit is missing', async () => {
      getMock.mockResolvedValueOnce({ data: [{}] });
      render(<Feed user='a' repo='b' />);
      await waitFor(async () => {
        expect(await screen.findByText('missing')).toBeInTheDocument();
        expect(await screen.findByText('empty')).toBeInTheDocument();
        expect(await screen.findByText('unknown')).toBeInTheDocument();
      });
    });

    describe('author', async () => {
      it('displays author name if present', async () => {
        getMock.mockResolvedValueOnce({
          data: [{ commit: { author: { name: 'Alice' } } }],
        });
        render(<Feed user='a' repo='b' />);
        await waitFor(async () => {
          expect(await screen.findByText('Alice')).toBeInTheDocument();
        });
      });

      it('defaults to login if author is missing', async () => {
        getMock.mockResolvedValueOnce({
          data: [{ commit: {}, login: 'alice123' }],
        });
        render(<Feed user='a' repo='b' />);
        await waitFor(async () => {
          expect(await screen.findByText('alice123')).toBeInTheDocument();
        });
      });

      it('defaults to login if author name is missing', async () => {
        getMock.mockResolvedValueOnce({
          data: [{ commit: { author: { name: '' } }, login: 'alice123' }],
        });
        render(<Feed user='a' repo='b' />);
        await waitFor(async () => {
          expect(await screen.findByText('alice123')).toBeInTheDocument();
        });
      });

      it('defaults to unknown if login is missing', async () => {
        getMock.mockResolvedValueOnce({
          data: [{ commit: { author: { name: '' } }, login: '' }],
        });
        render(<Feed user='a' repo='b' />);
        await waitFor(async () => {
          expect(await screen.findByText('unknown')).toBeInTheDocument();
        });
      });
    });

    describe('message', () => {
      it('displays message', async () => {
        getMock.mockResolvedValueOnce({
          data: [{ commit: { message: 'abc' } }],
        });
        render(<Feed user='a' repo='b' />);
        await waitFor(async () => {
          expect(await screen.findByText('abc')).toBeInTheDocument();
        });
      });

      it('displays "empty" is message is missing', async () => {
        getMock.mockResolvedValueOnce({ data: [{ commit: { message: '' } }] });
        render(<Feed user='a' repo='b' />);
        await waitFor(async () => {
          expect(await screen.findByText('empty')).toBeInTheDocument();
        });
      });
    });

    describe('date', () => {
      it('displays date', async () => {
        getMock.mockResolvedValueOnce({
          data: [{ commit: { author: { date: '2022-03-03T12:00:00Z' } } }],
        });
        render(<Feed user='a' repo='b' />);
        await waitFor(async () => {
          expect(
            await screen.findByText('March 3rd, 2022 at 12:00 PM')
          ).toBeInTheDocument();
        });
      });

      it('displays "unknown" if date is missing', async () => {
        getMock.mockResolvedValueOnce({
          data: [{ commit: { author: { date: '' } } }],
        });
        render(<Feed user='a' repo='b' />);
        await waitFor(async () => {
          expect(await screen.findByText('unknown')).toBeInTheDocument();
        });
      });
    });
  });
});
