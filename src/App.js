import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import firebase from "./lib/firebase";
import shortid from "shortid"

const database = firebase.database();

class App extends Component {
  constructor() {
    super();
    this.state = {
      users: {}
    };
  }

  componentWillMount() {
    database.ref("users").on("value", (snap) => {
      this.setState({
        users: snap.val()
      })
    })

    database.ref("purchases").on("value", (snap) => {
      this.setState({
        purchases: snap.val()
      })
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

  incrementPurchases(username) {
    const purchaseId = shortid.generate();
    let purchasesTable = database.ref('purchases/' + username)
    
    purchasesTable.once("value")
      .then( snap => {
        let value = snap.val();

        if (!value) {
          purchasesTable.set({
            purchases: 1
          })
        }

        else {
          purchasesTable.update({
            purchases: value.purchases + 1
          })
        }        
      })


    // database.ref('users/' + username).set({
    //   purchases: purchaseId
    // });
    // get purchase total
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
        <button onClick={() => this.handleClick()}>add user</button>
        {
          Object.keys(this.state.users).map( (username, i) => {
            return (
              <div key={i}>
                <p>{username}</p>
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
