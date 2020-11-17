import React from 'react'; 
import logo from '../logo.svg';
import tick from './assets/tick.png'
// import {updatePermission} from './scripts.js';
import '../App.css';
import { Link } from 'react-router-dom';

function Done(){
  return(
    <div className="done">
             <img src={tick} alt="Done" className="done"/>
             <p>
               You are subscribed to the Warning system, Have a great day!
             </p>
    </div>
  )
}

function Failed(){
  return(
    <p>
      FAILED!
    </p>


  )
}

class Permissions extends React.Component{
  constructor(props){
    super(props);
    console.log(props)
  }
  notificationHandler(){
    Notification.requestPermission();
  }
  locationHandler(){
    navigator.geolocation.getCurrentPosition((location)=>{
      localStorage.setItem('location', JSON.stringify(location));
      this.props.update();

    })
  }

  render(){
    let getColor = (result,yellow=false)=>{
      console.log(result)
      if(result.state === "granted")
        return "green";
      else if(result.state === "denied")
        return "red";
      else if(yellow)
        return "yellow";
      else
        return null;
    }


    return(
      <div className="permissions">
          <p>Heyooo, looks like we're missing a few permissions! </p>
            <button id="location-btn" onClick={this.locationHandler.bind(this)} style={{backgroundColor: getColor(this.props.result[0],localStorage.getItem('location'))}}>Location</button>
            <button id="notification-btn" onClick={this.notificationHandler.bind(this)} style={{backgroundColor: getColor(this.props.result[1])}}>Notification</button>
        </div>
    )
  }
}
class Subscribed extends React.Component{
  constructor(props){
   super(props)
   this.state = {
      data: null
   }
  }
  
  render(){
    if(this.state.data){
      return(this.state.data);
    }else{
      return(null);
    }
  } 
  async register(){
    console.log("hello2");
    function urlB64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
    if((await navigator.serviceWorker.getRegistrations()).length > 0){
      let serviceWorkerRegistration = await navigator.serviceWorker.ready;
      var options = {
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(
        "BBg54OqIKc5uCgJFlcDQZQowmem6L1B_wlp7790yOUxHinFEIgV0hh68u_aFLjIKKzACXBbNla_iZP-CtxEA7_I"
      )
      };
      console.log("hello");
      let pushSubscription = await serviceWorkerRegistration.pushManager.subscribe(options);
      //TODO: REGISTER WITH SERVER
      console.log(
        JSON.stringify({
          ...pushSubscription,
          location:JSON.parse(localStorage.getItem('location'))
        })
      );
      localStorage.setItem('registered','success')
      this.updatePermission();
  }else{
    localStorage.setItem('registered','failed')
    this.updatePermission();
  }
}
  updatePermission(){
    Promise.all([navigator.permissions.query({name:'geolocation'}),
    navigator.permissions.query({name:'push'}),navigator.permissions.query({name:'notifications'})])
    .then(function(result) {
      const forceUpdate = function(){
        if(this._ismounted)
          this.updatePermission();
      }.bind(this)

      result[0].onchange = result[1].onchange = result[2].onchange = forceUpdate;
      if((result[0].state === 'granted' || localStorage.getItem('location')) && result[1].state === 'granted'){
        if(localStorage.getItem('registered')==="success")
          this.setState({data:<Done />});
        else if(localStorage.getItem('registered')==="failed"){
          //TODO: Handle Fail and retry
          this.setState({data:<Failed/>});
        }
        else{
          this.setState({data:null});
          this.register()
        }
      }else{
        this.setState({data:<Permissions result={result} update={forceUpdate}/>})
      }
    
    }.bind(this))
  }
  componentDidMount(){
    this._ismounted = true;
    this.updatePermission();
  }
  componentWillUnmount(){
    this._ismounted = false;
  }

}


class App extends React.Component {
  render(){
    return (
        <div className="App">
          <header className="App-header">
            <div className="sideflex">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                APPNAME
              </p>
            </div>
            
          <div className="center">
           <Subscribed key="0"/>
          </div>
          </header>
          
        </div>
        
      );
          }
    componentDidMount(){
      // updatePermission()
    }
}

export default App;
