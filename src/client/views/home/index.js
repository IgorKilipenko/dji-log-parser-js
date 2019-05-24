import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    
});

class Home extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div>
                    {[...Array(1000)].map(() => (
                        'Content'
                    )).join(' ')}
                </div>
            </React.Fragment>
        );
    }
}

export default withStyles(styles, { withTheme: true })(Home);
