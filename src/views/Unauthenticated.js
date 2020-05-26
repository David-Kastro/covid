import React from "react";
import { Link } from 'react-router-dom';
import { Button } from "reactstrap";

function Unauthenticated() {
  return (
    <div style={{display: flex, alignItems: 'center', height: '100%'}}>
      <div>Ops!! Voce precisa estar logado para acessar este recurso!</div>
      <Link to='/login'>
        <Button>Ir para a tela de Login</Button>
      </Link>
    </div>
  );
}

export default Unauthenticated;
