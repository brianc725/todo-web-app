import React, { useState, useEffect, useContext } from "react";
import { Alert, Button, ButtonGroup, Collapse } from "reactstrap";
import { Redirect, useLocation } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../UserContext";
import TodoItem from "./TodoItem";

const TodosList = () => {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [addingMode, setAddingMode] = useState(false);
  const [addButtonText, setAddButtonText] = useState("Add Todo");
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

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
      sessionStorage.removeItem('user');
    }
    fetchTodos();
  }, []);

  const handleSignOut = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    <Redirect to={"/"} />;
  };

  const handleAddTodo = () => {
    // If in add mode update add state
    // generate a new TodoItem with edit mode on already
    const nextMode = !addingMode;

    if (nextMode) {
      setAddButtonText("Cancel New Todo");
    } else {
      setAddButtonText("Add Todo");
    }

    setAddingMode(nextMode);
  };

  const handleEditTodo = () => {
    console.log('Cancelling edit')
    
    setModalEdit(!modalEdit);
  };
  
  const handleEditSubmission = () => {
    //backend API call here
    console.log('Editing this todo')
    
    setModalEdit(!modalEdit);
  }
  
  const handleDeleteTodo = () => {
    console.log('Cancelling deleition')
    
    setModalDelete(!modalDelete);
  }
  
  const handleDeleteSubmission = () => {
    // backend API call here
    
    console.log('Deleting this todo')
    
    setModalEdit(!modalEdit);
    setModalDelete(!modalDelete);
  }

  const inProgressTodos = todos.filter(i => i.completed === 0);
  const completedTodos = todos.filter(i => i.completed === 1);

  const generatedTodos =
    todos.length > 0 ? (
      <>
        <p>In Progress Todos</p>
        {inProgressTodos.map(i => (
          <TodoItem
            key={i.id}
            item={i}
            modalEdit={modalEdit}
            toggleEdit={handleEditTodo}
            toggleEditSubmission={handleEditSubmission}
            modalDeletion={modalDelete}
            toggleModalDeletion={handleDeleteTodo}
            toggleModalDeletionSubmission={handleDeleteSubmission}
            errorMessage={error}
          />
        ))}
        <p>Completed Todos</p>
        {completedTodos.map(i => (
          <TodoItem key={i.id} item={i} handleEdit={handleEditTodo} />
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
          <Button onClick={handleAddTodo}>{addButtonText}</Button>
          <Collapse isOpen={addingMode}>
            <p>Form for input adding here</p>
          </Collapse>
          {generatedTodos}
        </>
      )}
    </div>
  );
};

export default TodosList;
