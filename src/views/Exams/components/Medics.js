import React, { useState, useMemo, useEffect } from 'react';
import Spinner from 'react-spinner-material';
import { Creators as AlertActions } from 'store/ducks/alert';
import { getMedics } from 'services/user';

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

const MedicsDialog = ({ open, toggle, onSubmit, lab }) => {

  const [loading, setLoading] = useState(false);
  const [medics, setMedics] = useState([]);
  const [medicSelected, setMedicSelected] = useState(null);
  const dispatch = useDispatch();

  const { role, data } = useSelector(state => state.auth);

  const loadMedics = async () => {
    setLoading(true);
    const users = await getMedics(data, lab);
    setLoading(false);
    setMedics(users);
  };

  useEffect(() => {
    loadMedics();
  }, []);

  const getMedic = useMemo(() => {
    if (!medicSelected) {
      return;
    }
    return medics.filter(medic => medicSelected === medic.id)[0];
  }, [medicSelected, medics]);

  const closeForm = () => {
    setMedicSelected(null);
    toggle();
  };

  const handleSubmit = async () => {
    if( !medicSelected ) {
      dispatch(AlertActions.error('Selecione um médico!'));
      return;
    }
    onSubmit(medicSelected);
  };

  return (
    <div>
      <Modal isOpen={open} toggle={closeForm}>
        <ModalHeader toggle={closeForm}>
          <span style={{fontSize: 36}}>Escolha um médico</span>
        </ModalHeader>
        <ModalBody className="card-user">
          {medics.length ? (
            <>
              <div className="author">
                {!!getMedic ? (
                  <>
                    <a href="#pablo" onClick={e => e.preventDefault()}>
                      <img
                        alt="..."
                        className="avatar"
                        src={require("assets/img/default-avatar.png")}
                        style={{borderRadius: 100}}
                      />
                      <h5 className="title">{getMedic.name}{' '}{getMedic.last_name}</h5>
                    </a>
                    <p className="description" style={{color: '#fff'}}>Médico | {getMedic.email}</p>
                    <Button className="btn-fill" outline color="primary" onClick={() => setMedicSelected(null)}>
                      Escolher outro
                    </Button>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="title">Selecione um Médico</h3>
                      <Table hover>
                        <tbody>
                          {medics.map(medic => (
                            <tr
                              className="hover-row"
                              key={'medic_' + medic.id}
                              onClick={() => setMedicSelected(medic.id)}
                            >
                              <td>{medic.name}{' '}{medic.last_name}</td>
                              <td>{medic.email}</td>
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
                {loading ? (
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 150}}>
                    <Spinner radius={48} color="white" stroke={3} visible={true} />
                  </div>
                ) : (
                  <>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                      <h4>Nenhum Médico encontrado!</h4>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={closeForm}>Cancelar</Button>
          <Button color="primary" onClick={handleSubmit} disabled={loading || !medicSelected}>Salvar</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default MedicsDialog;
