import React, { Fragment } from 'react';

import Index from './views/home'
import App from './views/app';
import {Route} from 'react-router-dom';

const routes = [
        {
            name: 'Root',
            component: App,
            routes: [
            {
                name: 'index',
                path: '/',
                component: Index,
                exact: true,
                scrollOrder: 0,
                routes: [

                ],
                isScrollRoute: false
            }
        ]
    }
]
export default routes;

export const ScrollRouter = (props) => {
    const scrollRoutes = routes[0].routes;
    return (
            scrollRoutes.map((route,i, branch) => (
                <Route key={i} exact={route.exact} path={route.path} render={props => props.match && <route.component {...props} route={route} routes={route.routes} branch={{routes:branch}}/>} />
            ))
    )
}

