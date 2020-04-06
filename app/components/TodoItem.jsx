import React, { useState } from "react";
import {
  Alert,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input
} from "reactstrap";
import styled from "styled-components";
import TodoModal from "./TodoModal";

const TodoItem = ({
  item,
  modalEdit,
  toggleEdit,
  toggleEditSubmission,
  modalDeletion,
  toggleModalDeletion,
  toggleModalDeletionSubmission,
  errorMessage
}) => {
  // toggle completion or not

  // In edit mode change edit to submit and delete to cancel
  // disabled={disabled}

  // modal with submit, DELETE, cancel
  // DELETE second nested modal to confirm

  return (
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        {!item.completed ? <Button>Done!</Button> : <Button>Reopen</Button>}
      </InputGroupAddon>
      <Input disabled value={item.message} />
      <InputGroupAddon addonType="append">
        <Button onClick={toggleEdit}>Edit</Button>
        <TodoModal
          modalEdit={modalEdit}
          toggleEdit={toggleEdit}
          toggleEditSubmission={toggleEditSubmission}
          modalDeletion={modalDeletion}
          toggleModalDeletion={toggleModalDeletion}
          toggleModalDeletionSubmission={toggleModalDeletionSubmission}
          errorMessage={errorMessage}
        />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default TodoItem;
