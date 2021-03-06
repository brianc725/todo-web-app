import React, { useState, useEffect, useContext } from "react";
import {
  Alert,
  Button,
  ButtonGroup,
  Collapse,
  InputGroup,
  Input,
  InputGroupAddon
} from "reactstrap";
import { Redirect, useLocation } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../UserContext";
import TodoItem from "./TodoItem";
import "../styles.css";

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
  const [newTodoText, setNewTodoText] = useState("");
  const [editForm, setEditForm] = useState("");

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
      sessionStorage.removeItem("user");
    }
    fetchTodos();
  }, []);

  const handleSignOut = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    <Redirect to={"/"} />;
  };

  const toggleAddMode = () => {
    // If in add mode update add state

    const nextMode = !addingMode;

    if (nextMode) {
      setAddButtonText("Cancel New Todo");
    } else {
      setAddButtonText("Add Todo");
      setNewTodoText("");
    }

    setAddingMode(nextMode);
  };

  const handleAddSubmit = async () => {
    const data = {
      message: newTodoText,
      completed: 0
    };

    let loaded = await fetch("/api/todos/" + user.username + "/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": user.token
      },
      body: JSON.stringify(data)
    });

    const status = await loaded.status;
    const response = await loaded.json();

    toggleAddMode();

    if (status === 200) {
      // update the hook
      setTodos(todos.concat(response));
      return;
    }

    setError(response.error);
  };

  const handleAddChange = e => {
    setNewTodoText(e.target.value);
  };

  const handleEditTodo = item => {
    setModalEdit(!modalEdit);

    if (!modalItem) {
      setModalItem(item);
      setEditForm(item.message);
    } else {
      setEditForm("");
      setModalItem(undefined);
    }
  };

  const handleEditSubmission = async item => {
    setModalEdit(!modalEdit);

    if (!modalItem) {
      setModalItem(item);
    } else {

      const data = {
        message: editForm,
        completed: item.completed
      };

      let loaded = await fetch(
        "/api/todos/" + item.username + "/edit/" + item.id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": user.token
          },
          body: JSON.stringify(data)
        }
      );

      const status = await loaded.status;
      const response = await loaded.json();

      if (status === 200) {
        // update the hook
        setTodos(todos.map(i => (i.id !== item.id ? i : response)));
      } else {
        setError(response.error);
      }

      handleEditTodo();
      setModalItem(undefined);
    }
  };

  const handleEditFormChange = e => {
    setEditForm(e.target.value);
  };

  const handleDeleteTodo = () => {
    setModalDelete(!modalDelete);
  };

  const handleDeleteSubmission = async item => {
    setModalEdit(!modalEdit);
    setModalDelete(!modalDelete);

    if (!modalItem) {
      setModalItem(item);
    } else {
      let loaded = await fetch(
        "/api/todos/" + user.username + "/delete/" + item.id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": user.token
          }
        }
      );

      const status = await loaded.status;
      const response = await loaded.json();

      if (status === 200) {
        // update the hook
        setTodos(todos.filter(i => i.id !== item.id));
      } else {
        setError(response.error);
      }

      setModalItem(undefined);
    }
  };

  const handleToggleCompletion = async item => {
    const nextCompletedStatus = Number(!item.completed);

    const data = {
      message: item.message,
      completed: nextCompletedStatus
    };

    let loaded = await fetch(
      "/api/todos/" + item.username + "/edit/" + item.id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": user.token
        },
        body: JSON.stringify(data)
      }
    );

    const status = await loaded.status;
    const response = await loaded.json();

    if (status === 200) {
      // update the hook
      setTodos(todos.map(i => (i.id !== item.id ? i : response)));
    } else {
      setError(response.error);
    }
  };

  const inProgressTodos = todos.filter(i => i.completed === 0);
  const completedTodos = todos.filter(i => i.completed === 1);

  const generatedTodos =
    todos.length > 0 ? (
      <>
        <p className="header_p">In Progress Todos</p>
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
            editFormText={editForm}
            handleEditFormChange={handleEditFormChange}
            errorMessage={error}
          />
        ))}
        <p className="header_p">Completed Todos</p>
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
            editFormText={editForm}
            handleEditFormChange={handleEditFormChange}
            errorMessage={error}
          />
        ))}
      </>
    ) : (
      <p>There are no todos yet.</p>
    );

  const addTodoForm = (
    <InputGroup>
      <Input onChange={handleAddChange} value={newTodoText} />
      <InputGroupAddon addonType="append">
        <Button onClick={handleAddSubmit}>Submit</Button>
      </InputGroupAddon>
    </InputGroup>
  );

  return (
    <div>
      <Button onClick={handleSignOut} className="btn_todo">Sign Out</Button>
      {error ? (
        <Alert color="danger">{error}</Alert>
      ) : (
        <div>
          <Button onClick={toggleAddMode} className={addingMode ? "btn_todo" : ''}>{addButtonText}</Button>
          <Collapse isOpen={addingMode}>{addTodoForm}</Collapse>
          {generatedTodos}
        </div>
      )}
    </div>
  );
};

export default TodosList;
