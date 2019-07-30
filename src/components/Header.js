import React from 'react'
import LoginForm from './auth/LoginForm';

function Header(props) {

    return (
        <div className='header'>
            {/* {renderSignUpComponent()} */}
            <LoginForm 
            {...props} 
            handleLogin={props.handleLogin} 
            getUserDetails={props.getUserDetails} 
            loggedInStatus={props.loggedInStatus}/>
        </div>
    )
}

export default Header;
