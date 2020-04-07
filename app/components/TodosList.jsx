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
  const [modalItem, setModalItem] = useState(undefined);

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

   // array.concat 
    
    if (nextMode) {
      setAddButtonText("Cancel New Todo");
    } else {
      setAddButtonText("Add Todo");
    }

    setAddingMode(nextMode);
  };

  const handleEditTodo = (item) => {
    setModalEdit(!modalEdit);
    
    if (!modalItem) {
      setModalItem(item);
    } else {
      setModalItem(undefined);
    }
  };
  
  const handleEditSubmission = (item) => {
    //backend API call here
    console.log('Editing this todo', item)
    
    setModalEdit(!modalEdit);
    
    if (!modalItem) {
      setModalItem(item);
    } else {
      setModalItem(undefined);
    }
  }
  
  const handleDeleteTodo = () => {
    setModalDelete(!modalDelete);
  }
  
  const handleDeleteSubmission = (item) => {
    // backend API call here
    
    // notes.filter(n => n.id !== id)    
    
    console.log('Deleting this todo', item)
    
    setModalEdit(!modalEdit);
    setModalDelete(!modalDelete);
    
    if (!modalItem) {
      setModalItem(item);
    } else {
      setModalItem(undefined);
    }
  }
  
  const handleToggleCompletion = async (item) => {
    const nextCompletedStatus = Number(!item.completed);
    
    const data = {
      "message": item.message,
      "completed": nextCompletedStatus
    }

    let loaded = await fetch("/api/todos/" + item.username + "/edit/" + item.id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": user.token
      },
      body: JSON.stringify(data)
    });

    const status = await loaded.status;
    const response = await loaded.json();
    
    if (status === 200) {
      // update the hook 
      setTodos(todos.map(i => i.id !== item.id ? i : response));
      return;
    }
    
    setError(response.error);
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
            modalItem={modalItem}
            modalEdit={modalEdit}
            toggleEdit={handleEditTodo}
            toggleEditSubmission={handleEditSubmission}
            modalDeletion={modalDelete}
            toggleModalDeletion={handleDeleteTodo}
            toggleModalDeletionSubmission={handleDeleteSubmission}
            toggleCompletion={handleToggleCompletion}
            errorMessage={error}
          />
        ))}
        <p>Completed Todos</p>
        {completedTodos.map(i => (
          <TodoItem
            key={i.id}
            item={i}
            modalItem={modalItem}
            modalEdit={modalEdit}
            toggleEdit={handleEditTodo}
            toggleEditSubmission={handleEditSubmission}
            modalDeletion={modalDelete}
            toggleModalDeletion={handleDeleteTodo}
            toggleModalDeletionSubmission={handleDeleteSubmission}
            toggleCompletion={handleToggleCompletion}
            errorMessage={error}
          />
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
