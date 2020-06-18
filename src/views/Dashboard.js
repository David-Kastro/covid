import React, { useState, useEffect, useCallback, useMemo } from "react";
import classNames from "classnames";
import { Line, Bar } from "react-chartjs-2";
import { Redirect } from "react-router-dom";
import { getExamsGraph, getProfitGraph, getClientsGraph } from '../services/dashboard';
import { getByStatus } from '../services/exam';
import { useDispatch, useSelector } from 'react-redux';
import { Creators as AlertActions } from '../store/ducks/alert';
import { enStatus, enStatusColor } from 'helpers/enums';
import { formatDate } from 'helpers/date';

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Row,
  Col,
  Table,
  Badge
} from "reactstrap";

// core components
import {
  chart1,
  chart2,
  chart3,
  chart4
} from "variables/charts.js";

function Dashboard() {
  const [bigChartData, setBigChartData] = useState("data1");
  const [dataChart1, setDataChart1] = useState(null);
  const [dataChart2, setDataChart2] = useState(null);
  const [dataChart3, setDataChart3] = useState(null);
  const [dataChart4, setDataChart4] = useState(null);
  const [bookedExams, setBookedExams] = useState(null);
  const [finishedExams, setFinishedExams] = useState(null);

  const { data, role } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const getBookedExams = useMemo(() => {
    if( !bookedExams ) {
      return []
    }
    return bookedExams;
  }, [bookedExams]);

  const getFinishedExams = useMemo(() => {
    if( !finishedExams ) {
      return []
    }
    return finishedExams;
  }, [finishedExams]);

  const loadData = useCallback(async () => {
    try {
      const chartsData = await Promise.all([
        getExamsGraph(data),
        getClientsGraph(data),
        getProfitGraph(data),
        getByStatus(data, 'booked'),
        getByStatus(data, 'finished'),
      ]);
      setDataChart1(chartsData[0]);
      setDataChart2(chartsData[1]);
      setDataChart3(chartsData[2]);
      setDataChart4(chartsData[0].dataFinished);
      setBookedExams(chartsData[3]);
      setFinishedExams(chartsData[4]);
    } catch (err) {
      dispatch(AlertActions.error('Não foi possível buscar os dados!'));
    }
  }, [dispatch])

  useEffect(() => {
    loadData()
  }, [loadData])

  if( role === 'MEDICO' ){
    return <Redirect from="/" to="/admin/exames" />
  }

  return (
    <>
      <div className="content">
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">Exames</h5>
                    <CardTitle tag="h2">Total de exames por tipo</CardTitle>
                  </Col>
                  <Col sm="6">
                    <ButtonGroup
                      className="btn-group-toggle float-right"
                      data-toggle="buttons"
                    >
                      <Button
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data1"
                        })}
                        color="info"
                        id="0"
                        size="sm"
                        onClick={() => setBigChartData("data1")}
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
                        color="info"
                        id="1"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data2"
                        })}
                        onClick={() => setBigChartData("data2")}
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
                        color="info"
                        id="2"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data3"
                        })}
                        onClick={() => setBigChartData("data3")}
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
                <div className="chart-area">
                  {dataChart1 && <Line
                    data={chart1(dataChart1.labels, dataChart1[bigChartData]).data1}
                    options={chart1(dataChart1.labels, dataChart1[bigChartData]).options}
                  />}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Total de clientes</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-single-02 text-info" />{" "}
                  {dataChart2 ? dataChart2.total : '0'}
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  {dataChart2 && <Line
                    data={chart2(dataChart2.labels, dataChart2.data).data}
                    options={chart2(dataChart2.labels, dataChart2.data).options}
                  />}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Total de lucro</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-coins text-primary" />{" "}
                  {dataChart3 ? dataChart3.total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) : 'R$ 0,00'}
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  {dataChart3 && <Bar
                    data={chart3(dataChart3.labels, dataChart3.data).data}
                    options={chart3(dataChart3.labels, dataChart3.data).options}
                  />}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Exames concluídos</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-send text-success" />
                  {dataChart4 ? dataChart4.total : '0'}
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  {dataChart4 && <Line
                    data={chart4(dataChart4.labels, dataChart4.data).data}
                    options={chart4(dataChart4.labels, dataChart4.data).options}
                  />}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="6" md="12">
            <Card className="card-tasks">
              <CardHeader>
                <h6 className="title d-inline">Exames Agendados({getBookedExams.length})</h6>
                {/* <p className="card-category d-inline"> hoje</p> */}
                <UncontrolledDropdown>
                  <DropdownToggle
                    caret
                    className="btn-icon"
                    color="link"
                    data-toggle="dropdown"
                    type="button"
                  >
                    <i className="tim-icons icon-settings-gear-63" />
                  </DropdownToggle>
                  <DropdownMenu aria-labelledby="dropdownMenuLink" right>
                    <DropdownItem
                      onClick={() => loadData()}
                    >
                      Recarregar
                    </DropdownItem>
                    {/* <DropdownItem
                      href="#pablo"
                      onClick={e => e.preventDefault()}
                    >
                      Mostrar não visualizados
                    </DropdownItem>
                    <DropdownItem
                      href="#pablo"
                      onClick={e => e.preventDefault()}
                    >
                      Selecionar todos
                    </DropdownItem> */}
                  </DropdownMenu>
                </UncontrolledDropdown>
              </CardHeader>
              <CardBody>
                {getBookedExams && getBookedExams.length ? (
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Tipo</th>
                        <th>Status</th>
                        <th>Atribuído</th>
                        <th>Agendado para</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        getBookedExams.map(item => (
                          <tr key={item.id}>
                            <td>{item.type}</td>
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
          <Col lg="6" md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Ultimos exames concluídos</CardTitle>
              </CardHeader>
              <CardBody>
                {getFinishedExams && getFinishedExams.length ? (
                  <Table className="tablesorter" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th>Tipo</th>
                        <th>Status</th>
                        <th>Atribuído</th>
                        <th>Agendado para</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        getFinishedExams.map(item => (
                          <tr key={item.id}>
                            <td>{item.type}</td>
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
    </>
  );
}

export default Dashboard;
