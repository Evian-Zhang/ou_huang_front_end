import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import CardDrawer from './CardDrawer'
import * as serviceWorker from './serviceWorker';
import SignUp from "./signup";
import SignUpButton from "./SignUpButton"

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<SignUpButton />, document.getElementById("root"));
// ReactDOM.render(<div><input type="button" onClick={handleClick}>zs</input></div>)
// ReactDOM.render(<SignUpForm/>, document.getElementById('root'));
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
