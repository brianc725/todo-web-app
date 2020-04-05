import React, { useState, useEffect, useContext } from "react";
import { Alert, Button } from "reactstrap";
import { Redirect, useLocation } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../UserContext";

const TodosList = () => {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTodos() {
      let data = await fetch("/api/" + location.pathname, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": user.token
        }
      });

      if (data.status === 200) {
        data = await data.json();
        setTodos(data);
        return;
      }

      // Error
      data = await data.json();
      setError(data.error);
    }
    fetchTodos();
  }, []);

  const handleSignOut = () => {
    setUser(null);
    <Redirect to={"/"} />;
  };

  return (
    <div>
      <Button onClick={handleSignOut}>Sign Out</Button>
      {error ? (
        <Alert color="danger">{error}</Alert>
      ) : (
        // Button for add
        // map todos array for completed = 0
        // map todos array for completed = 1
        
        <pre>{JSON.stringify(todos, null, 2)}</pre>
      )}
    </div>
  );
};

export default TodosList;
