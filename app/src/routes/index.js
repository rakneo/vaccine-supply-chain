import React from 'react';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AuthRoute from './authRoute';
import Header from '../components/header';
import { DesignerPage, RegulatorPage, ManufacturerPage, OwnerPage , DistributorPage, RetailerPage, ConsumerPage, CovidChartsPage } from '../pages';


export default (props) => {

    const { roles } = props;
    
    const OwnerRoute = (props) => {
        const {path, children} = props;
        const d = roles.find((o) => o.role === 'designer');
        const m = roles.find((o) => o.role === 'manufacturer');
        
        return ((d.status || m.status)
        ? <Route {...props} path={path}>
            {children}
          </Route>
        :
        <div>Unauthorised</div>);
    }

    return (
        <Router>
            <Header account={""} roles={roles}/>
            <Switch>
                <Route exact path="/">
                    <div>Home</div>
                </Route>
                <Route exact path="/covid-charts">
                    <CovidChartsPage />
                </Route>
                <AuthRoute exact path="/designer" roles={roles}>
                    <DesignerPage />
                </AuthRoute>
                <AuthRoute exact path="/regulator" roles={roles}>
                    <RegulatorPage />
                </AuthRoute>
                <AuthRoute exact path="/manufacturer" roles={roles}>
                    <ManufacturerPage/>
                </AuthRoute>
                <AuthRoute exact path="/distributor" roles={roles}>
                    <DistributorPage/>
                </AuthRoute>
                <AuthRoute exact path="/retailer" roles={roles}>
                    <RetailerPage/>
                </AuthRoute>
                <AuthRoute exact path="/consumer" roles={roles}>
                    <ConsumerPage/>
                </AuthRoute>
                <OwnerRoute exact path="/owner" roles={roles}>
                    <OwnerPage/>
                </OwnerRoute>
            </Switch>
        </Router>
    );
}