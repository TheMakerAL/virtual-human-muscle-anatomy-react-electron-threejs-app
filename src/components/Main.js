import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { Page } from './base/Page';
import { Home } from './Home';
import { Lost } from './Lost';

export class Main extends Page {
  render() {
    return (
        <main>
          <Redirect exact from="/" to="/home" />
          <Route path="/home" component={Home} />
          <Route path="/lost" component={Lost} />
        </main>
    );
  }
}
