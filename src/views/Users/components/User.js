import React, { useState, useMemo, useEffect } from 'react';
import { create, save } from '../../../services/user';
import { useDispatch } from 'react-redux';
import { Creators as AlertActions } from '../../../store/ducks/alert';
import { Creators as LoadingActions } from '../../../store/ducks/loading';

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from 'reactstrap';

const requiredFields = [
  'name',
  'last_name',
  'email',
];

const enumTitles = {
  EDIT: 'Editar Usuário',
  CREATE: 'Novo Usuário'
}

const UserDialog = ({ open, toggle, loading, loadData, item }) => {

  const [model, setModel] = useState({
    name: '',
    last_name: '',
    email: '',
    role: 'ADMIN',
    assigned: false,
  });

  const dispatch = useDispatch();

  const closeForm = () => {
    setModel({
      name: '',
      last_name: '',
      email: '',
      role: 'ADMIN',
      assigned: false,
    });
    toggle();
  };

  const getAction = useMemo(() => {
    return item && item.id
      ? 'EDIT'
      : 'CREATE';
  }, [item]);

  useEffect(() => {
    if(getAction === 'EDIT') {
      setModel({
        ...model,
        ...item
      });
    }
  }, [item, getAction])

  const handleForm = (field, value) => {
    setModel({ ...model, [field]: value })
  };

  const formIsValid = () => {
    const invalidFields = requiredFields.filter(field => !model[field]);
    return invalidFields.length === 0;
  };

  const handleSubmit = async () => {
    if( !formIsValid() ) {
      dispatch(AlertActions.error('Preencha todos os campos obrigatórios!'));
      return;
    }

    try {
      dispatch(LoadingActions.setLoading(true));
      if( getAction === 'CREATE' ) {
        await create(model);
        dispatch(AlertActions.success('Usuário cadastrado com sucesso!'));
      } else {
        await save(model);
        dispatch(AlertActions.success('Usuário editado com sucesso!'));
      }
      dispatch(LoadingActions.setLoading(false));
      loadData();
      toggle();
    } catch (err) {
      dispatch(AlertActions.error(err.message));
      dispatch(LoadingActions.setLoading(false));
    }
  };

  return (
    <div>
      <Modal isOpen={open} toggle={closeForm}>
      <ModalHeader toggle={closeForm} style={{fontSize: 42}}>{enumTitles[getAction]}</ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md="12">
                <FormGroup>
                  <Input
                    style={{ color: '#fff' }}
                    onChange={event => handleForm('name', event.target.value)}
                    value={model.name}
                    placeholder="Nome*"
                    type="text"
                    disabled={loading}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <Input
                    style={{ color: '#fff' }}
                    onChange={event => handleForm('last_name', event.target.value)}
                    value={model.last_name}
                    placeholder="Sobrenome*"
                    type="text"
                    disabled={loading}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <Input
                    style={{ color: '#fff' }}
                    onChange={event => handleForm('email', event.target.value)}
                    value={model.email}
                    placeholder="E-mail*"
                    type="email"
                    disabled={loading}
                  />
                </FormGroup>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col xs="12">
              <h4 style={{color: '#fff'}}>Os campos marcado com <span style={{color: '#e14eca'}}>*</span> são obrigatórios!</h4>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeForm}>Cancelar</Button>
          <Button color="primary" onClick={handleSubmit} disabled={loading}>Salvar</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default UserDialog;
