import React from 'react';
import { Feed } from './Feed';

window.process = window.process || {};
window.process.env = window.process.env || {};

describe('<Feed />', () => {
  it('loads from github API', () => {
    cy.mount(<Feed user='djechlin' repo='fixed-test-repo-frozen-commits' />);
    cy.contains('fluffy rabbit').should('exist');
  });
});
