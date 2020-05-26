import { createActions, createReducer } from 'reduxsauce'

export const { Types, Creators } = createActions({
  setUsers: ['data'],
})

const INITIAL_STATE = []

const setUsers = (state = INITIAL_STATE, { data }) => [...data];

export default createReducer(INITIAL_STATE, {
  [Types.SET_USERS]: setUsers,
})