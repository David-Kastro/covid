import React, { useState, useCallback } from 'react';
import Dropzone from 'react-dropzone'
import Spinner from 'react-spinner-material';
import { Creators as AlertActions } from 'store/ducks/alert';

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';

const allowedFormats = [
  'application/pdf',
  'application/msword'
]

const FinishExam = ({ open, toggle, onSubmit, uploadLoading }) => {

  const [loading, setLoading] = useState(false);
  const [loadedFile, setLoadedFile] = useState({
    file: null,
    Uint8: null
  });
  const dispatch = useDispatch();

  const { role, data } = useSelector(state => state.auth);

  const closeForm = () => {
    setLoadedFile({
      file: null,
      Uint8: null
    });
    toggle();
  };

  const onDrop = useCallback((acceptedFiles) => {
    if( acceptedFiles.length > 1 ) {
      dispatch(AlertActions.error('Selecione apenas 1 arquivo!'));
      return;
    }
    setLoading(true)
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      if( !allowedFormats.includes(file.type) ) {
        dispatch(AlertActions.error('Formato de arquivo inválido!'))
        setLoading(false)
        return;
      }

      reader.onabort = () => {
        dispatch(AlertActions.error('Leitura do arquivo interrompida!'))
        setLoading(false)
      }
      reader.onerror = () => {
        dispatch(AlertActions.error('Não foi possível ler o arquivo!'))
        setLoading(false)
      }
      reader.onload = () => {
        const Uint8 = new Uint8Array(reader.result);
        setLoadedFile({file, Uint8});
        setLoading(false);
      }
      reader.readAsArrayBuffer(file)
    })
    
  }, [])

  return (
    <div>
      <Modal isOpen={open}>
        {uploadLoading ? (
          <ModalBody style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection:'column'}}>
            <h4>Fazendo upload...</h4>
            <Spinner radius={48} color="#e14eca" stroke={3} visible={true} />
          </ModalBody>
        ) : (
          <>
            <ModalHeader toggle={closeForm}>
              <span style={{fontSize: 36}}>Finalizar exame</span>
            </ModalHeader>
            <ModalBody>
            <Dropzone onDrop={onDrop}>
              {({getRootProps, getInputProps}) => (
                <section>
                  <div {...getRootProps()} style={{backgroundColor: '#1e1e2f', height: 150, borderStyle: 'dashed', borderWidth: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    {loading ? (
                      <Spinner radius={48} color="#e14eca" stroke={3} visible={true} />
                    ) : (
                      <>
                        <input {...getInputProps()} />
                        <span style={{color: '#fff'}}>
                          {loadedFile.file ? 'Carregar outro arquivo' : 'Arraste ou selecione o resultado do exame! (DOC ou PDF)'}
                        </span>
                      </>
                    )}
                  </div>
                  {loadedFile.file && (
                    <div style={{margin: 20}}>
                      <h4>Arquivo carregado:</h4>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <i className="tim-icons icon-upload" style={{color: '#e14eca', fontSize: 24}} />
                        <span style={{color: '#fff', marginLeft: 10, marginTop: 10}}>{loadedFile.file.name}</span>
                      </div>
                    </div>
                  )}
                </section>
              )}
            </Dropzone>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={closeForm}>Cancelar</Button>
              <Button color="primary" onClick={() => onSubmit(loadedFile)} disabled={loading || !loadedFile.file}>Enviar</Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </div>
  );
}

export default FinishExam;
