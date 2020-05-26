import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { Creators as AuthActions } from '../store/ducks/auth';
import { Creators as AlertActions } from '../store/ducks/alert';
import { listByEmail } from '../services/user';
import firebase from '../services/firebase';

import AdminLayout from "layouts/Admin/Admin.js";

export default function Main() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async user => {
      setLoading(true);
      if(user) {
        const userData = await listByEmail(user.email);
        if( !userData.role || userData.role === 'CLIENT' ) {
          dispatch(AlertActions.error('Você não possui as permissões necessárias!'));
          firebase.auth().signOut();
          return;
        }
        dispatch(AuthActions.loginSuccess({
          id: user.uid, 
          verified: user.emailVerified,
          role: userData.role,
          data: userData,
        }));
        setAuthenticated(true);
        setLoading(false)
      } else {
        setAuthenticated(false);
        setLoading(false);
      }
    })
  }, [dispatch]);

  const renderMainRoutes = () => {
    return (
      <>
        {authenticated ? (
          <>
            <Route path="/admin" render={props => <AdminLayout {...props} />} />
            <Redirect from="/" to="/admin/dashboard" />
          </>
        ) : (
          <Redirect from="/" to="/login" />
        )}
      </>
    )
  };

  return (
    <Switch>
      {loading 
        ? <Redirect from="/" to="/" />
        : renderMainRoutes()
      }
    </Switch>
  )
}
