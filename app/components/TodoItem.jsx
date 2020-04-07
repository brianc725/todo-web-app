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
  modalItem,
  modalEdit,
  toggleEdit,
  toggleEditSubmission,
  modalDeletion,
  toggleModalDeletion,
  toggleModalDeletionSubmission,
  toggleCompletion,
  errorMessage
}) => {
  return (
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        {!item.completed ? (
          <Button onClick={() => toggleCompletion(item)}>Done!</Button>
        ) : (
          <Button onClick={() => toggleCompletion(item)}>Reopen</Button>
        )}
      </InputGroupAddon>
      <Input disabled value={item.message} />
      <InputGroupAddon addonType="append">
        <Button onClick={() => toggleEdit(item)}>Edit</Button>
        <TodoModal
          item={modalItem}
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
