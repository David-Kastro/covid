import { createActions, createReducer } from 'reduxsauce'

export const { Types, Creators } = createActions({
  setNotifications: ['payload'],
  addNotifications: ['payload'],
  clearNotifications: null
})

const INITIAL_STATE = [];

const setNotifications = (state = INITIAL_STATE, { payload }) => {
  return payload;
};

const addNotifications = (state = INITIAL_STATE, { payload }) => {
  return [...state, ...payload];
};

const clearNotifications = (state = INITIAL_STATE, { payload }) => {
  return [];
};

export default createReducer(INITIAL_STATE, {
  [Types.SET_NOTIFICATIONS]: setNotifications,
  [Types.ADD_NOTIFICATIONS]: addNotifications,
  [Types.CLEAR_NOTIFICATIONS]: clearNotifications
})