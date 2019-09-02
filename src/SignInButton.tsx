import React, { Component} from 'react';
import {Button} from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom'

interface SignUpBtnProps extends RouteComponentProps {

}

interface SignUpBtnState {

}

class SignUpButton extends Component<SignUpBtnProps, SignUpBtnState> {
    constructor(props: SignUpBtnProps) {
        super(props);
    }

    render() {
        return (
            <div id="btn_root">
                <Button onClick={() => { this.props.history.push("/ou_huang/signin" )}}>登录</Button>
            </div>
        )
    }
}

export default withRouter(SignUpButton);