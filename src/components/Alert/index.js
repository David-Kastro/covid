import React, { useEffect } from 'react';
import { Alert } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux'
import { Creators as AlertActions } from '../../store/ducks/alert'

const CustomAlert = (props) => {
  const { message, type, show } = useSelector(state => state.alert);
  const dispatch = useDispatch();

  const onDismiss = () => {
    dispatch(AlertActions.dismiss());
  };

  useEffect(() => {
    let timer;
    if(show) {
      timer = setTimeout(() => {
        dispatch(AlertActions.dismiss());
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [show, dispatch])

  return (
    <Alert className="alert-style" color={type} isOpen={show} toggle={onDismiss}>
      {message}
    </Alert>
  );
}

export default CustomAlert;