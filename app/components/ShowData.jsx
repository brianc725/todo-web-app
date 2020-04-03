import React, { useState, useEffect } from 'react';
import {
  useParams,
  Link
} from "react-router-dom";

const ShowData = function() {
  const [data, setData] = useState([]);
  const { username}  = useParams();
  
  useEffect(() => {
    async function fetchData(){
      let data = await fetch(`/api/users/${username}`);
      data = await data.json();
      setData(data);
    }
    
    fetchData();
    
  }, [username]);

    
  return (
    <div>
      <h1>Showing record {username}</h1>   
      <pre>{ JSON.stringify(data, null, 2) }</pre>
      <Link to={'/'}>Back</Link>
    </div>
  );
};

export default ShowData;