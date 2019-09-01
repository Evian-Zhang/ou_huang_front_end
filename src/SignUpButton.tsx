import React, {ChangeEvent, Component} from 'react';
import {Button, Form, Input, Alert} from 'antd';
import SignUp from "./signup";
import ReactDOM from 'react-dom'

interface SignUpBtnProps {

}

interface SignUpBtnState {
    sid: string
    key: string
    hasPressed: boolean
}

class SignUpButton extends Component<SignUpBtnProps, SignUpBtnState> {
    constructor(props: SignUpBtnProps) {
        super(props);

        this.state = {
            sid: "",
            key: "",
            hasPressed: false,
        }
    }

    fetchIdAndKey() {
        fetch('http://47.100.175.77:8081/ou_huang_get_key', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            cache: 'default'
        })
            .then(res => res.json())
            .then((data) => {
                this.setState({
                    sid: data["Sid"] as string,
                    key: data["Key"] as string,
                });
                ReactDOM.render(<SignUp sid={data["Sid"]} skey={data["Key"]}/>, document.getElementById('btn_root'));
            });
        console.log("fetch once");
    }

    handleClick() {
        this.setState({
            hasPressed: true,
        });
        this.fetchIdAndKey();
    }

    render() {
        return (
            <div id="btn_root">
                <Button onClick={this.handleClick.bind(this)} disabled={this.state.hasPressed}>zs</Button>
            </div>
        )
    }
}

export default SignUpButton;