import React from "react";
import { Route, Switch } from "react-router-dom";

import LoadingScreen from '../views/Loading';

export default function Loading() {
  return (
    <Switch>
      <Route exact path="/">
        <LoadingScreen />
      </Route>
    </Switch>
  )
}
