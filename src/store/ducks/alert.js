import { createActions, createReducer } from 'reduxsauce'

export const { Types, Creators } = createActions({
  setAlert: ['data'],
  dismiss: [],
  error: ['message'],
  success: ['message'],
  info: ['message'],
  warning: ['message'],
})

const INITIAL_STATE = {
  message: 'Erro!',
  type: 'danger',
  show: false,
};

const setAlert = (state = INITIAL_STATE, { data }) => ({...state, ...data});
const dismiss = (state = INITIAL_STATE) => ({ ...state, show: false });

const error = (state = INITIAL_STATE, { message }) => {
  return {
    message,
    type: 'danger',
    show: true
  }
};

const success = (state = INITIAL_STATE, { message }) => {
  return {
    message,
    type: 'success',
    show: true
  }
};

const info = (state = INITIAL_STATE, { message }) => {
  return {
    message,
    type: 'info',
    show: true
  }
};

const warning = (state = INITIAL_STATE, { message }) => {
  return {
    message,
    type: 'warning',
    show: true
  }
};

export default createReducer(INITIAL_STATE, {
  [Types.SET_ALERT]: setAlert,
  [Types.DISMISS]: dismiss,
  [Types.ERROR]: error,
  [Types.SUCCESS]: success,
  [Types.INFO]: info,
  [Types.WARNING]: warning,
})