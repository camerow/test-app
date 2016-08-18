import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import firebase from "./lib/firebase";
// import shortid from "shortid";

const database = firebase.database();

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: {},
      purchases: {}
    };
  }

  componentWillMount() {
    database.ref("users").on("value", (snap) => {
      if (snap.val()) {
        this.setState({
          users: snap.val()
        })
      }
    })

    database.ref("purchases").on("value", (snap) => {
      if (snap.val()) {
        this.setState({
          purchases: snap.val()
        })
      }
    })
  }
  // controlled input
  handleUserChange(e) {
    this.setState({
      username: e.target.value
    })
  }

  handleClick() {
    const { username } = this.state;

    database.ref('users/' + username).set({
      email: "default@email.com"
    })
    .then((res) => console.log(res))
    .catch((err) => console.error(err));

    this.setState({
      username: ""
    })
  }

  removeUser(username) {
    database.ref("users/" + username).remove();
  }

  incrementPurchases(username) {
    // Quick query
    // here i get the table reference
    let purchasesTable = database.ref('purchases/' + username)
    // here i query for purchases value
    purchasesTable.once("value")
      .then( snap => {
        let value = snap.val();
        // if it doesn't exist i set it'
        if (!value) {
          purchasesTable.set({
            purchases: 1
          })
        }
        // if it does, i increment
        else {
          purchasesTable.update({
            purchases: value.purchases + 1
          })
        }        
      });
  }

  render() {
    console.log(this.state);
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Really short Firebase Tutorial!</h2>
        </div>
        <p className="App-intro">
          <code>Put some code here.</code>
        </p>

        <input value={this.state.username || ""} onChange={(e) => this.handleUserChange(e)}></input>
        <button style={{ textTransform: "capitalize"}} onClick={() => this.handleClick()}>add user</button>
        {
          Object.keys(this.state.users).map( (username, i) => {
            return (
              <div key={i}>
                <p onClick={() => this.removeUser(username)}>{username}</p>
                <p>Purchases: { this.state.purchases[username] ? this.state.purchases[username].purchases : "nada" }</p>
                <button onClick={ () => this.incrementPurchases(username)}>+</button>
                <button onClick={ () => this.decrementPurchases(username) }>-</button>
              </div>
            )            
          })
        }
      </div>
    );
  }
}

export default App;
