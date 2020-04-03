import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import './styles.css';

/* Import Components */
import HelloWorld from './components/HelloWorld';
import ShowData from './components/ShowData';

function App(){
  return (
     <Router>
      <div>
        <Switch>
          <Route path="/users/:username">
            <ShowData />
          </Route>  
          <Route path="/">
            <HelloWorld />
          </Route>            
        </Switch>
      </div>
    </Router>
    )
  
}


ReactDOM.render(<App />, document.getElementById('main'));