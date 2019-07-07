import React from 'react';
import Home from './Home';
import Error from './Error';
import { BrowserRouter as Router, Switch} from 'react-router-dom';
import Route from 'react-router-dom/Route';
import SignupForm from './SignupForm';
import MoviesList from './MoviesList';

class App extends React.Component {
 
  state = {
    isLoggedIn: false,
  }


  handleLogin = (e) => {
    this.setState({isLoggedIn: true});
    console.log(this.state.isLoggedIn)
  }



  render() {
      console.log(this.props)
    return (
        <div>
            <Router>
                <div>
                    <Switch>
                        {/* <Route path='/app/:appname' exact render={({match})=>(this.state.loggedIn ? ( <App params={match} />) : (< Redirect to='/' />))}/> */}
                        <Route path='/app/:appname' exact render={ props => (
                            <MoviesList {...props} loggedInStatus={this.state.isLoggedIn}/>
                        )} />
                        <Route path='/' exact strict render={ props => (
                            <Home  {...props} handleLogin={this.handleLogin} loggedInStatus={this.state.isLoggedIn}  />
                        )} />
                        <Route path='/signup' component={SignupForm} />
                        <Route component={Error} />
                    </Switch>
                </div>
            </Router>
        </div>

    )
}

}

export default App;



// getList = () => {
//   // console.log("list")
//   if (this.state) {
//     let bodyFormData = new FormData();
//     bodyFormData.append("action", "list");
//     const config = {
//       headers: {'Content-Type': 'application/x-www-form-urlencoded'}
//     };
//     axios.post(
//       'http://localhost:8181/shoppingprojectphp/api/cars.php', 
//       bodyFormData,
//       config
//     )
//     .then( response => {
//       // console.log(response.data);
//       this.setState({cars: response.data.result});
//     })
//     .catch( error => {
//       console.log(error);
//     });
//   }
// }