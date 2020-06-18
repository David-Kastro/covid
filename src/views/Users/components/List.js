import React from "react";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  Badge
} from "reactstrap";

import IconButton from 'components/IconButton';

import { useSelector } from 'react-redux';

const rolesColors = {
  ADMIN: 'primary',
  MEDICO: 'info',
  CLIENT: 'light'
}

function UsersList(props) {
  const { create, edit, items } = props;
  const { role, assigned } = useSelector(state => state.auth);
  return (
    <>
      <Button 
        className="btn-fill mb-3"
        color="primary"
        onClick={() => create()}
      >
        <div className="button-content">
          <i className="tim-icons icon-simple-add" />
          Novo Usuário
        </div>
      </Button>
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h2">Usuários</CardTitle>
            </CardHeader>
            <CardBody>
              {items.length ? (
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>Perfil</th>
                      <th>Atribuído</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      items.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}{' '}{item.last_name}</td>
                          <td>{item.email}</td>
                          <td><Badge color={rolesColors[item.role]} style={{fontSize: 14}}>{item.role}</Badge></td>
                          {item.role === 'MEDICO' ? (
                            <td>---</td>
                          ) : (
                            <td>{item.assigned ? (
                              <Badge color="success" style={{fontSize: 14}}>Sim</Badge>
                            ) : (
                              <Badge color="light" style={{fontSize: 14}}>Não</Badge>
                            )}</td>
                          )}
                          <td>
                            <IconButton
                              id="user-edit"
                              icon="pencil" 
                              title="Editar"
                              disabled={role !== 'DEV' && item.role === 'ADMIN'}
                              action={() => edit(item)}
                            />
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
              ) : (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'white'}}>
                  Nenhum item encontrado
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default UsersList;
