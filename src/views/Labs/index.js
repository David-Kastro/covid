import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  list as listLabs,
  create as createLabs,
  save as saveLabs
} from '../../services/lab';
import { getByLab } from '../../services/exam';
import { useSelector, useDispatch } from 'react-redux';
import { Creators as LabActions } from '../../store/ducks/lab';
import { Creators as AlertActions } from '../../store/ducks/alert';
import { Creators as LoadingActions } from '../../store/ducks/loading';
import { enStatus, enStatusColor } from 'helpers/enums';
import { formatDate } from 'helpers/date';

import LabsForm from './components/Form';
import LabsList from './components/List';

import {
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  Badge
} from 'reactstrap';
import Spinner from 'react-spinner-material';

function Labs() {
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [history, setHistory] = useState(null);
  const [item, setItem] = useState(null);

  const labs = useSelector(state => state.lab);
  const loading = useSelector(state => state.loading);
  const dispatch = useDispatch();

  const getAction = useMemo(() => {
    return item && item.id
      ? 'EDIT'
      : 'CREATE';
  }, [item]);

  const loadData = useCallback(async () => {
    try {
      const result = await listLabs();
      dispatch(LabActions.setLabs(result));
    } catch (err) {
      dispatch(AlertActions.error('Não foi possível listar os laboratórios! :('));
    }
  }, [dispatch]);

  useEffect(() => {
    loadData(); 
  }, [loadData]);

  const openForm = item => {
    setItem(item);
    setShowForm(true);
  }

  const closeForm = () => {
    setItem(null);
    setShowForm(false);
  }

  const openHistory = async labId => {
    try {
      setShowHistory(true);
      setLoadingHistory(true);
      const result = await getByLab(labId, 'finished');
      setHistory(result);
      setLoadingHistory(false);
    } catch (err) {
      dispatch(AlertActions.error('Não foi possível carregar o histórico desse laboratório'));
      setLoadingHistory(false);
    }
  }

  const closeHistory = () => {
    setShowHistory(false);
    setHistory(null)
  }

  const handleSubmit = async (model) => {
    try {
      dispatch(LoadingActions.setLoading(true));
      if( getAction === 'CREATE' ) {
        await createLabs(model);
      } else {
        await saveLabs(model);
      }
      await loadData();
      dispatch(AlertActions.success('Dados salvos com sucesso!'));
      dispatch(LoadingActions.setLoading(false));
      closeForm();
    } catch (err) {
      dispatch(AlertActions.error('Não foi possível salvar os dados! :('));
      dispatch(LoadingActions.setLoading(false));
    }
  }

  return (
    <>
      <div className="content">
        {
          showForm ? (
            <LabsForm
              close={() => closeForm()}
              item={item}
              action={getAction}
              loading={loading}
              submit={handleSubmit} 
            />
          ) : (
            <LabsList
              create={openForm} 
              edit={openForm}
              history={openHistory}
              items={labs}
            />
          )
        }
      </div>
      <Modal style={{maxWidth: 800}} isOpen={showHistory} toggle={() => closeHistory()}>
        <ModalHeader toggle={() => closeHistory()} />
        <span style={{fontSize: 24, color: 'white', paddingLeft: 20}}>Histórico de exames finalizados</span>
        {loadingHistory ? (
          <ModalBody style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection:'column'}}>
            <Spinner radius={48} color="#e14eca" stroke={3} visible={true} />
          </ModalBody>
        ) : (
          <ModalBody>
            {history && history.length ? (
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
                    history.map(item => (
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
          </ModalBody>
        )}
      </Modal>
    </>
  );
}

export default Labs;
