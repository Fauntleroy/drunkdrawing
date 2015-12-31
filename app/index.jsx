import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Router, { Route, IndexRoute } from 'react-router';
import history from './history';

import store from './store.js';

import App from './components/App';
import Index from './components/Index';
import Room from './components/Room';

render((
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Index} />
        <Route path="/r/:id" component={Room} />
      </Route>
    </Router>
  </Provider>
), document.querySelector('#app'));
