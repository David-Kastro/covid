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
  Button
} from "reactstrap";

import IconButton from 'components/IconButton';

function LabsList(props) {
  const { create, edit, items, history } = props;

  return (
    <>
      <Button 
        className="btn-fill mb-3"
        color="primary" 
        onClick={() => create()}
      >
        <div className="button-content">
          <i className="tim-icons icon-simple-add" />
          Novo Laboratório
        </div>
      </Button>
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h2">Laboratórios</CardTitle>
            </CardHeader>
            <CardBody>
              {items.length ? (
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Nome</th>
                      <th>CNPJ</th>
                      <th>E-mail</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      items.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.cnpj}</td>
                          <td>{item.email ? item.email : '---'}</td>
                          <td style={{display: 'flex'}}>
                            <IconButton
                              id="edit-button"
                              icon="pencil" 
                              title="Editar"
                              action={() => edit(item)}
                            />
                            <IconButton
                              id="history-button"
                              icon="notes" 
                              title="Histórico"
                              action={() => history(item.id)}
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

export default LabsList;
