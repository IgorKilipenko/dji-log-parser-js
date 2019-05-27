import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { MuiVirtualizedTable as VirtualizedTable } from '../../components';

import Parser from '../../parser';
import testData from '../../parser/test_data/DJIFlightRecord_2018-10-03_[13-23-50].txt';

const styles = theme => ({});

class Home extends React.Component {
    constructor() {
        super();
        const sample = [
            ['Frozen yoghurt', 159, 6.0, 24, 4.0],
            ['Ice cream sandwich', 237, 9.0, 37, 4.3],
            ['Eclair', 262, 16.0, 24, 6.0],
            ['Cupcake', 305, 3.7, 67, 4.3],
            ['Gingerbread', 356, 16.0, 49, 3.9]
        ];

        for (let i = 0; i < 200; i += 1) {
            const randomSelection =
                sample[Math.floor(Math.random() * sample.length)];
            this.rows.push(this.createData(i, ...randomSelection));
        }

        this.parser = new Parser();
        this.parser.on('CUSTOM'.toLowerCase(), (data) => {
            this.state.data = data;
            console.debug({data});
        })
        this.parser.on('OSD'.toLowerCase(), (data) => {
            this.state.data = data;
            console.debug({data});
        })
        this.parser.on('HOME'.toLowerCase(), (data) => {
            this.state.data = data;
            console.debug({data});
        })
        this.parser.on('GIMBAL'.toLowerCase(), (data) => {
            this.state.data = data;
            console.debug({data});
        })
        this.parser.on('warn', (msg, warnInfo) => {
            console.warn(msg, warnInfo);
        })
        this.parser.on('error', (msg, errInfo)=> {
            console.error(msg, errInfo);
        })
        this.parser.on('parseend', (stat) => {
            console.debug('Parsing end success', stat);
        })

        this.state = {};
    }
    rows = [];

    createData = (id, dessert, calories, fat, carbs, protein) => {
        return { id, dessert, calories, fat, carbs, protein };
    };

    componentDidMount = () => {
        console.debug('Component Index Mount');
        this.parser.parse(testData);
        
    }

    render() {
        return (
            <React.Fragment>
                <div>{[...Array(1000)].map(() => 'Content').join(' ')}</div>
                {this.ReactVirtualizedTable()}
            </React.Fragment>
        );
    }

    ReactVirtualizedTable = () => {
        return (
            <Paper style={{ height: 400, width: '100%' }}>
                <VirtualizedTable
                    rowCount={this.rows.length}
                    rowGetter={({ index }) => this.rows[index]}
                    columns={[
                        {
                            width: 200,
                            label: 'Dessert',
                            dataKey: 'dessert'
                        },
                        {
                            width: 120,
                            label: 'Calories\u00A0(g)',
                            dataKey: 'calories',
                            numeric: true
                        },
                        {
                            width: 120,
                            label: 'Fat\u00A0(g)',
                            dataKey: 'fat',
                            numeric: true
                        },
                        {
                            width: 120,
                            label: 'Carbs\u00A0(g)',
                            dataKey: 'carbs',
                            numeric: true
                        },
                        {
                            width: 120,
                            label: 'Protein\u00A0(g)',
                            dataKey: 'protein',
                            numeric: true
                        }
                    ]}
                />
            </Paper>
        );
    };
}

export default withStyles(styles, { withTheme: true })(Home);
