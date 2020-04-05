import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import UserForm from "./UserForm";

const RegisterModal = ({
  modalRegister,
  toggleRegister,
  toggleRegisterSubmission,
  username,
  password,
  usernameChange,
  passwordChange,
  errorMessage
}) => {
  return (
    <Modal isOpen={modalRegister} toggle={toggleRegister} scrollable={true}>
      <ModalHeader toggle={toggleRegister}>Register for Account</ModalHeader>
      <ModalBody>
        <UserForm
          username={username}
          password={password}
          usernameChange={usernameChange}
          passwordChange={passwordChange}
          errorMessage={errorMessage}
        />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggleRegisterSubmission}>
          Submit
        </Button>{" "}
        <Button color="secondary" onClick={toggleRegister}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RegisterModal;
