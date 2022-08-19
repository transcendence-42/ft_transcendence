import React from 'react';

import EmailAuth from './emailAuth';
import SchoolAuth from './schoolAuth';

function Welcome() {
    return (
        <React.Fragment>
            <EmailAuth />
            <SchoolAuth />
        </React.Fragment>
        
    );
}
export default Welcome;