import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const name = 'Josh Perez';
const element = <h1>Hello, {name}</h1>;

ReactDOM.render(
    element,
    document.getElementById('root')
);

class NameForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            pass: ''
        };

        this.loginChange = this.loginChange.bind(this);
        this.passChange = this.passChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    loginChange(event) {
        this.setState({login: event.target.value});
    }
    passChange(event) {
        this.setState({pass: event.target.value});
    }

    handleSubmit(event) {
        alert(this.state.login + ' ' + this.state.pass);
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <ul className="uk-navbar-nav">
                    <li className="uk-navbar-content">
                        <input name="login" type="text" size="5" placeholder="login" onChange={this.loginChange}/>
                        <input name="pass" type="password" size="5" placeholder="pass" onChange={this.passChange}/>
                    </li>
                    <li className="uk-navbar-content"><button type="submit">Login</button></li>
                    <li className="uk-navbar-content">User</li>
                </ul>
            </form>
        );
    }
}

ReactDOM.render(
    <NameForm />,
    document.getElementById('auth_form')
);