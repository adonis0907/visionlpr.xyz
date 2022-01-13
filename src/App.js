import React, { useContext } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import {AuthContext} from "./Context/AuthContext";
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center"><div className="sk-spinner sk-spinner-pulse"/></div>;

const DefaultLayout = Loadable({
    loader: () =>import('./containers/DefaultLayout'),
    loading
});

const Login = Loadable({
  loader: () => import('./views/Pages/Login'),
  loading
});

const ResetPassword = Loadable({
  loader: () => import('./views/Pages/ResetPassword/ResetPassword'),
  loading
});

const ResetLink = Loadable({
    loader: () => import('./views/Pages/ResetLink/ResetLink'),
    loading
});

const App = () => {

    const {isAuthenticated} = useContext(AuthContext);

    return (
        isAuthenticated?
            <HashRouter>
                <Switch>
                    <Route exact path="/login" name="Login Page" component={Login} />
                    <Route exact path="/reset" name="Reset Password" component={ResetLink}/>
                    <Route exact path="/cmVzZXRwYXNzd29yZA/:token" name="Reset Password" component={ResetPassword}/>
                    <Route path="/" name="Dashboard" component={DefaultLayout} />
                </Switch>
            </HashRouter>:
            <HashRouter>
                <Switch>
                    <Route exact path="/reset" name="Reset Password" component={ResetLink}/>
                    <Route exact path="/cmVzZXRwYXNzd29yZA/:token" name="Reset Password" component={ResetPassword}/>
                    <Route exact path="*"  component={Login}/>
                </Switch>
            </HashRouter>
    );
};

export default App;