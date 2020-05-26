import React, { useState, useEffect, useCallback } from "react";
import {
  list as listUsers,
  // create as createUsers
} from '../../services/user';
import { useSelector, useDispatch } from 'react-redux';
import { Creators as AlertActions } from '../../store/ducks/alert';
import { Creators as UserActions } from '../../store/ducks/user';
import UsersList from './components/List';
import UserDialog from './components/User';

function Users() {
  const [showForm, setShowForm] = useState(false);
  const [item, setItem] = useState(null);

  const users = useSelector(state => state.user);
  const loading = useSelector(state => state.loading);
  const dispatch = useDispatch();

  const loadData = useCallback(async () => {
    try {
      const result = await listUsers()
      dispatch(UserActions.setUsers(result));
    } catch (err) {
      dispatch(AlertActions.error('Não foi possível listar os usuários! :('));
    }
  }, [dispatch]);

  useEffect(() => {
    loadData(); 
   }, [loadData]);

  const openForm = item => {
    setItem(item);
    setShowForm(true);
  }

  const closeForm = () => {
    setItem(null);
    setShowForm(false);
  }

  return (
    <div className="content">
      <UsersList
        create={openForm}
        edit={openForm}
        items={users}
      />
      <UserDialog
        loadData={loadData}
        item={item}
        open={showForm}
        toggle={closeForm}
        loading={loading}
      />
    </div>
  );
}

export default Users;
