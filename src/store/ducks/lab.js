import { createActions, createReducer } from 'reduxsauce'

export const { Types, Creators } = createActions({
  setLabs: ['data'],
})

const INITIAL_STATE = []

const setLabs = (state = INITIAL_STATE, { data }) => [...data];

export default createReducer(INITIAL_STATE, {
  [Types.SET_LABS]: setLabs,
})