import React, { useMemo, useState, useEffect } from "react";
import getCepInfo from '../../../services/cep';
import { listByRole } from '../../../services/user';
import { useDispatch } from 'react-redux';
import { Creators as AlertActions } from '../../../store/ducks/alert';
import Spinner from 'react-spinner-material';
import UserDialog from './User';

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Table
} from "reactstrap";

const requiredFields = [
  'name',
  'cnpj',
  'zip_code',
  'street_number',
  'neighborhood',
  'city',
  'federal_unit',
  // 'public_key',
  // 'access_token',
];

const enumTitles = {
  EDIT: 'Editar Laboratório',
  CREATE: 'Novo Laboratório'
}

function LabsForm(props) {
  const { close, item, action, loading, submit } = props;

  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [loadingAdms, setLoadingAdms] = useState(false);
  const [adms, setAdms] = useState([]);
  const [cepLoading, setCepLoading] = useState(false);
  const [model, setModel] = useState({
    name: '',
    email: '',
    cnpj: '',
    zip_code: '', //Cep
    additional_info: '',
    street_number: '', // Número
    neighborhood: '', // Bairro
    city: '', // Cidade
    federal_unit: '', // UF
    public_key: '', // Chave publica mercado pago
    access_token: '', // Chave privada mercado pago
    adm: '',
  });
  const dispatch = useDispatch();

  const loadAdms = async () => {
    setLoadingAdms(true);
    const users = await listByRole('ADMIN');
    setLoadingAdms(false);
    setAdms(users);
  };

  useEffect(() => {
    loadAdms();
    if(action === 'EDIT') {
      setModel({
        ...model,
        ...item
      });
    }
  }, []);

  const getAdm = useMemo(() => {
    if (!model.adm) {
      return false
    }
    return adms.filter(adm => model.adm === adm.id)[0];
  }, [model.adm, adms]);

  const unassignedAdms = useMemo(() => {
    return adms.length
      ? adms.filter(adm => !adm.assigned || adm.id === model.adm)
      : []
  }, [adms])

  const toggleUserDialog = () => setOpenUserDialog(!openUserDialog);

  const handleForm = (field, value) => {
    setModel({ ...model, [field]: value })
  };

  const setModelAdm = id => {
    setModel({
      ...model,
      adm: id
    })
  };

  const formIsValid = () => {
    const invalidFields = requiredFields.filter(field => !model[field]);
    return invalidFields.length === 0;
  }

  const handleZipCode = async event => {
    const { target: { value } } = event;
    if(value.length > 7) {
      setCepLoading(true);
      const result = await getCepInfo(value);
      if(result.erro) {
        dispatch(AlertActions.error(result.message));
        setCepLoading(false);
        return;
      }
      setModel({
        ...model,
        zip_code: Number(result.cep.match(/\d/g).join('')),
        street_number: Number(result.logradouro.match(/\d/g).join('')),
        neighborhood: result.bairro,
        city: result.localidade,
        federal_unit: result.uf,
      });
      setCepLoading(false);
      return;
    }
    handleForm('zip_code', value)
  }

  const handleSubmit = () => {
    if( !formIsValid() ) {
      dispatch(AlertActions.error('Preencha todos os campos obrigatórios!'));
      return;
    }
    submit(model);
  }

  if(!action) {
    return (
      <div>
        <Button 
          className="btn-icon btn-round mb-2"
          onClick={() => close()}
        >
          <i className="fas fa-arrow-left" />
        </Button>
        <h1>Ação não permitida</h1>
      </div>
    )
  }

  return (
    <>
      <div>
        <Button
          className="btn-icon btn-round mb-2"
          onClick={() => close()}
        >
          <i className="fas fa-arrow-left" />
        </Button>
        <h1>{enumTitles[action]}</h1>
      </div>
      <Row>
        <Col md="8">
          <Card>
            <CardBody>
              <Form>
                <Row>
                  <Col className="pr-md-1" md="6">
                    <FormGroup>
                      <label>Nome do Laboratório*</label>
                      <Input
                        onChange={event => handleForm('name', event.target.value)}
                        value={model.name}
                        placeholder="Nome"
                        type="text"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pl-md-1" md="6">
                    <FormGroup>
                      <label>E-mail</label>
                      <Input
                        onChange={event => handleForm('email', event.target.value)}
                        value={model.email}
                        placeholder="E-mail"
                        type="email"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-md-1" md="6">
                    <FormGroup>
                      <label>CNPJ*</label>
                      <Input
                        onChange={event => handleForm('cnpj', event.target.value)}
                        value={model.cnpj}
                        placeholder="CNPJ"
                        type="text"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pl-md-1" md="6">
                    <FormGroup>
                      <label>CEP*</label>
                      <Row style={{alignItems: 'center'}}>
                        <Col xs="11">
                          <Input
                            onChange={handleZipCode}
                            value={model.zip_code}
                            placeholder="CEP"
                            type="text"
                            disabled={loading || cepLoading}
                          />
                        </Col>
                        <Col xs="1" style={{marginLeft: -5}}>
                          <Spinner radius={20} color="#e14eca" stroke={2} visible={cepLoading} />
                        </Col>
                      </Row>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-md-1" md="5">
                    <FormGroup>
                      <label>Bairro*</label>
                      <Input
                        disabled
                        value={model.neighborhood}
                        placeholder="Bairro"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pl-md-1" md="7">
                    <FormGroup>
                      <label>Complemento</label>
                      <Input
                        onChange={event => handleForm('additional_info', event.target.value)}
                        value={model.additional_info}
                        placeholder="Complemento"
                        type="text"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-md-1" md="4">
                    <FormGroup>
                      <label>UF*</label>
                      <Input
                        disabled
                        value={model.federal_unit}
                        placeholder="UF"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                  <Col className="px-md-1" md="4">
                    <FormGroup>
                      <label>Cidade*</label>
                      <Input
                        disabled
                        value={model.city}
                        placeholder="Cidade"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pl-md-1" md="4">
                    <FormGroup>
                      <label>Número*</label>
                      <Input
                        disabled
                        value={model.street_number}
                        placeholder="Número"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col className="pr-md-1" md="6">
                    <FormGroup>
                      <label>Chave Pública (Mercado Pago)</label>
                      <Input
                        onChange={event => handleForm('public_key', event.target.value)}
                        value={model.public_key}
                        placeholder="Chave Pública"
                        type="text"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                  <Col className="pl-md-1" md="6">
                    <FormGroup>
                      <label>Token de Acesso (Mercado Pago)</label>
                      <Input
                        onChange={event => handleForm('access_token', event.target.value)}
                        value={model.access_token}
                        placeholder="Token de Acesso"
                        type="text"
                        disabled={loading}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
              <Row>
                <Col xs="6">
                  <h4>Os campos marcado com <span style={{color: '#e14eca'}}>*</span> são obrigatórios!</h4>
                  <span>As credenciais do mercado pago são necessárias para serem realizadas as transações e agendamentos! Obtenha-as aqui:<br/>
                    (usar credenciais de produção).
                  </span>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button className="btn-fill" outline color="primary" onClick={close}>
                Cancelar
              </Button>
              <Button className="btn-fill" color="primary" onClick={handleSubmit} disabled={loading}>
                Salvar
              </Button>
            </CardFooter>
          </Card>
        </Col>
        <Col md="4">
          <Card className="card-user">
            <CardBody>
              <CardText />
              {unassignedAdms.length ? (
                <>
                  <div className="author">
                    {!!getAdm ? (
                      <>
                        <div className="block block-one" />
                        <div className="block block-two" />
                        <div className="block block-three" />
                        <div className="block block-four" />
                        <a href="#pablo" onClick={e => e.preventDefault()}>
                          <img
                            alt="..."
                            className="avatar"
                            src={require("assets/img/default-avatar.png")}
                          />
                          <h5 className="title">{getAdm.name}{' '}{getAdm.last_name}</h5>
                        </a>
                        <p className="description">Administrador | {getAdm.email}</p>
                        <Button className="btn-fill" outline color="primary" onClick={() => setModelAdm('')}>
                          Escolher outro
                        </Button>
                      </>
                    ) : (
                      <>
                        <div>
                          <h3 className="title">Selecione um administrador</h3>
                          <Table hover>
                            <tbody>
                              {unassignedAdms.map(adm => (
                                <tr
                                  className="hover-row"
                                  key={'adm_' + adm.id}
                                  onClick={() => setModelAdm(adm.id)}
                                >
                                  <td>{adm.name}{' '}{adm.last_name}</td>
                                  <td>{adm.email}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="author">
                    <div className="block block-one" />
                    <div className="block block-two" />
                    <div className="block block-three" />
                    <div className="block block-four" />
                    {loadingAdms ? (
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 150}}>
                        <Spinner radius={48} color="white" stroke={3} visible={true} />
                      </div>
                    ) : (
                      <>
                        <a href="#pablo" onClick={() => toggleUserDialog()} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                          <div className='avatar' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <i className="tim-icons icon-simple-add" style={{color: 'white', fontSize: 40}} />
                          </div>
                          <h5 className="title">Adicionar um Sócio-administrador</h5>
                        </a>
                        <p className="description">Nenhum Sócio-administrador encontrado!</p>
                      </>
                    )}
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <UserDialog
        open={openUserDialog}
        toggle={toggleUserDialog}
        setAdm={setModelAdm}
        loading={loading}
      />
    </>
  );
}

export default LabsForm;
