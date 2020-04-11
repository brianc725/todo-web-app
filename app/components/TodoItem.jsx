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
  editFormText,
  handleEditFormChange,
  errorMessage
}) => {
  return (
    <InputGroup>
      <InputGroupAddon addonType="prepend">
        {!item.completed ? (
          <Button onClick={() => toggleCompletion(item)}>&#9744;</Button>
        ) : (
          <Button onClick={() => toggleCompletion(item)}>&#9746;</Button>
        )}
      </InputGroupAddon>
      <Input disabled value={item.message} />
      <InputGroupAddon addonType="append">
        <Button onClick={() => toggleEdit(item)}>&#9998;</Button>
        <TodoModal
          item={modalItem}
          modalEdit={modalEdit}
          toggleEdit={toggleEdit}
          toggleEditSubmission={toggleEditSubmission}
          modalDeletion={modalDeletion}
          toggleModalDeletion={toggleModalDeletion}
          toggleModalDeletionSubmission={toggleModalDeletionSubmission}
          editFormText={editFormText}
          handleEditFormChange={handleEditFormChange}
          errorMessage={errorMessage}
        />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default TodoItem;
