import React, { useState, useMemo, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Creators as AlertActions } from '../../store/ducks/alert';
import { Link } from 'react-router-dom';
import firebase from '../../services/firebase';
import Spinner from 'react-spinner-material';
import CustomAlert from 'components/Alert';

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Row,
  Col,
  Input,
  Form,
  FormGroup
} from "reactstrap";

function Login() {
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState({
    email: '',
    password: ''
  });
  const dispatch = useDispatch();

  const isValid = useMemo(() => !!model.email && !!model.password, [model]);

  const handleForm = (field, value) => {
    setModel({ ...model, [field]: value });
  };

  const handleSubmit = async () => {
    if(!isValid) {
      dispatch(AlertActions.error('Preencha todos os campos!'));
      return;
    }
    const {email, password} = model;
    try {
      setLoading(true);
      await firebase.auth().signInWithEmailAndPassword(email, password);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      dispatch(AlertActions.error(err.message));
    }
  };

  useEffect(() => {
    const reloadCookie = localStorage.getItem('CovidappReloadWindow');
    if(reloadCookie) {
      localStorage.removeItem('CovidappReloadWindow');
      window.location.reload();
    }
  }, [])

  return (
    <div className="login-screen">
      <CustomAlert />
      <div>
        <h1 style={{color: 'white', fontWeight: 'bold'}}>Seja Bem Vindo!!</h1>
      </div>
      <Row style={{width: 400}}>
        <Col>
          <Card style={{backgroundColor: 'white'}}>
            <CardHeader tag="h2" style={{color: 'black'}}>
              Faça seu login
            </CardHeader>
            <CardBody>
              <Form>
                <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Input
                        onChange={event => handleForm('email', event.target.value)}
                        style={{color: 'black', borderColor: '#c6c6c6', marginBottom: 20}}
                        placeholder="Email"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Input
                        onChange={event => handleForm('password', event.target.value)}
                        style={{color: 'black', borderColor: '#c6c6c6'}}
                        placeholder="Senha"
                        type="password"
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </CardBody>
            <CardFooter>
              <Button
                style={{width: '100%', margin: 0, display: 'flex', justifyContent: 'center'}} 
                className="btn-fill"
                color="primary"
                disabled={loading || !isValid}
                onClick={() => handleSubmit()}
              >
                {loading
                  ? <Spinner radius={20} color="#fff" stroke={2} visible={true} />
                  : 'Entrar'
                }
              </Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>
      <Link to="/verify-email">
        <h4 style={{color: 'white', fontWeight: 'bold'}}>Ou ative sua conta ></h4>
      </Link>
    </div>
  );
}

export default Login;
