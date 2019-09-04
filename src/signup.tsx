import React, {ChangeEvent, Component} from 'react';
import {Button, Form, Input, message} from 'antd';
import 'antd/dist/antd.css';
import './App.css';
import CryptoJs from "crypto-js";
import ReactDOM from 'react-dom';

interface SignUpProps {
    callbackParent: () => void
}

interface SignUpState {
    skey: string,
    sid: string,
    keyAndIDPrepared: boolean,

    username: string,
    password: string,
    confirmPassword: string,

    usernameStatus: "success" | "error",
    passwordStatus: "success" | "error",
    confirmPasswordStatus: "success" | "error",

    usernameHelp: string | null,
    passwordHelp: string | null,
    confirmPasswordHelp: string | null,

    canSubmit: boolean
}
class SignUp extends Component<SignUpProps, SignUpState> {
    constructor(props: SignUpProps) {
        super(props);

        this.state = {
            skey: "",
            sid: "",
            keyAndIDPrepared: false,

            username: "",
            password: "",
            confirmPassword: "",

            confirmPasswordHelp: "请再次输入密码",
            confirmPasswordStatus: "error",
            passwordHelp: "请输入密码",
            passwordStatus: "error",
            usernameHelp: "请输入用户名",
            usernameStatus: "error",

            canSubmit: false,
        };

        this.fetchIdAndKey()
    }

    fetchIdAndKey() {
        fetch('http://47.100.175.77:8081/api/ou_huang_get_key', {
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
        } else if (value.match("^[!:]+$")) {
            this.setState({
                usernameStatus: "error",
                usernameHelp: "用户名不得包含字符':'"
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
            },() => {
                this.validateConfirmPassword(null);
                this.validateSubmitButton();
            });
        } else if (value.length > 16) {
            this.setState({
                passwordStatus: "error",
                passwordHelp: "密码长度不得超过16个字符"
            }, () => {
                this.validateConfirmPassword(null);
                this.validateSubmitButton();
            });
        } else if (!value.match("^[A-z0-9]+$")) {
            this.setState({
                passwordStatus: "error",
                passwordHelp: "密码只能由字母、数字和下划线组成"
            }, () => {
                this.validateConfirmPassword(null);
                this.validateSubmitButton();
            });
        } else {
            this.setState({
                passwordStatus: "success",
                passwordHelp: null
            }, () => {
                this.validateConfirmPassword(null);
                this.validateSubmitButton();
            });
        }
    }

    validateConfirmPassword(e: ChangeEvent<HTMLInputElement> | null) {
        var value = "";
        if (e) {
            this.setState({
                confirmPassword: e.target.value,
            });
            value = e.target.value;
        } else {
            value = this.state.confirmPassword
        }
        const confirmPassword = value;
        if (confirmPassword.length == 0) {
            this.setState({
                confirmPasswordStatus: "error",
                confirmPasswordHelp: "请再次输入密码",
            }, this.validateSubmitButton)
        } else {
            const password = this.state.password;
            if (confirmPassword != password) {
                this.setState({
                    confirmPasswordStatus: "error",
                    confirmPasswordHelp: "与密码不一致",
                }, this.validateSubmitButton)
            } else {
                this.setState({
                    confirmPasswordStatus: "success",
                    confirmPasswordHelp: null,
                }, this.validateSubmitButton)
            }
        }
    }

    validateSubmitButton() {
        this.setState({
            canSubmit: (this.state.usernameStatus == "success") &&
                (this.state.passwordStatus == "success") &&
                (this.state.confirmPasswordStatus == "success") && this.state.keyAndIDPrepared
        })
    }

    encryptPassword(): string {
        const key = CryptoJs.enc.Hex.parse(this.state.skey);
        const iv = CryptoJs.enc.Hex.parse("19990820200011131999082020001113");
        const plaintext = CryptoJs.enc.Utf8.parse(this.state.password);
        const cipher = CryptoJs.AES.encrypt(plaintext, key, {
            iv: iv,
            mode: CryptoJs.mode.CTR,
            padding: CryptoJs.pad.NoPadding,
        });
        return cipher.toString();
    }

    render() {
        return (
            <div id="signupForm">
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
                    <Form.Item
                        label="确认密码"
                        validateStatus={this.state.confirmPasswordStatus}
                        help={this.state.confirmPasswordHelp}>
                        <Input.Password id="confirmPassword" value={this.state.confirmPassword}
                                        onChange={this.validateConfirmPassword.bind(this)}/>
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

        fetch('http://47.100.175.77:8081/api/ou_huang_sign_up', {
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
                if (response.ok) {
                    return response.json();
                }
                throw new Error("网络连接错误");
            })
            .then((data) => {
                const isSuccess = data["Success"] as boolean;
                if (isSuccess) {
                    this.props.callbackParent()
                } else {
                    throw new Error(data["ErrorInfo"] as string);
                }
            })
            .catch(error => {
                this.setState({
                    canSubmit: true,
                });
                message.error(error.message);
            })
    }
}

export default SignUp;