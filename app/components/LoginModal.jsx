import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import UserForm from "./UserForm";

const LoginModal = ({
  modalLogin,
  toggleLogin,
  toggleLoginSubmission,
  username,
  password,
  usernameChange,
  passwordChange,
  errorMessage
}) => {
  return (
    <Modal isOpen={modalLogin} toggle={toggleLogin} scrollable={true}>
      <ModalHeader toggle={toggleLogin}>Login</ModalHeader>
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
        <Button color="primary" onClick={toggleLoginSubmission}>
          Submit
        </Button>{" "}
        <Button color="secondary" onClick={toggleLogin}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default LoginModal;
