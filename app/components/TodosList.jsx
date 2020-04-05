import React, { useState, useEffect, useContext } from "react";
import { Alert, Button, ButtonGroup } from "reactstrap";
import { Redirect, useLocation } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../UserContext";
import TodoItem from "./TodoItem";

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

  const handleAddTodo = () => {
    console.log("add");
  };

  const inProgressTodos = todos.filter(i => i.completed === 0);
  const completedTodos = todos.filter(i => i.completed === 1);

  const generatedTodos =
    todos.length > 0 ? (
      <>
        <p>In Progress Todos</p>
        {inProgressTodos.map(i => (
          <TodoItem key={i.id} id={i.id} message={i.message} />
        ))}
        <p>Completed Todos</p>
        {completedTodos.map(i => (
          <TodoItem key={i.id} id={i.id} message={i.message} />
        ))}
      </>
    ) : (
      <p>There are no todos yet.</p>
    );

  return (
    <div>
        <Button onClick={handleSignOut}>Sign Out</Button>
        {error ? (
          <Alert color="danger">{error}</Alert>
        ) : (
          <>
            <Button onClick={handleAddTodo}>Add Todo</Button>
            {generatedTodos}
          </>
        )}
    </div>
  );
};

export default TodosList;
