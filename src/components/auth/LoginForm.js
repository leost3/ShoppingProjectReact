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
      localStorage.setItem("loggedIn", false)
    }

    handleSubmit = (e) => {
      e.preventDefault();
      console.log('form submited');
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
        if (response.data.isLoggedIn) {
          this.props.handleLogin(response.data);
          localStorage.setItem("loggedIn", true);
          this.props.history.push(`app/${this.state.username}`);
        } 
      })
      .catch( error => {
        console.log(error);
      });
    }

    renderForm = () => {
      console.log('loggedin props', this.props.loggedInStatus)
      if (!this.props.loggedInStatus) {
        return (
          <div>
              <form onSubmit={this.handleSubmit}>
                  <input className="" value={this.state.username} placeholder="username" type="text" onChange={this.handleUsernameInput}/>
                  <input className="" value={this.state.password} placeholder="password" type="text" onChange={this.handlePasswordInput}/>
                  <button type="submit"> Login </button>
              </form>
          </div>
        )
      }
      return (
        <div>
              <form onSubmit={this.handleLogOut}>
                  <button type="submit"> Logout </button>
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

export default LoginForm
