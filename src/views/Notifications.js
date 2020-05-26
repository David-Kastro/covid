import React from "react";
import { useSelector } from 'react-redux';
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

function Notifications() {
  const { role } = useSelector(state => state.auth);
  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h2">{role === 'MEDICO' ? 'Seus Exames' : 'Exames'}</CardTitle>
            </CardHeader>
            <CardBody>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'white'}}>
                  Nenhum item encontrado
                </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Notifications;
