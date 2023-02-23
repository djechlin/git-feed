import './App.css';
// Necessary to import * instead of import {useNavigate} for mocking.
import * as router from 'react-router-dom';
import { useState } from 'react';

function App() {
  const navigate = router.useNavigate();

  const [user, setUser] = useState('');
  const [repo, setRepo] = useState('');

  function onSubmit() {
    navigate(`${user}/${repo}`);
  }

  return (
    <div className='App'>
      <form onSubmit={onSubmit}>
        <div>
          <input
            placeholder='User/org'
            type='text'
            required
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder='Repo'
            type='text'
            required
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
          />
        </div>
        <div>
          <input type='submit' className='submit-button' value='Submit' />
        </div>
      </form>
    </div>
  );
}

export default App;
