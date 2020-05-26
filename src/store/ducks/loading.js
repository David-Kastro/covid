import { createActions, createReducer } from 'reduxsauce'

export const { Types, Creators } = createActions({
  setLoading: ['bool'],
})

const INITIAL_STATE = false

const setLoading = (state = INITIAL_STATE, { bool }) => bool;

export default createReducer(INITIAL_STATE, {
  [Types.SET_LOADING]: setLoading,
})