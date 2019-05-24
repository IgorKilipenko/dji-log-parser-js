import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { HideOnScroll } from '../components';
import clsx from 'clsx';

const styles = theme => ({
    root: {
        display: 'flex'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-start'
    }
});

class App extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <Container className={classes.root}>
                <HideOnScroll>
                    <AppBar>
                        <Toolbar>
                            <Typography variant="h6">DJI LOG PRSER</Typography>
                        </Toolbar>
                    </AppBar>
                </HideOnScroll>
                <main className={classes.content}>
                    <div className={classes.drawerHeader} />
                    {this.props.children}
                </main>
            </Container>
        );
    }
}

App.propTypes = {
    children: PropTypes.element.isRequired
};

export default withStyles(styles, { withTheme: true })(App);
