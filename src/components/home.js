import logo from '../logo.svg';
import '../App.css';
import { Link } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Don't Edit <code>src/components/home.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Don't Learn React
        </a>
        <Link to="/about">About us</Link>
      </header>
    </div>
  );
}

export default App;
