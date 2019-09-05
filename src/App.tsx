import React, {Component, ReactNode} from 'react';
import './App.css';
import {Button, Col, Layout, Menu, message, Row, Statistic, Typography} from 'antd'
import ReactDOM from 'react-dom';
import SignUp from "./signup"
import SignIn from "./signin"

const {Header, Content} = Layout;

interface AppProps {

}

interface AppState {
    selectedKeys: string[]
    isLoggedIn: boolean
    accountMenuTitle: string
    accountMenuSubMenu: Array<ReactNode>
    username: string
    hashedPass: string
    uid: number
    cookie: string
    canSignOut: boolean
    canRegister: boolean
    canDraw: boolean
    draws: number
    oneNumber: number
    twoNumber: number
    threeNumber: number
    fourNumber: number
    fiveNumber: number
    fivePer: number
}

class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);

        this.state = {
            selectedKeys: ["MainPage"],
            isLoggedIn: false,
            accountMenuTitle: "登录/注册",
            accountMenuSubMenu: [<Menu.Item key="SignIn" onClick={this.goToSignIn.bind(this)}>登录</Menu.Item>,
                <Menu.Item key="SignUp" onClick={this.goToSignUp.bind(this)}>注册</Menu.Item>],
            username: "",
            hashedPass: "",
            uid: 0,
            cookie: "",
            canSignOut: true,
            canRegister: true,
            draws: 0,
            canDraw: true,
            oneNumber: 0,
            twoNumber: 0,
            threeNumber: 0,
            fourNumber: 0,
            fiveNumber: 0,
            fivePer: 0.0
        };
    }

  nameOfCard(card: number) {
    switch (card) {
      case 1: {
        return "一星"
      }
      case 2: {
        return "二星"
      }
      case 3:{
        return "三星"
      }
      case 4:{
        return "四星"
      }
      case 5:{
        return "五星"
      }
      default: {
        return ""
      }
    }
  }

    loggedInAction() {
        this.setState({
            isLoggedIn: true,
            accountMenuTitle: "账号/登出",
            accountMenuSubMenu: [<Menu.Item key="AccountInfo">您好{this.state.username}</Menu.Item>,
                <Menu.Item key="Register" onClick={this.handleRegister.bind(this)}
                           disabled={!this.state.canRegister}>签到</Menu.Item>,
                <Menu.Item key="SignOut" onClick={this.goToSignOut.bind(this)}
                           disabled={!this.state.canSignOut}>登出</Menu.Item>]
        });

    }

    handleRegister() {
        const data = {
            Uid: this.state.uid,
            Username: this.state.username,
            Password: this.state.hashedPass,
            Cookie: this.state.cookie
        };
        this.setState({
            canRegister: false
        });
        fetch('http://47.100.175.77:8081/api/ou_huang_register', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers': '*',
                'Content-Type': 'text/plain',
                'Accept': '*',
            },
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(data),
            credentials: 'include',

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
                    this.setState({
                        cookie: data["NewCookie"] as string,
                        canRegister: true,
                        draws: data["Remain"] as number,
                    });
                    const registerSuccess = data["RegisterSuccess"] as boolean;
                    if (registerSuccess) {
                        message.success("签到成功")
                    } else {
                        message.error("您已签到")
                    }
                    this.goToMainPage();
                } else {
                    throw new Error(data["ErrorInfo"] as string);
                }
            })
            .catch(error => {
                this.setState({
                    canRegister: true
                });
                message.error(error.message);
            });
    }

    goToMainPage() {
        this.setState({
            selectedKeys: ["MainPage"]
        });
        ReactDOM.render(
            <Row type="flex" justify="center" align="top">
              <Col span={6}>
                <div id="card_drawer_left">
                  <ul id="star_list">
                    <li>
                      <Statistic title="五星数" value={this.state.fiveNumber}/>
                    </li>
                    <li>
                      <Statistic title="四星数" value={this.state.fourNumber}/>
                    </li>
                    <li>
                      <Statistic title="三星数" value={this.state.threeNumber}/>
                    </li>
                    <li>
                      <Statistic title="二星数" value={this.state.twoNumber}/>
                    </li>
                    <li>
                      <Statistic title="一星数" value={this.state.oneNumber}/>
                    </li>
                    <li>
                      <Statistic title="五星率" value={this.state.fivePer}/>
                    </li>
                  </ul>
                </div>
              </Col>
              <Col span={12}>
                <div id="card_drawer_body">
                  <Button type="primary" size="large" onClick={this.onDrawCard.bind(this)} disabled={!this.state.canDraw}>
                    抽卡
                  </Button>
                  <div id="draw_result"></div>
                </div>
              </Col>
              <Col span={6}>
                <div id="card_drawer_right">
                  <Statistic title="您的剩余抽卡次数" value={this.state.draws}/>
                </div>
              </Col>
            </Row>,
            document.getElementById("content"))
    }

    goToSignIn() {
        this.setState({
            selectedKeys: ["SignIn"]
        });
        ReactDOM.render(<SignIn callbackParent={this.onSignInCallback.bind(this)}/>, document.getElementById("content"))
    }

    goToSignUp() {
        this.setState({
            selectedKeys: ["SignUp"]
        });
        ReactDOM.render(<SignUp callbackParent={this.onSignUpCallback.bind(this)}/>, document.getElementById("content"))
    }

    goToSignOut() {
        this.setState({
            canSignOut: false
        });
        const data = {
            Uid: this.state.uid,
            Username: this.state.username,
            Password: this.state.hashedPass,
            Cookie: this.state.cookie
        };
        fetch('http://47.100.175.77:8081/api/ou_huang_sign_out', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Expose-Headers': '*',
                'Content-Type': 'text/plain',
                'Accept': '*',
            },
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(data),
            credentials: 'include',

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
                    this.setState({
                        isLoggedIn: false,
                        accountMenuTitle: "登录/注册",
                        accountMenuSubMenu: [<Menu.Item key="SignIn"
                                                        onClick={this.goToSignIn.bind(this)}>登录</Menu.Item>,
                            <Menu.Item key="SignUp" onClick={this.goToSignUp.bind(this)}>注册</Menu.Item>],
                        uid: 0,
                        username: "",
                        hashedPass: "",
                        cookie: "",
                        canSignOut: true,
                        draws: 0,
                        oneNumber: 0,
                        twoNumber: 0,
                        threeNumber: 0,
                        fourNumber: 0,
                        fiveNumber: 0,
                        fivePer: 0.0,
                    });
                    this.goToMainPage();
                } else {
                    throw new Error(data["ErrorInfo"] as string);
                }
            })
            .catch(error => {
                this.setState({
                    canSignOut: true
                });
                message.error(error.message);
            });
    }

    onSignInCallback(username: string, hashedPass: string, uid: number, cookie: string, remain: number, levelOne: number, levelTwo: number, levelThree:number, levelFour: number, levelFive: number) {
        this.setState({
            username: username,
            hashedPass: hashedPass,
            uid: uid,
            cookie: cookie,
            draws: remain,
            oneNumber: levelOne,
            twoNumber: levelTwo,
            threeNumber: levelThree,
            fourNumber: levelFour,
            fiveNumber: levelFive,
            fivePer: this.calculateFivePer(levelOne, levelTwo, levelThree, levelFour, levelFive)
        });
        this.goToMainPage();
        this.loggedInAction();
    }

    calculateFivePer(levelOne: number, levelTwo: number, levelThree:number, levelFour: number, levelFive: number) {
      const sum = levelOne + levelTwo + levelThree + levelFour + levelFive;
      if (sum == 0) {
        return 0.0;
      } else {
        return levelFive / sum;
      }
    }

    onSignUpCallback() {
        this.goToMainPage();
    }

    onDrawCard() {
      if (!this.state.isLoggedIn) {
        message.error("您未登录，请登录后抽卡。");
        return;
      }

      const data = {
        Uid: this.state.uid,
        Username: this.state.username,
        Password: this.state.hashedPass,
        Cookie: this.state.cookie
      };


      this.setState({
        canDraw: false
      });

      fetch('http://47.100.175.77:8081/api/ou_huang_draw_card', {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Expose-Headers': '*',
          'Content-Type': 'text/plain',
          'Accept': '*',
        },
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify(data),
        credentials: 'include',

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
              const canDraw = data["CanDraw"] as boolean;
              if (canDraw) {
                const levelOne = data["LevelOne"];
                const levelTwo = data["LevelTwo"];
                const levelThree = data["LevelThree"];
                const levelFour = data["LevelFour"];
                const levelFive = data["LevelFive"];
                this.setState({
                    draws: data["Remain"] as number,
                    cookie: data["NewCookie"] as string,
                    canDraw: true,
                    oneNumber: levelOne,
                    twoNumber: levelTwo,
                    threeNumber: levelThree,
                    fourNumber: levelFour,
                    fiveNumber: levelFive,
                    fivePer: this.calculateFivePer(levelOne, levelTwo, levelThree, levelFour, levelFive)
                });
                this.goToMainPage();
                ReactDOM.render(<h1>结果是<br />{this.nameOfCard(data["Result"] as number)}</h1>, document.getElementById("draw_result"))
              } else {
                this.setState({
                  cookie: data["NewCookie"] as string,
                  canDraw: true
                });
                message.error("您的剩余次数不足");
              }
            } else {
              throw new Error(data["ErrorInfo"] as string);
            }
          })
          .catch(error => {
            this.setState({
              canDraw: true
            });
            console.log("zs error!");
            message.error(error.message);
          });
    }

    render() {
        return (
            <div className="App">
                <Layout>
                    <Header>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['MainPage']}
                            selectedKeys={this.state.selectedKeys}
                        >
                            <Menu.Item key="MainPage" onClick={this.goToMainPage.bind(this)}>主页</Menu.Item>
                            <Menu.SubMenu title={this.state.accountMenuTitle}>
                                {this.state.accountMenuSubMenu}
                            </Menu.SubMenu>
                        </Menu>
                    </Header>
                        <Content id="content">
                            <Row type="flex" justify="center" align="top">
                              <Col span={6}>
                                <div id="card_drawer_left">
                                  <ul id="star_list">
                                    <li>
                                      <Statistic title="五星数" value={this.state.fiveNumber}/>
                                    </li>
                                    <li>
                                      <Statistic title="四星数" value={this.state.fourNumber}/>
                                    </li>
                                    <li>
                                      <Statistic title="三星数" value={this.state.threeNumber}/>
                                    </li>
                                    <li>
                                      <Statistic title="二星数" value={this.state.twoNumber}/>
                                    </li>
                                    <li>
                                      <Statistic title="一星数" value={this.state.oneNumber}/>
                                    </li>
                                    <li>
                                      <Statistic title="五星率" value={this.state.fivePer}/>
                                    </li>
                                  </ul>
                                </div>
                              </Col>
                              <Col span={12}>
                                <div id="card_drawer_body">
                                  <Button type="primary" size="large" onClick={this.onDrawCard.bind(this)} disabled={!this.state.canDraw}>
                                    抽卡
                                  </Button>
                                  <div id="draw_result"></div>
                                </div>
                              </Col>
                              <Col span={6}>
                                <div id="card_drawer_right">
                                  <Statistic title="您的剩余抽卡次数" value={this.state.draws}/>
                                </div>
                              </Col>
                            </Row>
                        </Content>
                </Layout>
            </div>
        );
    }
}

export default App;
