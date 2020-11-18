import React from 'react'; 
import logo from '../logo.svg';
import tick from './assets/tick.png'
import cross from './assets/cross.png'
import loading from './assets/loading.svg'

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
function Fail(props){
  return(
    <div className="done">
             <img src={cross} alt="Done" className="done"/>
             <p>
               There was some error while regisetering you, Please try again later.
             </p>
             <button onClick={props.retry}>Retry!</button>
    </div>
  )
}

function Loading(){
  return(
    <div className="done">
             <img src={loading} alt="Done" className="done"/>
             <p>
               Processing your request!
             </p>
    </div>
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
      localStorage.setItem('location', JSON.stringify({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }));
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
      data: <Loading/>
   }
   this.registerActive = false;
  }
  
  render(){
    if(this.state.data){
      return(this.state.data);
    }else{
      return(<Loading/>);
    }
  } 
  async register(){
    this.setState({data:<Loading/>});
    if(this.registerActive){
      return;
    }
    this.registerActive = true;
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
      let pushSubscription = await serviceWorkerRegistration.pushManager.subscribe(options);
      //navigator.geolocation.getCurrentPosition(
      
      try{
        let location = localStorage.getItem('location');
        if(!location){
          location = await new Promise((resolve,reject) => navigator.geolocation.getCurrentPosition(resolve,reject));
        }
        let data = {
            ...pushSubscription.toJSON(), //Misleading, actually converts to JS object
            location:JSON.parse()
          }
        console.log(
          data
        );
        const response = await fetch("https://api.anu.ninja/register", {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        if((await response.json()).success){
          localStorage.setItem('registered','success')
          this.updatePermission();
        }else{
          throw new Error("Internal Server Error!");
        }
        
      }catch(e){
        localStorage.setItem('registered','failed')
        this.updatePermission();
      }
      
  }else{
    localStorage.setItem('registered','failed')
    this.updatePermission();
  }
   this.registerActive = false;
}
  updatePermission(){
    Promise.all([navigator.permissions.query({name:'geolocation'}),
    navigator.permissions.query({name:'push',userVisibleOnly:true}),navigator.permissions.query({name:'notifications'})])
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
          this.setState({data:<Fail retry={this.register.bind(this)}/>});
        }
        else{
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
