import React, { useState } from "react";

import { Tooltip } from "reactstrap";

function IconButton(props) {
  const { icon, title, action, id, disabled } = props;

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <div onClick={() => disabled ? null : action()}>
      <i id={id} className={`tim-icons icon-${icon} ${disabled ? 'c-icon-button-disabled' : 'c-icon-button'}`} />
      <Tooltip placement="top" isOpen={tooltipOpen} autohide={false} target={id} toggle={toggle}>
        {disabled ? 'Você não tem permissão para realizar essa ação!' : title}
      </Tooltip>
    </div>
  );
}

export default IconButton;