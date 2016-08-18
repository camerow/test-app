import firebase from "firebase";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAa2byM_HGNLmOOCtkqKyd57d2PjImRbDs",
  authDomain: "doc-database-demo.firebaseapp.com",
  databaseURL: "https://doc-database-demo.firebaseio.com",
  storageBucket: "doc-database-demo.appspot.com",
};

export default firebase.initializeApp(config);

  
    