import React, { useState, useEffect } from "react";
import { Button } from "reactstrap";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const Page404 = function() {
  const history = useHistory();
  
  return (
    <div>
      <h1>404 - Not Found</h1>
      <h3>this requested page does not exist</h3>
      <Button onClick={() => history.push("/")}>Go Home</Button>
    </div>
  );
};

export default Page404;
