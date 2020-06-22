import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  list as listUsers,
  // create as createUsers
} from '../../services/user';
import {
  list as listLabs
} from '../../services/lab';
import { useSelector, useDispatch } from 'react-redux';
import { Creators as AlertActions } from '../../store/ducks/alert';
import { Creators as LabActions } from '../../store/ducks/lab';
import { Creators as UserActions } from '../../store/ducks/user';
import UsersList from './components/List';
import UserDialog from './components/User';

function Users() {
  const [showForm, setShowForm] = useState(false);
  const [item, setItem] = useState(null);

  const users = useSelector(state => state.user);
  const labs = useSelector(state => state.lab);
  const loading = useSelector(state => state.loading);
  const { data } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const getUsers = useMemo(() => {
    if( !labs.length ) {
      return users;
    }
    return users.map(user => {
      const labName = user.assignedTo
        ? labs.filter(lab => lab.id === user.assignedTo)[0].name
        : 'SESC';
      return {...user, labName };
    });
  }, [users, labs]);

  const loadData = useCallback(async () => {
    try {
      const result = await listUsers(data);
      dispatch(UserActions.setUsers(result));
      const resultLabs = await listLabs();
      dispatch(LabActions.setLabs(resultLabs));
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
        items={getUsers}
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
