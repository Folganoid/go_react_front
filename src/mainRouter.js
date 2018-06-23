import React, {Component} from 'react'
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import NameForm from './auth/nameForm.js';
import RegForm from './auth/regForm.js';

/**
 *  Router and navbar
 */
class MainRouter extends Component {
    render() {
        return (
            <Router>
                <div>
                    <nav className="uk-navbar-container" uk-navbar="boundary-align: true; align: center;">
                        <div className="uk-navbar-left">
                            <ul className="uk-navbar-nav">
                                <li className="uk-parent"><Link to="/">Home</Link></li>
                                <li className="uk-parent"><Link to={{pathname: '/map'}}>Map</Link></li>
                                <li className="uk-parent"><Link to="/stat">Statistic</Link></li>
                                <li className="uk-parent"><Link to="/data">Data</Link></li>
                            </ul>
                        </div>
                        <NameForm/>
                    </nav>
                    <div className="uk-container">
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route exact path="/map" component={Map}/>
                            <Route exact path="/stat" component={Stat}/>
                            <Route exact path="/register" component={Register}/>
                            <Route
                                exact path="/data"
                                render={() => <h1>Data</h1>}/>
                            <Route render={() => <h1>Page not found</h1>}/>
                        </Switch>
                    </div>
                </div>
            </Router>
        )
    }
}

const Home = () => <h1>Hello from Home!</h1>;
const Stat = () => <h1>We are located at 555 Jackson St.</h1>;
const Map = () => <h1>Map</h1>;
const Register = () => <RegForm/>;


export default MainRouter


