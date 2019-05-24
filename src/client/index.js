import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './views/app';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Router, Switch } from 'react-router-dom';
import {createBrowserHistory} from 'history';
import routes, { ScrollRouter } from './routes';

const theme = createMuiTheme({

});

const browserHistory = createBrowserHistory();

ReactDOM.render(
    <Router history={browserHistory}>
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <App>
                <Switch>
                    <ScrollRouter />
                </Switch>
            </App>
        </MuiThemeProvider>
    </Router>,
    document.getElementById('app')
);
