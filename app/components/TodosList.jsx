import React, { useState, useContext } from "react";
import { Alert } from "reactstrap";
import styled from "styled-components";
import { UserContext } from "../UserContext";

const TodosList = () => {
  const { user, setUser } = useContext(UserContext);

  return (
    <pre>{JSON.stringify(user, null, 2)}</pre>
  );
};

export default TodosList;
