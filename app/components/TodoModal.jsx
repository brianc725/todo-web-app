import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input
} from "reactstrap";
import styled from "styled-components";

const TodoModal = ({
  item, 
  modalEdit,
  toggleEdit,
  toggleEditSubmission,
  modalDeletion,
  toggleModalDeletion,
  toggleModalDeletionSubmission,
  editFormText,
  handleEditFormChange,
  errorMessage
}) => {
  return (
    <Modal isOpen={modalEdit} toggle={toggleEdit} scrollable={true}>
      <ModalHeader toggle={toggleEdit}>Edit Todo</ModalHeader>
      <ModalBody>
        <Input onChange={handleEditFormChange} value={editFormText} />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => toggleEditSubmission(item)}>
          Submit
        </Button>{" "}
        <Button color="danger" onClick={toggleModalDeletion}>
          Delete
        </Button>{" "}
        <Modal
          isOpen={modalDeletion}
          toggle={toggleModalDeletion}
          scrollable={true}
        >
          <ModalHeader toggle={toggleModalDeletion}>
            Confirm Deletion
          </ModalHeader>
          <ModalBody>
            <Label>Are you sure you want to delete this todo?</Label>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => toggleModalDeletionSubmission(item)}>
              Delete
            </Button>{" "}
            <Button color="secondary" onClick={toggleModalDeletion}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Button color="secondary" onClick={toggleEdit}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TodoModal;
