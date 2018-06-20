import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

/**
 * Auth form
 */
class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            pass: '',
            user: '',
            userId: 0,
        };

        this.loginChange = this.loginChange.bind(this);
        this.passChange = this.passChange.bind(this);
        this.userChange = this.userChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    loginChange(event) {
        this.setState({login: event.target.value});
    }

    passChange(event) {
        this.setState({pass: event.target.value});
    }

    logOut() {
        this.setState({user: ''});
        this.setState({userId: 0});
    }

    userChange(user, userId) {
        this.setState({user: user});
        this.setState({userId: userId});
    }


    handleSubmit(event) {

        var formData = new FormData();
        formData.append('login', this.state.login);
        formData.append('pass', this.state.pass);

        axios({
            method: 'post',
            url: 'http://127.0.0.1:3001/user',
            data: formData,

            config: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Origin': 'http://localhost:3000',
                }
            },

        }).then(function (response) {
            console.log(response);
            if (response.data.Id !== 0) {
                this.userChange(response.data.Login, response.data.Id);
            }
        }.bind(this));

        event.preventDefault();
    }

    render() {

        let login;

        if (this.state.userId === 0) {
            login = <div className="uk-navbar-right">
                <div className="uk-navbar-item">
                    <input className="uk-input uk-form-width-small" name="login" type="text" size="5"
                           placeholder="login" onChange={this.loginChange}/>
                    <input className="uk-input uk-form-width-small" name="pass" type="password" size="5"
                           placeholder="pass" onChange={this.passChange}/>
                </div>
                <div className="uk-navbar-item">
                    <button className="uk-button uk-button-default" type="submit" onClick={this.handleSubmit}>Login</button>
                </div>
                <div className="uk-navbar-item">
                    <Link to="/register">Registration</Link>
                </div>
            </div>;
        } else {
            login = <div className="uk-navbar-right">
                <div className="uk-navbar-item">
                    <div><span uk-icon="icon: user"></span> <b>{this.state.user}</b></div>
                </div>
                <ul className="uk-navbar-nav">
                    <li className="uk-navbar-content ifLogin">
                        <button className="uk-button uk-button-default" type="reset" onClick={this.logOut}>Logout
                        </button>
                    </li>
                </ul>
            </div>;
        }

        return (login);
    }
}

export default NameForm