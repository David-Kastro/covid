import React, { useState, useEffect, useCallback, useMemo } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from 'react-redux';
import { Creators as AlertActions } from '../store/ducks/alert';
import { getExams } from '../services/exam';
import { removeNotification } from '../services/notification';
import { enStatus, enStatusColor, enNotifications } from '../helpers/enums';
import { formatDateFromTimestamp } from 'helpers/date';
import IconButton from '../components/IconButton';
import Spinner from 'react-spinner-material';

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Tooltip,
  Button,
  ButtonGroup,
  Badge,
  UncontrolledTooltip
} from "reactstrap";

const examFilterOptions = {
  'COLETA': 'Exames de Coleta',
  'CONSULTA': 'Exames de Consulta',
  'TODOS': 'Todos os Exames'
}

function Notifications() {
  const [ examFilter, setExamFilter ] = useState('TODOS');
  const [ loadingRemove, setLoadingRemove ] = useState(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const { role, data } = useSelector(state => state.auth);
  const notifications = useSelector(state => state.notifications);

  const dispatch = useDispatch();

  const getNotifications = useMemo(() => {
    return notifications.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [notifications]);

  const toggle = () => setTooltipOpen(!tooltipOpen);
 
  const readNotification = async path => {
    try {
      toggle()
      setLoadingRemove(true);
      await removeNotification(path);
      setLoadingRemove(false);
    } catch (err) {
      dispatch(AlertActions.error('Não foi possível marcar notificação como lida!'));
      setLoadingRemove(false);
    }
  }

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <CardTitle tag="h2">
                Novas notificações
              </CardTitle>
            </CardHeader>
            <CardBody>
              {getNotifications && getNotifications.length ? (
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Mensagem</th>
                      <th>Criado em</th>
                      <th>Marcar como lido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      getNotifications.map(item => (
                        <tr key={'key_' + item.id}>
                          <td>{enNotifications[item.notificationCode]}</td>
                          <td>{formatDateFromTimestamp(item.createdAt)}</td>
                          <td>
                            {loadingRemove ? (
                              <Spinner radius={26} color="#e14eca" stroke={2} visible={true} />
                            ) : (
                              <div onClick={() => readNotification(item.path)}>
                                <i
                                  className="tim-icons icon-check-2 btn-primary"
                                  style={{padding: 10, borderRadius: 50, cursor: 'pointer'}} 
                                />
                              </div>
                            )}
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
    </div>
  );
}

export default Notifications;
