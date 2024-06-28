// client/src/components/TodoList.js

import React, { useState } from 'react';
import axios from 'axios';

function TodoList({ todos, setTodos }) {
  const [editTodo, setEditTodo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleEditClick = (todo) => {
    setEditTodo(todo);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.patch(`/api/todos/${editTodo._id}`, {
      title: editTitle,
      description: editDescription,
    });
    setTodos(todos.map(todo => todo._id === editTodo._id ? res.data : todo));
    setEditTodo(null);
  };

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {todos.map(todo => (
          <li key={todo._id}>
            <h2>{todo.title}</h2>
            <p>{todo.description}</p>
            <button onClick={() => handleEditClick(todo)}>Edit</button>
          </li>
        ))}
      </ul>

      {editTodo && (
        <form onSubmit={handleEditSubmit}>
          <h2>Edit Todo</h2>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
}

export default TodoList;
