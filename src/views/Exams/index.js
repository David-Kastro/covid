import React, { useState, useEffect, useCallback, useMemo } from "react";
import classNames from "classnames";
import { useDispatch, useSelector } from 'react-redux';
import { Creators as AlertActions } from '../../store/ducks/alert';
import { Creators as LoadingActions } from '../../store/ducks/loading';
import { getExams, assignExam } from '../../services/exam';
import { enStatus, enStatusColor } from '../../helpers/enums';
import { formatDate } from 'helpers/date';

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
  ButtonGroup,
  Badge,
  UncontrolledTooltip
} from "reactstrap";

import Medics from './components/Medics';

const examFilterOptions = {
  'COLETA': 'Exames de Coleta',
  'CONSULTA': 'Exames de Consulta',
  'TODOS': 'Todos os Exames'
}

function Exams() {
  const [ examFilter, setExamFilter ] = useState('TODOS');
  const [ exams, setExams ] = useState(null);
  const [ showMedicsDialog, setShowMedicsDialog ] = useState(false);
  const [ selectedExam, setSelectedExam ] = useState(null);
  const { role, data } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const getFilteredExams = useMemo(() => {
    if(examFilter === 'TODOS') {
      return exams;
    }
    return exams.filter(exam => exam.type === examFilter) 
  }, [exams, examFilter]);

  const loadData = useCallback(async () => {
    try { 
      const result = await getExams(data);
      setExams(result);
    } catch(err) {
      dispatch(AlertActions.error('Erro ao buscar dados de Exames'));
    }
  }, [dispatch, data]);

  const assignExamToMedic = async medic => {
    try {
      dispatch(LoadingActions.setLoading(true));
      await assignExam(selectedExam, medic);
      closeMedicsDialog();
    } catch(err) {
      dispatch(AlertActions.error('Não foi possível atribuir o Exame'));
    }
  }

  const openMedicsDialog = exam => {
    setSelectedExam(exam);
    setShowMedicsDialog(true);
  };

  const closeMedicsDialog = () => {
    setShowMedicsDialog(false);
    setSelectedExam(null);
  };

  const getSelectedExamLabId = exam => {
    return exams.filter(ex => ex.id === exam)[0].lab_id;
  };
 
  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="content">
      <Row>
        <Col md="12">
          <Card>
            <CardHeader>
              <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">{role === 'MEDICO' ? 'Seus Exames' : 'Exames'}</h5>
                    <CardTitle tag="h2">{examFilterOptions[examFilter]}</CardTitle>
                  </Col>
                  <Col sm="6">
                    <ButtonGroup
                      className="btn-group-toggle float-right"
                      data-toggle="buttons"
                    >
                      <Button
                        tag="label"
                        className={classNames("btn-simple", {
                          active: examFilter === "TODOS"
                        })}
                        color="primary"
                        id="0"
                        size="sm"
                        onClick={() => setExamFilter("TODOS")}
                      >
                        <input
                          defaultChecked
                          className="d-none"
                          name="options"
                          type="radio"
                        />
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Todos
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-single-02" />
                        </span>
                      </Button>
                      <Button
                        color="primary"
                        id="1"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: examFilter === "COLETA"
                        })}
                        onClick={() => setExamFilter("COLETA")}
                      >
                        <input
                          className="d-none"
                          name="options"
                          type="radio"
                        />
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                        Coleta
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-gift-2" />
                        </span>
                      </Button>
                      <Button
                        color="primary"
                        id="2"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: examFilter === "CONSULTA"
                        })}
                        onClick={() => setExamFilter("CONSULTA")}
                      >
                        <input
                          className="d-none"
                          name="options"
                          type="radio"
                        />
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                        Consulta
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02" />
                        </span>
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
            </CardHeader>
            <CardBody>
              {getFilteredExams && getFilteredExams.length ? (
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Tipo</th>
                      <th>Cliente</th>
                      <th>Status</th>
                      <th>Atribuído</th>
                      <th>Agendado para</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      getFilteredExams.map(item => (
                        <tr key={item.id}>
                          <td>{item.type}</td>
                          <td>{item.client}</td>
                          <td>
                            <Badge style={{fontSize: 14, backgroundColor: enStatusColor[item.status]}}>
                              {item.status === 'approved' && !item.booked_at ? 'Aguardando Agendamento' : enStatus[item.status]}
                            </Badge>
                          </td>
                          <td>{item.assigned ? (
                            <Badge color="success" style={{fontSize: 14}}>Sim</Badge>
                          ) : (
                            <Badge color="light" style={{fontSize: 14}}>Não</Badge>
                          )}</td>
                          <td>{item.booked_at ? formatDate(item.booked_at.seconds) : '---'}</td>
                          <td>
                            <div id={'button_' + item.id}>
                              <Button
                                color={item.assigned ? 'secondary' : 'primary'}
                                disabled={item.status !== 'booked' || !item.booked_at}
                                onClick={() => openMedicsDialog(item.id)}
                                style={{width: 180}}
                              >
                                {role === 'MEDICO' ? (
                                  <span style={{color: '#fff', fontSize:10, padding: 0}}>Pegar exame</span>
                                ) : (
                                  <span style={{color: '#fff', fontSize:10, padding: 0}}>{item.assigned ? 'Mudar médico' : 'Atribuir a um médico'}</span>
                                )}
                              </Button>
                            </div>
                            <UncontrolledTooltip
                              delay={0}
                              target={'button_' + item.id}
                              placement="right"
                            >
                              {item.status === 'approved' && !item.booked_at ? 'Aguardando Agendamento' : enStatus[item.status]}
                            </UncontrolledTooltip>
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
      {selectedExam && (
        <Medics open={showMedicsDialog} toggle={closeMedicsDialog} onSubmit={assignExamToMedic} lab={getSelectedExamLabId(selectedExam)} />
      )}
    </div>
  );
}

export default Exams;
