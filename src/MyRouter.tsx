import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import SignUp from "./signup";
import SignUpButton from "./SignUpButton";
import SignIn from "./signin";
import SignInButton from "./SignInButton";

interface MyRouterProps {

}

interface MyRouterState {

}

export default class MyRouter extends Component<MyRouterProps, MyRouterState> {
    constructor(props: MyRouterProps) {
        super(props)


    }

    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/ou_huang" component={SignInButton}/>
                    <Route path="/ou_huang/signup" component={SignUp} />
                    <Route path="/ou_huang/signin" component={SignIn} />
                </div>
            </Router>
        )
    }
}
