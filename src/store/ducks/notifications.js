import { createActions, createReducer } from 'reduxsauce'

export const { Types, Creators } = createActions({
  setNotifications: ['payload'],
  addNotifications: ['payload']
})

const INITIAL_STATE = [];

const setNotifications = (state = INITIAL_STATE, { payload }) => {
  return payload;
};

const addNotifications = (state = INITIAL_STATE, { payload }) => {
  return [...state, ...payload];
};

export default createReducer(INITIAL_STATE, {
  [Types.SET_NOTIFICATIONS]: setNotifications,
  [Types.ADD_NOTIFICATIONS]: addNotifications
})