import { createActions, createReducer } from 'reduxsauce';

export const { Types, Creators } = createActions({
  loginSuccess: ['user'],
  loginFail: null,
  setLoading: null,
});

const INITIAL_STATE = {
  id: null,
  role: null,
  verified: false,
  data: {},
  loading: false,
};

const loginSuccess = (state = INITIAL_STATE, { user }) => ({
  ...state,
  id: user.id,
  role: user.role,
  verified: user.verified,
  data: user.data,
  loading: false
});

const loginFail = (state = INITIAL_STATE) => ({
  ...state,
  id: null,
  role: null,
  verified: false,
  data: {},
  loading: false,
});

const setLoading = (state = INITIAL_STATE) => ({
  ...state,
  loading: true,
});

export default createReducer(INITIAL_STATE, {
  [Types.LOGIN_SUCCESS]: loginSuccess,
  [Types.LOGIN_FAIL]: loginFail,
  [Types.SET_LOADING]: setLoading,
})