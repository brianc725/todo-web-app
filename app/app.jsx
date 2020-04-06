import React, { useState, useMemo } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { UserContext } from "./UserContext";
import PrivateRoute from "./components/PrivateRoute.jsx";

import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./components/Home";
import Page404 from "./components/Page404";
import TodosList from "./components/TodosList";

function App() {
  // React Context tutorial from https://www.youtube.com/watch?v=lhMKvyLRWo0
  const [user, setUser] = useState(
    sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : null
  );
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <Router>
      <div className="site_container">
        <UserContext.Provider value={value}>
          <Switch>
            <PrivateRoute path="/todos/:username">
              <TodosList />
            </PrivateRoute>
            <Route exact path="/">
              {user ? <Redirect to={"/todos/" + user.username} /> : <Home />}
            </Route>
            <Route>
              <Page404 />
            </Route>
          </Switch>
        </UserContext.Provider>
      </div>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("main"));
