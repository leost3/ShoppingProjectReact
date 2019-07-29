import React from 'react';
import axios from 'axios';

// import { Redirect } from 'react-router-dom';

class LoginForm extends React.Component {
    state = {
        username: 'sa',
        password: 'sa',
    }

    handleUsernameInput = (e) => {
      this.setState({...this.state, username:e.target.value})
    }
    handlePasswordInput = (e) => {
      this.setState({...this.state, password:e.target.value})
    }

    handleLogOut = () => {
      localStorage.clear();
    }

    handleSubmit = (e) => {
      console.log('form submitted')
      e.preventDefault();
      const config = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      };
      axios.post(
        'http://localhost:8181/shoppingprojectphp/api/user.php',
        {
          action:"login",
          username:this.state.username,
          password:this.state.password,
        },
        config
      )
      .then( response => {
        if (response.data.result.isLoggedIn) {
          this.props.handleLogin(true);
          localStorage.setItem("loggedIn", true);
          localStorage.setItem("userId", response.data.result.userId);
          localStorage.setItem("username", response.data.result.username);
          console.log(localStorage)
          this.props.getUserDetails();
          // this.props.getUserDetails(response.data.result.userId,response.data.result.username);
          // this.props.history.push(`app/${this.state.username}`);
        } 
      })
      .catch( error => {
        console.log(error);
      });
    }

    renderForm = () => {
      if (!this.props.loggedInStatus) {
        return (
          <div className='login'>
              <form onSubmit={this.handleSubmit} className='loginForm'>
                  <input 
                    className="" 
                    value={this.state.username} 
                    placeholder="username" 
                    type="text" 
                    onChange={this.handleUsernameInput}
                    // onTouchMove={this.mouseLeave}
                  />
                  <input 
                    className="" 
                    value={this.state.password} 
                    placeholder="password" 
                    type="text" 
                    onChange={this.handlePasswordInput}/>
                  <button type="submit"> Login </button>
              </form>
          </div>
        )
      }
      return (
        <div className="loginInformation">
              <form onSubmit={this.handleLogOut} className="loggedInForm" >
                  <h1>Welcome: {this.state.username}</h1>
                  <button type="submit">  Logout </button>
              </form>
          </div>
      )

    }


    render() {
      // console.log(this.props.loggedInStatus);
        return (
          
          // <div>
          //     <form onSubmit={this.handleSubmit}>
          //         <input className="" value={this.state.username} placeholder="username" type="text" onChange={this.handleUsernameInput}/>
          //         <input className="" value={this.state.password} placeholder="password" type="text" onChange={this.handlePasswordInput}/>
          //         <button type="submit"> Login </button>
          //     </form>
          // </div>
          <div>
            {this.renderForm()}
          </div>
        )
    }
}

export default LoginForm;
