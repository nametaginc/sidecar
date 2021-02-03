import './page.scss'

import React from 'react';
import ReactDOM from 'react-dom';
import {HomePage} from './home';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {AuthCallbackPage} from "./auth";
import {FirebasePage} from "./firebase";
import {NotFoundPage} from "./not_found";

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter basename="/">
          <Switch>
              <Route exact={true} path={"/"} render={() => <HomePage />} />
              <Route exact={true} path={"/callback"} render={() => <AuthCallbackPage />} />
              <Route exact={true} path={"/firebase"} render={() => <FirebasePage />} />
              <Route render={() => <NotFoundPage />} />
          </Switch>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

