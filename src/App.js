import React, { useState } from 'react';
import {
  RecoilRoot, 
  atom,
  selector,
  useRecoilState,
  useSetRecoilState, 
  useRecoilValue,
} from 'recoil';
import './App.css';


const usernameState = atom({
  key: 'username',
  default: ''
})

const todoListState = atom({
  key: 'todoListState',
  default: [],
})

const countState = selector({
  key: 'count',
  get: ({get}) => {
    const username = get(usernameState);
    return username.length;
  }
})


function App() {

  

  return (
    <RecoilRoot>
      <TodoList />
      <Body />
   </RecoilRoot>
  );
}

function Nav() {
  const username = useRecoilValue(usernameState);

  return (
    <div className="nav">
   <p>{username}</p>
    </div>
  );
}

function Body() {
  return (
    <div className="body">
   <Profile />
   <Count />
    </div>
  );
}

function Profile() {
  const [ username, setUsername ] = useRecoilState(usernameState);
  return (
    <div className="App">
   <h2>Profile:</h2>
   <p>{username}</p>
   <input type='text' value={username} onChange={event => setUsername(event.target.value)}/>
    </div>
  );
}

function Count() {
  const count = useRecoilValue(countState);
  //let windowThing =  window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  //console.log("windowThing: ", windowThing);
  return (
    <div className="count">
   <p> Count: {count} </p>
    </div>
  );
}

function TodoList () {
  const todoList = useRecoilValue(todoListState);
  const username = useRecoilValue(usernameState);
  return (
    <>
      <h3>Hello, {username}! These are your TODOs</h3>
    {/* <TodoListStats /> */}
      {/* <TodoListFilters /> */}
      <TodoItemCreator />

      {todoList.map((todoItem) => (
        <TodoItem key={todoItem.id} item={todoItem} />
      ))}
    </>
  );
}

function TodoItemCreator () {
  const [inputValue, setInputValue] = useState('');
  const setToDoList = useSetRecoilState(todoListState);
  const count = useRecoilValue(countState);
  let recoilDebug =  window.$recoilDebugStates;
  console.log("recoildebugstate: ", recoilDebug);
  for(let i = 0; i < recoilDebug.length; i++) {
    console.log("atomVals: ", recoilDebug[i].atomValues)
  }
  let windowThing =  window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  console.log("windowThing: ", windowThing);


  
  
  const addItem = () => {
    setToDoList((oldTodoList) => [
      ...oldTodoList,
      {
        id: getId(),
        text: inputValue,
        isComplete: false,
      },
    ]);
    setInputValue('');
  }

  const onChange = ({target: {value}}) => {
    setInputValue(value);
  }

  return (
    <div>
      <input type='text' value={inputValue} onChange={onChange} />
      <button onClick={addItem}>Add</button>
    </div>
  )
}

let id = 0;
function getId () {
  return id++;
}

function TodoItem({item}) {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const index = todoList.findIndex((listItem) => listItem === item);

  const editItemText = ({target: {value}}) => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      text: value,
    });

    setTodoList(newList);
  };

  const toggleItemCompletion = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete,
    });

    setTodoList(newList);
  };

  const deleteItem = () => {
    const newList = removeItemAtIndex(todoList, index);

    setTodoList(newList);
  };

  return (
    <div>
      <input type="text" value={item.text} onChange={editItemText} />
      <input
        type="checkbox"
        checked={item.isComplete}
        onChange={toggleItemCompletion}
      />
      <button onClick={deleteItem}>X</button>
    </div>
  );
}

function replaceItemAtIndex(arr, index, newValue) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

function removeItemAtIndex(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export default App;
