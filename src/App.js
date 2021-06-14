import './App.css';
import { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { db } from './firebase_config';
import firebase from 'firebase';
import TodoListItem from './Todo';

function App() {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState('');

  useEffect(() => {
    getTodo();
  }, []);

  const getTodo = () => {
    db.collection('todos').onSnapshot(function (querySnapshot) {
      setTodos(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          todo: doc.data().todo,
          is_in_progress: doc.data().is_in_progress,
        }))
      );
    });
  };

  const addTodo = (e) => {
    e.preventDefault();

    db.collection('todos').add({
      is_in_progress: true,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      todo: todoInput,
    });
    setTodoInput('');
  };

  return (
    <div className="App">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <h1>Brad`s ToDo Application</h1>
        <form>
          <TextField
            id="standard-basic"
            label="Write a task"
            onChange={(e) => setTodoInput(e.target.value)}
            value={todoInput}
            style={{ width: '90vw', maxWidth: '500px' }}
          />
          <Button
            type="submit"
            variant="contained"
            onClick={addTodo}
            style={{ display: 'none' }}
          >
            Default
          </Button>
        </form>
        <div style={{ width: '90vw', maxWidth: '500px', marginTop: '24px' }}>
          {todos.map((todo) => (
            <TodoListItem
              todo={todo.todo}
              is_in_progress={todo.is_in_progress}
              id={todo.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
