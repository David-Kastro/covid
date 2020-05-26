import React from "react";
import Ellipsis from "components/Ellipsis";

function Loading() {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
      <Ellipsis color="#e14eca" />
    </div>
  );
}

export default Loading;
