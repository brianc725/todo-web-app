import React, { useState, useEffect } from "react";
import {
  ButtonGroup,
  Button,
} from "reactstrap";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const Home = function() {
  const history = useHistory();

  const [modalLogin, setModalLogin] = useState(false);
  const toggleLogin = () => {
    setModalLogin(!modalLogin);
    setError("");
    setUsername("");
    setPassword("");
  }

  const [modalRegister, setModalRegister] = useState(false);
  const toggleRegister = () => {
    setModalRegister(!modalRegister);
    setError("");
    setUsername("");
    setPassword("");
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleUserFieldChange = e => {
    setUsername(e.target.value);
  };

  const handlePasswordFieldChange = e => {
    setPassword(e.target.value);
  };

  const toggleLoginSubmission = async () => {
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

    if (status === 200) {
      setUsername('');
      setPassword('');
      // Redirect to the users todo site if successful
      history.push("/users");
      return;
    }
    
    // Error here 
    setError(response.error);
  };
  
  const toggleRegisterSubmission = async () => {
    setError('username taken already')
  }

  return (
    <div>
      <h1>todos</h1>
      <p>A website for you to track all of your todos.</p>
      <ButtonGroup>
        <Button onClick={toggleLogin}>Login</Button>
        <LoginModal
          modalLogin={modalLogin}
          toggleLogin={toggleLogin}
          toggleLoginSubmission={toggleLoginSubmission}
          username={username}
          password={password}
          usernameChange={handleUserFieldChange}
          passwordChange={handlePasswordFieldChange}
          errorMessage={error}
        /> 
        <Button onClick={toggleRegister}>Register</Button>
        <RegisterModal
          modalRegister={modalRegister}
          toggleRegister={toggleRegister}
          toggleRegisterSubmission={toggleRegisterSubmission}
          username={username}
          password={password}
          usernameChange={handleUserFieldChange}
          passwordChange={handlePasswordFieldChange}
          errorMessage={error}
          />
      </ButtonGroup>
    </div>
  );
};

export default Home;
