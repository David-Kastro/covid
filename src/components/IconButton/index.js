import React, { useState } from "react";

import { Tooltip } from "reactstrap";

function IconButton(props) {
  const { icon, title, action, id } = props;

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <div onClick={() => action()}>
      <i id={id} className={`tim-icons icon-${icon} c-icon-button`} />
      <Tooltip placement="top" isOpen={tooltipOpen} autohide={false} target={id} toggle={toggle}>
        {title}
      </Tooltip>
    </div>
  );
}

export default IconButton;