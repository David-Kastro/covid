import React from "react";
import { Route, Switch } from "react-router-dom";

import LoginScreen from '../views/Login';
import VerifyEmail from "../views/Login/VerifyEmail";
import NewPassword from "../views/Login/NewPassword";

export default function Login() {
  return (
    <Switch>
      <Route path="/login">
        <LoginScreen />
      </Route>
      <Route path="/verify-email">
        <VerifyEmail />
      </Route>
      <Route path="/password/:id">
        <NewPassword />
      </Route>
    </Switch>
  )
}
