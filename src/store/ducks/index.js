 
import { combineReducers } from 'redux'

import lab from './lab';
import alert from './alert';
import loading from './loading';
import user from './user';
import auth from './auth';
import notifications from './notifications';

export default combineReducers({
  lab,
  alert,
  loading,
  user,
  auth,
  notifications
})