import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CommitList } from './CommitList';

describe('CommitList', () => {
  it('shows commits', async () => {
    render(
      <CommitList
        commits={[
          { author: 'Alice', date: '2022-03-03T12:00:00Z', message: 'news' },
        ]}
      />
    );
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(
      await screen.findByText('March 3rd, 2022 at 12:00 PM')
    ).toBeInTheDocument();
    expect(await screen.findByText('news')).toBeInTheDocument();
  });
});
