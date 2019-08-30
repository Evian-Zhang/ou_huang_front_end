import React, { Component } from 'react';
import './App.css';

interface CardDrawerProps {

}

interface CardDrawerState {
    randomNumber: number
    isFetching: boolean
}

enum CardLevel {
    OneStar,
    TwoStar,
    ThreeStar,
    FourStar,
    FiveStar,
}

function nameOfCard(card: CardLevel) {
    switch (card) {
        case CardLevel.OneStar: {
            return "一星"
        }
        case CardLevel.TwoStar: {
            return "二星"
        }
        case CardLevel.ThreeStar:{
            return "三星"
        }
        case CardLevel.FourStar:{
            return "四星"
        }
        case CardLevel.FiveStar:{
            return "五星"
        }
    }
}

class CardDrawer extends Component<CardDrawerProps, CardDrawerState> {
    constructor(props: CardDrawerProps) {
        super(props);

        this.state = {
            randomNumber: 0,
            isFetching: false
        };
    }

    onClickButton() {
        this.setState({
            isFetching: true
        });
        this.fetchNumber()
    }

    fetchNumber() {
        fetch('http://47.100.175.77:8081/ou_huang_get_random', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF8'
            },
            mode: 'cors',
            cache: 'default'
            
        })
            .then(res => res.json())
            .then((data) => {
                this.setState({
                    randomNumber: parseInt(data["RandomNumber"]),
                    isFetching: false
                });
            })
    }

    levelOfNumber(num: number) {
        if (num < 500) {
            return CardLevel.OneStar;
        } else if (num < 700) {
            return CardLevel.TwoStar;
        } else if (num < 850) {
            return CardLevel.ThreeStar;
        } else if (num < 950) {
            return CardLevel.FourStar;
        } else {
            return CardLevel.FiveStar;
        }
    }

    render() {
        return (
            <div id="card_drawer_container">
                <button id="card_drawer_btn" onClick={ this.onClickButton.bind(this) } disabled={ this.state.isFetching }>抽卡</button>
                <div id="card_drawer_text">
                    您获得了{ nameOfCard(this.levelOfNumber(this.state.randomNumber)) }
                </div>
            </div>
        );
    }
}

export default CardDrawer;