import { format } from 'date-fns';

export interface CommitListProps {
  commits: CommitProps[];
}

export interface CommitProps {
  user: string;
  repo: string;
  date: string;
  author: string;
  message: string;
  sha: string;
}

export function CommitList({ commits }: CommitListProps) {
  return (
    <table>
      <tbody>
        {commits.map((commit, i) => (
          <Commit key={i} {...commit}></Commit>
        ))}
      </tbody>
    </table>
  );
}

function Commit({ user, repo, date, author, message, sha }: CommitProps) {
  return (
    <tr>
      <td className='date-column' width='25%'>
        {date === 'missing'
          ? date
          : format(new Date(date), "MMMM do, yyyy 'at' h:mm a")}
      </td>
      <td className='message-column' width='60%' align='left'>
        <a
          target='_blank'
          rel='noreferrer'
          href={`https://github.com/${user}/${repo}/commit/${sha}`}
        >
          {message}
        </a>
      </td>
      <td className='author-column' width='15%'>
        {author}
      </td>
    </tr>
  );
}
