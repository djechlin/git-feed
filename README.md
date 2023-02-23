## Overview

Website that displays a feed of git commits for a given user/organization and repo.

## Instructions

1. Prerequisite: have a current version of `node` and `npm` installed. This app was developed with `node 19.6.0` and `npm 9.4.2`.
1. Create `.env.local` and add your github token with `VITE_GITHUB_API_TOKEN=github_pat_XXXXXXX`. You can generate a token at https://github.com/settings/tokens?type=beta.
1. Install with `npm install`.
1. Optionally: run tests with `npm run test` and `npm run e2e`. You may need to run `npm run test` twice in case of missing dependencies.
1. Run with `npm run dev`, optionally with `-p PORT`.
1. Visit and use the website at `localhost:5173`.

## Testing

Testing is done in `vitest` and `cypress`.

- All components are unit tested.
- - API calls are mocked in `Feed.test.tsx` by mocking `axios`.
- - 404 redirection is implemented in-page and tested in `feed.test.tsx`.
- - Navigation is tested by unit test in `App.test.tsx`.
- Integration with `api.github.com` is tested in the component test `feed.cy.js`.
- - Verify the page loads against a fixed, known username/repo.
- - Verify the 404 loads if not found.

This fits the "test pyramid" shape where unit tests thoroughly cover state management and possible responses from `api.github.com`, then an integration test with `api.github.com` confirms the app can understand responses from the API.

## 404

404s are implemented in-page instead of redirecting to a dedicated `/404.html`. This is consistent with `nytimes.com`, `facebook.com`.

In particular, API calls are mocked in `feed.test.tsx` by mocking `axios`. 404 redirection is implemented in-page and tested in `feed.test.tsx`.

- The component test `feed.cy.js` is used as an e2e test against `github.com` API.

Some additional testing would be nice to have:

- unit test `main.tsx` and the route setup.
- test website navigation in an e2e setup, preferably with a mocked github API.

## CSS

`styled-components` is preferred however this presents an incompatibility with Cypress, so this application fell back to plain CSS. [Github issue](https://github.com/cypress-io/cypress/issues/21434#issuecomment-1441125295)

## Packages / frameworks uses

- `axios` - replacement for fetch that doesn't require manual `JSON.stringify` calls, >30M weekly downloads
- `date-fns` - replacement for `moment` and vanilla Date utils with a more powerful.
- `react-router` - necessary for routing.
- `vite` - faster than `create-react-app`, also a super fast server.
- `eslint` - standard tool for linting.
- `prettier` - standard tool for enforcing consistent formatting.
