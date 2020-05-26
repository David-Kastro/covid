import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  list as listLabs,
  create as createLabs,
  save as saveLabs
} from '../../services/lab';
import { useSelector, useDispatch } from 'react-redux';
import { Creators as LabActions } from '../../store/ducks/lab';
import { Creators as AlertActions } from '../../store/ducks/alert';
import { Creators as LoadingActions } from '../../store/ducks/loading';

import LabsForm from './components/Form';
import LabsList from './components/List';

import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';

function Labs() {
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
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

  const openHistory = () => {
    setShowHistory(true);
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
      <Modal style={{maxWidth: 800}} isOpen={showHistory} toggle={() => setShowHistory(false)}>
        <ModalHeader toggle={() => setShowHistory(false)} />
        <span style={{fontSize: 24, color: 'white', paddingLeft: 20}}>Histórico de exames</span>
        <ModalBody>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'white'}}>
            Nenhum item encontrado
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Labs;
