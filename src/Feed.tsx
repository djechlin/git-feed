import axios from 'axios';
import { useEffect, useState } from 'react';
import { CommitList, CommitProps } from './CommitList';

async function fetchGithub(
  user: string | undefined,
  repo: string | undefined,
  page: number
): Promise<Array<CommitProps>> {
  if (!user || !repo) {
    throw { response: { status: 404 } };
  }
  return (
    await axios.get(
      `https://api.github.com/repos/${user}/${repo}/commits?page=${page}`,
      {
        headers: {
          authorization: `token ${import.meta.env.VITE_GITHUB_API_TOKEN}`,
        },
      }
    )
  ).data.map((githubCommit: any) => parseCommit(user, repo, githubCommit));
}

interface State {
  /** All commits successfully fetched so far, in order. */
  commits: CommitProps[];

  /** The number of pages successfully fetched so far, possibly including an empty last page. */
  numPagesFetched: number;

  /** True if the last fetch returned zero commits. */
  endReached: boolean;

  /** Indicates a 404 or another error happened on a fetch. */
  error?: '404' | 'unknown';
}

export interface FeedProps {
  /** User or organization that owns the git repo. */
  user?: string;

  /** Repo to display commits for. */
  repo?: string;
}

/** Fetches and displays list of github commits for the user  and repo in the route, and loads more
 * commits on scroll.
 */
export function Feed({ user, repo }: FeedProps) {
  const [state, setState] = useState<State>({
    commits: [],
    numPagesFetched: 0,
    endReached: false,
  });

  /** Fetches the next page of commits and updates state with the new page of commits.
   * Fetch requests must come in ascending page order. The same page may be requested
   * twice, in which case this function only updates state once.
   */
  function fetchNextPage(page: number) {
    if (page <= state.numPagesFetched || state.error) {
      return;
    }
    fetchGithub(user, repo, state.numPagesFetched + 1)
      .then((commits) => {
        if (page <= state.numPagesFetched || state.error) {
          return;
        }
        if (commits.length > 0) {
          setState({
            ...state,
            numPagesFetched: state.numPagesFetched + 1,
            commits: [...state.commits, ...commits],
          });
        } else {
          setState({
            ...state,
            numPagesFetched: state.numPagesFetched + 1,
            endReached: true,
          });
        }
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          setState({ ...state, error: '404' });
        } else {
          setState({ ...state, error: 'unknown' });
        }
      });
  }

  useEffect(() => {
    fetchNextPage(1);
  }, []);

  if (state.error === '404') {
    return (
      <div>
        <h1>404 - Page not found.</h1>
      </div>
    );
  } else if (state.error === 'unknown') {
    return (
      <div>
        <h1>Unknown error occurred</h1>
      </div>
    );
  } else if (state.numPagesFetched > 0) {
    return (
      <div>
        <h1>Showing results for {`${user}/${repo}`}</h1>
        <CommitList commits={state.commits} />
        {!state.endReached && (
          <button
            className='load-more-button'
            onClick={() => fetchNextPage(state.numPagesFetched + 1)}
          >
            Load more
          </button>
        )}
      </div>
    );
  }
  return <div></div>;
}

function parseCommit(
  user: string,
  repo: string,
  githubCommit: any
): CommitProps {
  if (!githubCommit?.commit) {
    return {
      date: 'missing',
      message: 'empty',
      author: 'unknown',
      url: githubCommit?.url,
    };
  }
  const commit = githubCommit.commit;
  return {
    author: commit.author?.name || githubCommit?.login || 'unknown',
    message: commit.message || 'empty',
    date: commit.author?.date || 'missing',
    sha: githubCommit?.sha,
    user,
    repo,
  };
}
