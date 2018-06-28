import React from 'react';
import axios from 'axios';
import {withRouter} from "react-router-dom";
import SETUP from '../config';

class ProfForm extends React.Component {

    /**
     * constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            userId: this.props.user.userId,
            login: this.props.user.login,
            name: this.props.user.name,
            pass: '',
            pass_old: '',
            pass2: '',
            email: this.props.user.email,
            year: this.props.user.year,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * submit
     * @param event
     */
    handleSubmit(event) {

        if (this.state.pass === this.state.pass2) {

            let formData = new FormData();
            formData.append('userId', this.state.userId);
            formData.append('login', this.state.login);
            formData.append('name', this.state.name);
            formData.append('pass', this.state.pass);
            formData.append('pass_old', this.state.pass_old);
            formData.append('email', this.state.email);
            formData.append('year', this.state.year);

            let that = this;
            axios({
                method: 'post',
                url: SETUP.goHost + '/profupdate',
                data: formData,

                config: {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Origin': SETUP.reactHost,
                    }
                },

            }).then(function (response) {
                that.props.done("User " + that.state.login + " User update succesful !", "uk-alert-success");
                that.props.history.push('/');
            }).catch((error) => {
                if (error.response) {
                    that.props.done("Access denied !", "uk-alert-danger");
                    that.props.history.push('/');
                }
            });
        }

        event.preventDefault();
    }

    /**
     * if input change
     * @param event
     */
    handleInputChange(event) {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    /**
     * RENDER
     * @returns {*}
     */
    render() {

        let passMessage;
        if (this.state.pass === this.state.pass2) {
            passMessage = '';
        } else {
            passMessage = 'Password is not match !';
        }

        let form =
            <div>
                <h1>Edit profile</h1>
                <form onSubmit={this.handleSubmit}>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                <label htmlFor="upd_login">Login: </label><br/>
                                <label htmlFor="upd_name">Name: </label><br/>
                                <label htmlFor="upd_email">Email: </label><br/>
                                <label htmlFor="upd_pass_old">Old password: </label><br/>
                                <label htmlFor="upd_pass">Password: </label><br/>
                                <label htmlFor="upd_pass2">Confirm password: </label><br/>
                                <label htmlFor="upd_year">Year: </label><br/>
                            </td>
                            <td>
                                <input id="upd_userId" name="userId" type="hidden" value={this.state.userId} />
                                <input id="upd_login" name="login" placeholder="login" value={this.state.login}
                                       onChange={this.handleInputChange}/><br/>
                                <input id="upd_name" name="name" placeholder="name" value={this.state.name}
                                       onChange={this.handleInputChange}/><br/>
                                <input id="upd_email" name="email" placeholder="email"  value={this.state.email}
                                       onChange={this.handleInputChange}/><br/>
                                <input id="upd_pass_old" name="pass_old" type="password"
                                       onChange={this.handleInputChange}/><br/>
                                <input id="upd_pass" name="pass" type="password"
                                       onChange={this.handleInputChange}/><br/>
                                <input id="upd_pass2" name="pass2" type="password"
                                       onChange={this.handleInputChange}/><span
                                style={{color: 'red'}}>{passMessage}</span><br/>
                                <input id="upd_year" name="year" placeholder="year" value={this.state.year}
                                       onChange={this.handleInputChange}/><br/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <button type="submit">Update</button>
                </form>
            </div>;

        return (form);
    }
}

export default withRouter(ProfForm)