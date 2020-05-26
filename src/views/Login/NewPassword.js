import React, { useState, useMemo, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Creators as AlertActions } from '../../store/ducks/alert';
import { useHistory, useParams } from 'react-router-dom';
import firebase from '../../services/firebase';
import Spinner from 'react-spinner-material';
import { listById } from '../../services/user';
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
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();

  const isValid = useMemo(() => !!password, [password]);

  useEffect(() => {
    if(!id) {
      history.goBack();
    }
  }, [id]);

  const handleSubmit = async () => {
    if(!isValid) {
      dispatch(AlertActions.error('Preencha todos os campos!'));
      return;
    }

    try {
      setLoading(true);
      const user = await listById(id);
      if( !user ) {
        dispatch(AlertActions.error('Usuário não encontrado!'));
      }
      await firebase.auth().createUserWithEmailAndPassword(user.email, password);
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
              Crie sua senha
            </CardHeader>
            <CardBody>
              <Form>
                <Row>
                  <Col xs="12">
                    <FormGroup>
                      <Input
                        onChange={event => setPassword(event.target.value)}
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
                  : 'Criar senha'
                }
              </Button>
            </CardFooter>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default VerifyEmail;
