import { useParams } from 'react-router';
import { Feed } from './Feed';

/** Instantiates a Feed for the user and repo in route. */
export function FeedPage() {
  const { user, repo } = useParams();

  return <Feed user={user} repo={repo} />;
}
