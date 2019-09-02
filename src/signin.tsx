import React, {ChangeEvent, Component} from 'react';
import {Button, Form, Input, Alert} from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import CryptoJs from "crypto-js";
import ReactDOM from 'react-dom';
import {withRouter, RouteComponentProps} from 'react-router-dom'

interface SignInProps extends RouteComponentProps {

}

interface SignInState {
    skey: string,
    sid: string,
    keyAndIDPrepared: boolean,

    username: string,
    password: string,

    usernameStatus: "success" | "error",
    passwordStatus: "success" | "error",

    usernameHelp: string | null,
    passwordHelp: string | null,

    canSubmit: boolean
}

class SignIn extends Component<SignInProps, SignInState> {
    constructor(props: SignInProps) {
        super(props);

        this.state = {
            skey: "",
            sid: "",
            keyAndIDPrepared: false,

            username: "",
            password: "",

            passwordHelp: "请输入密码",
            passwordStatus: "error",
            usernameHelp: "请输入用户名",
            usernameStatus: "error",

            canSubmit: false,
        };

        this.fetchIdAndKey()
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
                    keyAndIDPrepared: true,
                    sid: data["Sid"] as string,
                    skey: data["Key"] as string,
                });
                this.validateSubmitButton()
            });
        console.log("fetch once");
    }

    validateUsername(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            username: e.target.value,
        });
        const value = e.target.value;
        if (value.length == 0) {
            this.setState({
                usernameStatus: "error",
                usernameHelp: "请输入用户名"
            }, this.validateSubmitButton);
        } else if (value.length > 16) {
            this.setState({
                usernameStatus: "error",
                usernameHelp: "用户名长度不得超过16个字符"
            }, this.validateSubmitButton);
        } else {
            this.setState({
                usernameStatus: "success",
                usernameHelp: null
            }, this.validateSubmitButton);
        }
    };

    validatePassword(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            password: e.target.value,
        });
        const value = e.target.value;
        if (value.length == 0) {
            this.setState({
                passwordStatus: "error",
                passwordHelp: "请输入密码"
            }, () => {
                this.validateSubmitButton();
            });
        } else if (value.length > 16) {
            this.setState({
                passwordStatus: "error",
                passwordHelp: "密码长度不得超过16个字符"
            }, () => {
                this.validateSubmitButton();
            });
        } else {
            this.setState({
                passwordStatus: "success",
                passwordHelp: null
            }, () => {
                this.validateSubmitButton();
            });
        }
    }

    validateSubmitButton() {
        this.setState({
            canSubmit: (this.state.usernameStatus == "success") &&
                (this.state.passwordStatus == "success") &&
                this.state.keyAndIDPrepared
        })
    }

    encryptPassword(): string {
        const key = CryptoJs.enc.Hex.parse(this.state.skey);
        const iv = CryptoJs.enc.Hex.parse("19990820200011131999082020001113");
        const plaintext = CryptoJs.enc.Utf8.parse(this.state.password);
        const hashedText = CryptoJs.SHA256(plaintext).toString();
        const hashedWords = CryptoJs.enc.Hex.parse(hashedText);
        const cipher = CryptoJs.AES.encrypt(hashedWords, key, {
            iv: iv,
            mode: CryptoJs.mode.CTR,
            padding: CryptoJs.pad.NoPadding,
        });
        return cipher.toString();
    }

    render() {
        return (
            <div id="signinForm">
                <Form>
                    <Form.Item
                        label="用户名"
                        validateStatus={this.state.usernameStatus}
                        help={this.state.usernameHelp}>
                        <Input id="username" value={this.state.username}
                               onChange={this.validateUsername.bind(this)}/>
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        validateStatus={this.state.passwordStatus}
                        help={this.state.passwordHelp}>
                        <Input.Password id="password" value={this.state.password}
                                        onChange={this.validatePassword.bind(this)}/>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            disabled={!this.state.canSubmit}
                            onClick={this.handleSubmit.bind(this)}>
                            确认
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

    handleSubmit() {
        this.setState({
            canSubmit: false,
        });

        const data = {Sid: this.state.sid, Username: this.state.username, Password: this.encryptPassword()};

        fetch('http://47.100.175.77:8081/ou_huang_sign_in', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'text/plain',
                'Accept': 'text/plain',
            },
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(data),
        })
            .then(response => {
                console.log(response);
                if (response.ok) {
                    return response.json();
                }
                throw new Error("网络连接错误");
            })
            .then((data) => {
                const isSuccess = data["Success"] as boolean;
                if (isSuccess) {
                    this.props.history.push("/ou_huang");
                } else {
                    throw new Error(data["ErrorInfo"] as string);
                }
            })
            .catch(error => {
                this.setState({
                    canSubmit: true,
                });
                ReactDOM.render(<Alert type="error" message={error.message}/>, document.getElementById("signinForm"));
            })
    }
}

export default withRouter(SignIn);