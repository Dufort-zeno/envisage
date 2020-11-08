import React from 'react';
import { Link } from 'react-router-dom';

class About extends React.Component {
    render(){
        return (
        <div>
            <h1>nobody cares about this page, I just added to check react router.</h1>
            <Link to="/">Imagine this is a fancy back button</Link>
        </div>
        );
    }
    componentDidMount(){
        console.log("HELLO!")
    }
    componentWillUnmount(){
        console.log("Bye!")
    }
}
 
export default About;
