import React, { useState, useEffect } from 'react';
import styled from 'styled-components'
import {
  Link
} from "react-router-dom";

const Title = styled.h1`
  color: darkmagenta;
`;

const HelloWorld = function() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    async function fetchData(){
      let data = await fetch('/api/users');
      data = await data.json();
      setData(data);
    }
    
    fetchData();
    
  }, []);

    
  return (
    <div>
      <Title>Hello Full-Stack JS App!</Title>

      <p>This is a Glitch starter for a Javascript fullstack web app, based on the starter app for React.</p>
      <p>
        On the backend it uses Express, using a different
        Router for server (<pre style={{display: 'inline'}}>/api/</pre>) and client routes,
        and sqlite3 as a data store.
        It compiles the front-end React app with webpack-dev-middleware with  
        babel included for transpiling JS and JSX. 
      </p>
      <p>
        Client side routing is also implemented, follow the links 
        for <Link to={'/1'}>task 1</Link> or <Link to={'/2'}>task 2</Link> to 
        see it in action. For styling, both CSS and styled-components are supported.
      </p>
      
      <label>Some data from the server below:</label>
      <pre>{ JSON.stringify(data, null, 2) }</pre>
    </div>
  );
};

export default HelloWorld;