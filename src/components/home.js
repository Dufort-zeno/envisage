import logo from '../logo.svg';
import tick from './assets/tick.png'
import './scripts.js';
import '../App.css';
import { Link } from 'react-router-dom';
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="sideflex">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            APPNAME
          </p>
        </div>
        {/* <p>
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
         */}
      <div className="center">
        <div className="done">
            <img src={tick} alt="Done" className="done"/>
            <p>
              You are subscribed to the Warning system, Have a great day!
            </p>
        </div>
        <div className="permissions">
          <p>Heyooo, looks like we're missing a few permissions! </p>
             <button id="location-btn">Location</button>
             <button id="notification-btn" onClick={()=>{console.log("hi")}}>Notification</button>
        </div>
      </div>
      </header>
      
    </div>
    
  );
}

export default App;
