import React, { useState, useEffect } from "react";
import {
  ButtonGroup,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

const Home = function() {
  const history = useHistory();

  const [modalLogin, setModalLogin] = useState(false);
  const toggleLogin = () => setModalLogin(!modalLogin);

  const [modalRegister, setModalRegister] = useState(false);
  const toggleRegister = () => setModalRegister(!modalRegister);

  const toggleLoginSubmission = async () => {
    // TODO - Do some client side validation of username and password first
    const data = { username: "brian", password: "" };

    // call backend api
    let loaded = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    const status = await loaded.status;
    const response = await loaded.json();
     
    console.log('stat', status, 'd', response)
    
    if (status === 200) {
      // Redirect to the users todo site if successful
    history.push("/users");
    }
   
  };

  const LoginModal = (
    <Modal isOpen={modalLogin} toggle={toggleLogin}>
      <ModalHeader toggle={toggleLogin}>Login</ModalHeader>
      <ModalBody>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
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

  const RegisterModal = (
    <Modal isOpen={modalRegister} toggle={toggleRegister}>
      <ModalHeader toggle={toggleRegister}>Register for Account</ModalHeader>
      <ModalBody>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        <p>Username requirements</p>
        <p>Password requirements</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggleRegister}>
          Submit
        </Button>{" "}
        <Button color="secondary" onClick={toggleRegister}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );

  return (
    <div>
      <h1>todos</h1>
      <p>A website for you to track all of your todos.</p>
      <ButtonGroup>
        <Button onClick={toggleLogin}>Login</Button>
        {LoginModal}
        <Button onClick={toggleRegister}>Register</Button>
        {RegisterModal}
      </ButtonGroup>
    </div>
  );
};

export default Home;
