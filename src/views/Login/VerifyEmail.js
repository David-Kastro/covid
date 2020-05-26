import React, { useState, useMemo } from "react";
import { useDispatch } from 'react-redux';
import { Creators as AlertActions } from '../../store/ducks/alert';
import { useHistory } from 'react-router-dom';
import firebase from '../../services/firebase';
import Spinner from 'react-spinner-material';
import { listByEmail } from '../../services/user';
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

function VerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  const isValid = useMemo(() => !!email, [email]);

  const handleSubmit = async () => {
    if(!isValid) {
      dispatch(AlertActions.error('Preencha todos os campos!'));
      return;
    }

    try {
      setLoading(true);
      const signInMethods = await firebase
        .auth()
        .fetchSignInMethodsForEmail(email);
      
      if( signInMethods.length ) {
        dispatch(AlertActions.error('Já existe uma conta ativa com este e-mail!'));
        return;
      }

      const verifiedEmail = await listByEmail(email);
      if( !verifiedEmail ) {
        dispatch(AlertActions.error('Este email não é válido ou não está registrado no sistema!'));
        return;
      }

      history.push(`/password/${verifiedEmail.id}`);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      dispatch(AlertActions.error(err.message));
    }
  };

  return (
    <div className="login-screen">
      <CustomAlert />
      <Row style={{width: 400}}>
        <Col>
          <Card style={{backgroundColor: 'white'}}>
            <CardHeader tag="h2" style={{color: 'black'}}>
            <Button
              className="btn-icon btn-round mb-2 mr-3"
              onClick={() => history.goBack()}
            >
              <i className="fas fa-arrow-left" />
            </Button>
              Verifique seu E-mail
            </CardHeader>
            <CardBody>
              <Form>
                <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Input
                        onChange={event => setEmail(event.target.value)}
                        style={{color: 'black', borderColor: '#c6c6c6'}}
                        placeholder="Email"
                        type="text"
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
                  : 'Verificar'
                }
              </Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>
      <div style={{maxWidth: 500, marginTop: 20}}>
        <h4 style={{fontWeight: 'bold', color: '#fff'}}>
          Para ativar sua conta, seu email precisa ser pré-registrado por um administrador do sistema!
          Caso seu email não esteja pré-registrado, peça ao administrador do sistema para que seu e-mail 
          seja registrado ou para que verifique se o seu e-mail foi registrado corretamente.
        </h4>
      </div>
    </div>
  );
}

export default VerifyEmail;
