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

// Initialize Firebase
if (firebaseConfig && firebaseConfig.apiKey) {
// Initialize firebase
  firebase.initializeApp(firebaseConfig);
}

const API_KEY_COOKIE = "170c2be84e10421eb44d128f88c4d76c";
const CLIENT_ID_COOKIE = "bing-search-client-id";
// The Bing Image Search API endpoint
const BING_ENDPOINT = "https://api.cognitive.microsoft.com/bing/v7.0/images/search";

const imgSearchOptions = "&Count=1";
//"&mkt=en-US&count=3&safeSearch=Strict&imageType=Clipart&size=Medium";

const table = document.getElementById('table');
const getButton = document.getElementById('get');
const search = document.getElementById('search');
<<<<<<< Updated upstream
=======
const body = document.getElementById('body');
const fridge = document.getElementById('fridge');
>>>>>>> Stashed changes

getButton.addEventListener("submit", (e) =>{
  e.preventDefault();
<<<<<<< Updated upstream
 firebase.firestore().collection("reagents").onSnapshot((snaps) => {
=======
  body.innerHTML = "";
  populateTable();
  updateFridge(search.value);
});

window.onload = populateTable()

function populateTable(){
  firebase.firestore().collection("items-playground").orderBy("date").onSnapshot((snaps) => {
>>>>>>> Stashed changes
    snaps.forEach((doc) => {
      const headers = ['reagent', 'temp'] 
      let i;
      const row = document.createElement("tr");
      if (search.value != undefined) {
        search.value = search.value.toLowerCase()
      }
      if (doc.data().reagent.toLowerCase().includes(search.value)){
        for (i of headers){
            const item = document.createElement("td");
            item.textContent = (doc.data()[i]);
            row.appendChild(item);
        }
      }
    table.appendChild(row)
    });
 });
<<<<<<< Updated upstream
});
=======
}

function updateFridge(foodName) {
  var queryString = BING_ENDPOINT + "?q=" + foodName + imgSearchOptions;
  var request = new XMLHttpRequest();
  try {
    request.open("GET", queryString)
  } catch (e) {
    renderErrorMessage("Bad request (invalid URL)" + queryString);
  }
  request.setRequestHeader("Ocp-Apim-Subscription-Key", API_KEY_COOKIE);
  request.setRequestHeader("Accept", "application/json");

  request.addEventListener("load", handleBingResponse);

  // event handler for erorrs
  request.addEventListener("error", function() {
      renderErrorMessage("Error completing request");
  });

  // event handler for aborted request
  request.addEventListener("abort", function() {
      renderErrorMessage("Request aborted");
  });

  // send the request
  request.send();
  console.log(queryString);
  return false;
}

function handleBingResponse() {
    var json = this.responseText.trim();
    var jsobj = {};

    // try to parse JSON results
    try {
        if (json.length) jsobj = JSON.parse(json);
    } catch(e) {
        renderErrorMessage("Invalid JSON response");
    }

    // show raw JSON and HTTP request
    console.log(JSON.stringify(jsobj, null, 2));
    console.log(jsobj["Images"]);

}
>>>>>>> Stashed changes
