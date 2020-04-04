import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './components/Home';
import Page404 from './components/Page404';

function App(){  
  return (
     <Router>
      <div className="site_container">
        <Switch>
          {/* <Route path="/users/:username">
            <ShowData />
          </Route>  */}
          <Route exact path="/">
            <Home />
          </Route> 
          <Route>
            <Page404 />
          </Route>
        </Switch>
      </div>
    </Router>
    )
  
}


ReactDOM.render(<App />, document.getElementById('main'));