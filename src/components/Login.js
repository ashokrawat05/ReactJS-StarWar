import React, { Component } from "react";
import './Login.css';
import { browserHistory} from 'react-router';
//import { ClipLoader } from 'react-spinners';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            redirect: false,
            isloading : false
        };
        this.userExistOnServerResponse = this.userExistOnServerResponse.bind(this)
    }

    componentWillMount() {
        if (localStorage.getItem('username')) {
           browserHistory.push('/searchscreen')
        }
    }

    loginSubmit = e => {
        e.preventDefault()
        const { username, password } = this.state;
        if (username.length <= 0) {
            alert('username cannot be empty');
        }
        else if (password.length <= 0) {
            alert('password cannot be empty');
        }
        
        else {
            document.getElementById("loderIndicator").style.display = "block";
            this.setState({
                loading: true
              });
            fetch("https://swapi.co/api/people/")
        .then(response => response.json())
        .then(data => { 
            document.getElementById("loderIndicator").style.display = "none";
            if (this.userExistOnServerResponse(data)) {
                localStorage.setItem('username', username);
                browserHistory.push('/searchscreen')
            }
            else {
                alert('Enter correct credential');
            }
        });
       }
    }

    userExistOnServerResponse(data) {
        const { username, password } = this.state;
        for (var i = 0; i < data.results.length; i++) {
            if (data.results[i].name == username && data.results[i].birth_year == password) {
                return true
            }
        }
        return false
    }

    handleUserName(text) {
        this.setState({username: text.target.value})
    }
    handlePassword(text) {
        this.setState({password: text.target.value})
    }
    login() {
       console.warn("All state")
    }

    render() {
        const { username, password } = this.state;
        const enabled =
          username.length > 0 &&
          password.length > 0;
       return (
    <form>        
    <div class="container">
      <header className="header">
         <h1 className="App-title">STAR WARS</h1>
      </header>
      <label for="uname"><b>Username</b></label>
      <input type="text" placeholder="username" required value={this.state.username} onChange={(text)=>{this.handleUserName(text)}} />
      <label for="psw"><b>Password</b></label>
      <input type="password" placeholder="password" name="psw" required value={this.state.password} onChange={(text)=>{this.handlePassword(text)}} />
      <button disabled={!enabled}  onClick={this.loginSubmit} >Login</button>
    </div>
    <div class="loader" id="loderIndicator"></div>
    </form>
     );
    }
}

export default Login;

