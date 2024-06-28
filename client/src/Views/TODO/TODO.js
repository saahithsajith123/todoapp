import { useEffect, useState } from 'react';
import { dummy } from './dummy';
import axios from 'axios';

export function TODO(props) {
    const [newTodo, setNewTodo] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [todoData, setTodoData] = useState(dummy);
    const [loading, setLoading] = useState(true);
    const [editingTodo, setEditingTodo] = useState(null);
    const [editedTodo, setEditedTodo] = useState('');
    const [editedDescription, setEditedDescription] = useState('');

    useEffect(() => {
        const fetchTodo = async () => {
            const apiData = await getTodo();
            setTodoData(apiData);
            setLoading(false);
        };
        fetchTodo();
    }, []);

    const getTodo = async () => {
        const options = {
            method: "GET",
            url: `http://localhost:8000/api/todo`,
            headers: {
                accept: "application/json",
            }
        };
        try {
            const response = await axios.request(options);
            return response.data;
        } catch (err) {
            console.log(err);
            return []; // return an empty array in case of error
        }
    };

    const addTodo = () => {
        const options = {
            method: "POST",
            url: `http://localhost:8000/api/todo`,
            headers: {
                accept: "application/json",
            },
            data: {
                title: newTodo,
                description: newDescription
            }
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => [...prevData, response.data.newTodo]);
                setNewTodo('');
                setNewDescription('');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const deleteTodo = (id) => {
        const options = {
            method: "DELETE",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            }
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => prevData.filter(todo => todo._id !== id));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const updateTodo = (id) => {
        const todoToUpdate = todoData.find(todo => todo._id === id);
        const options = {
            method: "PATCH",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            },
            data: {
                ...todoToUpdate,
                done: !todoToUpdate.done
            }
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => prevData.map(todo => todo._id === id ? response.data : todo));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const editTodo = (id) => {
        const options = {
            method: "PATCH",
            url: `http://localhost:8000/api/todo/${id}`,
            headers: {
                accept: "application/json",
            },
            data: {
                title: editedTodo,
                description: editedDescription
            }
        };
        axios
            .request(options)
            .then(function (response) {
                console.log(response.data);
                setTodoData(prevData => prevData.map(todo => todo._id === id ? response.data : todo));
                setEditingTodo(null);
                setEditedTodo('');
                setEditedDescription('');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '10px' }}>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h1>Tasks</h1>
                <input
                    style={{ marginRight: '10px', padding: '10px', borderRadius: '5px', width: '200px' }}
                    type='text'
                    name='New Todo'
                    placeholder='New Todo Task'
                    value={newTodo}
                    onChange={(event) => setNewTodo(event.target.value)}
                />
                <input
                    style={{ marginRight: '10px', padding: '10px', borderRadius: '5px', width: '200px' }}
                    type='text'
                    name='New Description'
                    placeholder='Description'
                    value={newDescription}
                    onChange={(event) => setNewDescription(event.target.value)}
                />
                <button
                    style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#28a745', color: 'white' }}
                    onClick={addTodo}
                >
                    + New Todo
                </button>
            </div>
            <div>
                {loading ? (
                    <p style={{ color: 'black' }}>Loading...</p>
                ) : (
                    todoData.length > 0 ? (
                        todoData.map((entry, index) => (
                            <div key={entry._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', margin: '10px 0', backgroundColor: '#ffffff', borderRadius: '5px', border: '1px solid #ddd' }}>
                                {editingTodo === entry._id ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', width: '70%' }}>
                                        <input
                                            type='text'
                                            value={editedTodo}
                                            onChange={(event) => setEditedTodo(event.target.value)}
                                            style={{ padding: '10px', fontSize: '1.2em', marginBottom: '5px', width: '100%' }}
                                        />
                                        <input
                                            type='text'
                                            value={editedDescription}
                                            onChange={(event) => setEditedDescription(event.target.value)}
                                            style={{ padding: '10px', fontSize: '1em', width: '100%' }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                                            <button onClick={() => editTodo(entry._id)} style={{ marginRight: '10px', padding: '5px 10px', borderRadius: '5px', backgroundColor: '#007bff', color: 'white' }}>Save</button>
                                            <button onClick={() => setEditingTodo(null)} style={{ padding: '5px 10px', borderRadius: '5px', backgroundColor: '#6c757d', color: 'white' }}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <input
                                            type='checkbox'
                                            checked={entry.done}
                                            onChange={() => updateTodo(entry._id)}
                                            style={{ marginRight: '10px', width: '20px', height: '20px' }}
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{entry.title}</div>
                                            <div style={{ fontSize: '1em', color: '#555', marginTop: '5px' }}>{entry.description}</div>
                                        </div>
                                    </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ cursor: 'pointer', color: '#007bff', marginBottom: '5px' }} onClick={() => {
                                        setEditingTodo(entry._id);
                                        setEditedTodo(entry.title);
                                        setEditedDescription(entry.description);
                                    }}>
                                        Edit
                                    </span>
                                    <span style={{ cursor: 'pointer', color: '#dc3545' }} onClick={() => deleteTodo(entry._id)}>
                                        Delete
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'black' }}>No tasks available. Please add a new task.</p>
                    )
                )}
            </div>
        </div>
    );
}
