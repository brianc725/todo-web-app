import React from "react";
import { Alert, Button } from "reactstrap";
import styled from "styled-components";

const TodoItem = ({ message, id }) => {
  return (
    <h3>
      { message }
    </h3>
  );
};

export default TodoItem;
