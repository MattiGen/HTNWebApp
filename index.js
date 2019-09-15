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
const BING_IMAGES_ENDPOINT = "https://api.cognitive.microsoft.com/bing/v7.0/images/search";
const BING_WEB_ENDPOINT = "https://api.cognitive.microsoft.com/bing/v7.0/search";

const imgSearchOptions = "&mkt=en-US&count=25&safeSearch=Strict&aspect=Square&imageType=Clipart&size=Medium";
const recipeSearchOptions = "&mkt=en-US&count=25&safeSearch=Strict&responseFilter=Webpages";
//
const table = document.getElementById('table');
const getButton = document.getElementById('get');
const search = document.getElementById('search');
const body = document.getElementById('body');
const fridge = document.getElementById('fridge');
const addButton = document.getElementById('add');
const addForm = document.getElementById('addForm');
const clearSearch = document.getElementById('clear');

getButton.addEventListener("click", (e) =>{
  e.preventDefault();
  fridge.innerHTML = "";
  populateTable();
});

addButton.addEventListener("click", (e) => {
  addForm.style.display = 'block';
});

clearSearch.addEventListener("click", (e)=>{
  //console.log('a');
  e.preventDefault();
  search.value="";
  body.innerHTML = "";
  fridge.innerHTML = "";
  populateTable();
});

addForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const name=document.getElementById('itemName');
  const bestBefore=document.getElementById('bestBefore');
  const location=document.getElementById('location');
  if (name.value && location.value && bestBefore.value){
    firebase.firestore().collection("items").doc(name.value.toLowerCase()).set({   
    item: name.value,
    date: Date.now(),
    location: location.value,
    bestBefore: bestBefore.value
    });
  }
  addForm.style.display = 'none';
})

window.onload = populateTable()

function populateTable(){
  firebase.firestore().collection("items").orderBy("date").onSnapshot((snaps) => {
    body.innerHTML = "";
    snaps.forEach((doc) => {
      const headers = ['item', 'bestBefore', 'location', 'date'] 
      let i;
      const row = document.createElement("tr");
      if (search.value != undefined) {
        search.value = search.value.toLowerCase()
      }
      if (doc.data().item.toLowerCase().includes(search.value)){
        for (i of headers){
            const item = document.createElement("td");
            item.textContent = (doc.data()[i]);
            if (i=="date"){
              let date = Date(doc.data()[i]);
              item.textContent = date.slice(0, 15);
            }
            row.appendChild(item);
        }
        let remove = document.createElement("button");
        remove.innerHTML = "X";
        remove.style = "background-color: #d2ebea; border: none; margin-top: 0.5em;";
        remove.onclick = function() {removeitem(doc.data().item);}
        row.appendChild(remove);
        fridge.innerHTML="";
		    updateFridge(doc.data().item.toLowerCase());
      }
    
    body.appendChild(row);
    });
 });
}

function removeitem(item){
  firebase.firestore().collection("items").doc(item.toLowerCase()).delete();
  
}

function updateFridge(foodName) {
  var imgQueryString = BING_IMAGES_ENDPOINT + "?q=" + foodName + imgSearchOptions;
  var recipeQueryString = BING_WEB_ENDPOINT + "?q=" + "recipes%20thatuse%20" + foodName + recipeSearchOptions;
  var imgRequest = new XMLHttpRequest();
  var recipeRequest = new XMLHttpRequest();
  var imgUrl = "";
  var recipeUrl = "";
  try {
    imgRequest.open("GET", imgQueryString)
  } catch (e) {
    renderErrorMessage("Bad request (invalid URL)" + imgQueryString);
  }
  try {
    recipeRequest.open("GET", recipeQueryString)
  } catch (e) {
    renderErrorMessage("Bad request (invalid URL)" + recipeQueryString);
  }
  imgRequest.setRequestHeader("Ocp-Apim-Subscription-Key", API_KEY_COOKIE);
  imgRequest.setRequestHeader("Accept", "application/json");
  recipeRequest.setRequestHeader("Ocp-Apim-Subscription-Key", API_KEY_COOKIE);
  recipeRequest.setRequestHeader("Accept", "application/json");
  imgRequest.onreadystatechange = function() {
    if (imgRequest.readyState == XMLHttpRequest.DONE) {
        imgUrl = HandleBingImageResponse(imgRequest.responseText);
    }
    if(imgUrl!="" && recipeUrl!=""){
      fridge.innerHTML = fridge.innerHTML + "<div class=\"border rounded text-center vertical-center food-item\"> <a href=\"" + recipeUrl + "\"> <img src=\"" + imgUrl + "\" class=\"img-fluid\" alt=\"Responsive image\"> </a> </div>";
    }
  }
  recipeRequest.onreadystatechange = function() {
    if (recipeRequest.readyState == XMLHttpRequest.DONE) {
        recipeUrl = HandleBingRecipeResponse(recipeRequest.responseText);
    }
    if(imgUrl!="" && recipeUrl!=""){
      fridge.innerHTML = fridge.innerHTML + "<div class=\"border rounded text-center vertical-center food-item\"> <a href=\"" + recipeUrl + "\"> <img src=\"" + imgUrl + "\" class=\"img-fluid\" alt=\"Responsive image\"> </a> </div>";
    }
  }
  // send the request
  imgRequest.send();
  recipeRequest.send();
  console.log(imgUrl);
  return false;
}

function HandleBingImageResponse(json) {
  json = json.trim();
  var jsobj = {};

  // try to parse JSON results
  try {
      if (json.length) jsobj = JSON.parse(json);
  } catch(e) {
      renderErrorMessage("Invalid JSON response");
  }
  
  // show raw JSON and HTTP request
  //console.log(JSON.stringify(jsobj, null, 2));
  //console.log(jsobj.value[0].contentUrl);
  var imgUrl = ""
  var httpsRegex = /(https:\/\/).*/;
  var index = -1;
  while(!httpsRegex.test(imgUrl) && index < 25) {
    index = index + 1;
    imgUrl = jsobj.value[index].contentUrl;
  }
  if(index < 25) {
    //console.log(imgUrl);
    return imgUrl;
  }
  return "";
}

function HandleBingRecipeResponse(json) {
  json = json.trim();
  var jsobj = {};

  // try to parse JSON results
  try {
      if (json.length) jsobj = JSON.parse(json);
  } catch(e) {
      renderErrorMessage("Invalid JSON response");
  }
  
  // show raw JSON and HTTP request
  //console.log(JSON.stringify(jsobj, null, 2));
  //console.log(jsobj.value[0].contentUrl);
  var recipeUrl = ""
  var httpsRegex = /(https:\/\/).*/;
  var index = -1;
  while(!httpsRegex.test(recipeUrl) && index < 25) {
    index = index + 1;
    recipeUrl = jsobj.webPages.value[index].url;
  }
  if(index < 25) {
    //console.log(recipeUrl);
    return recipeUrl;
  }
  return "";
}