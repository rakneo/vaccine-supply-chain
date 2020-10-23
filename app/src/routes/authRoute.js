import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';

export default (props) => {
    
    const {path, roles, children} = props;

    const role = roles.find(o => o.role === path.slice(1));
    
    return ((role.status) 
    ? 
    <Route {...props} path={path}  >
        {children}
    </Route> 
    : 
    <div>Unauthorised</div>
    );
};