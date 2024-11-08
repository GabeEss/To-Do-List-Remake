import {useState, useEffect} from 'react';
import ToDoBoardDisplay from "./components/todo-board-display";

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const fetch = localStorage.getItem('darkMode');
    // console.log("Initial fetch from local storage:", fetch);
    return fetch ? JSON.parse(fetch) : false;
  });

  useEffect(() => {
      localStorage.setItem("darkMode", JSON.stringify(darkMode)); 
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'bg-dark text-light todo-board' : 'bg-light text-dark todo-board'}>
      <button className="btn btn-primary mb-3 toggle-button" onClick={toggleDarkMode}>
        Toggle {darkMode ? 'Light' : 'Dark'} Mode
      </button>
      <ToDoBoardDisplay/>
    </div>
  )
}

export default App;
