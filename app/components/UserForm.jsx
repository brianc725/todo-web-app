import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Alert
} from "reactstrap";
import styled from "styled-components";

const UserForm = ({
  username,
  password,
  usernameChange,
  passwordChange,
  errorMessage
}) => {
  const alertStatus = <Alert color="danger">{errorMessage}</Alert>;

  return (
    <Form>
      <FormGroup>
        {errorMessage && alertStatus}
        <Label>Username</Label>
        <Input
          type="text"
          name="username"
          id="username"
          onChange={usernameChange}
          value={username}
        />
        <FormText>
          Username is 5-30 characters, letters or numbers only. Case
          insensitive.
        </FormText>
      </FormGroup>
      <FormGroup>
        <Label>Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
          onChange={passwordChange}
          value={password}
        />
        <FormText>
          Password is 8-30 characters, case sensitive. Cannot be the same as
          username.
        </FormText>
      </FormGroup>
    </Form>
  );
};

export default UserForm;
