// Import stylesheets
import './style.css';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

import * as firebaseui from 'firebaseui';

const firebaseConfig = {
  apiKey: "AIzaSyDfzPbClsjdSr80sWCb7AeOvmWypHZMmqI",
  authDomain: "thor-7798b.firebaseapp.com",
  databaseURL: "https://thor-7798b.firebaseio.com",
  projectId: "thor-7798b",
  storageBucket: "thor-7798b.appspot.com",
  messagingSenderId: "536814220584",
  appId: "1:536814220584:web:2ff8b8d8f22ab2e4344c1d"
};

const names = document.getElementById('names');
const getButton = document.getElementById('get');

getButton.addEventListener("submit", (e) =>{
  console.log("Hi");
})

