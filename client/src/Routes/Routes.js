// src/Routes/Routes.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MyURLs from './MyURLs';

function Routes() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Fetch todos from the server
    const fetchTodos = async () => {
      const res = await axios.get('/api/todos');
      setTodos(res.data);
    };
    fetchTodos();
  }, []);

  return (
    <Router>
      <Switch>
        {MyURLs.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact
            render={(props) => (
              <route.view {...props} todos={todos} setTodos={setTodos} />
            )}
          />
        ))}
      </Switch>
    </Router>
  );
}

export default Routes;