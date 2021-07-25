const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";


var client_id = ''; // Your client id
var client_secret = ''; // Your secret

//checks for authorization sucess/failure
window.onload = function () {
  if (localStorage.getItem("logsuccess") === "LoginSuccess") {
    document.getElementById("login").innerHTML = "Hi AB";
    Gettoken();
    browse();
  }
  else {
    window.open('error.html', '_self')
  }
}

//call api to get token
async function Gettoken() {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
    },
    body: 'grant_type=client_credentials'
  });

  const data = await result.json();
  sessionStorage.setItem('token', data.access_token);
  GetPlaylists();
}



//to get current user profile
// async function GetUserProfile(token)
//   {
//     try
//     {
//       const result = await fetch('https://api.spotify.com/v1/me', {
//         method: 'GET',
//         headers: {
//             'Content-Type' : 'application/json', 
//             'Authorization': 'Bearer ' + token
//         }
//       });
//       console.log(result);

//     }
//     catch(error)
//     {
//         console.log(error);
//     }
//   }

//call api to get plyalist of user
async function GetPlaylists() {
  try {
    let user = "wizzler";
    let response = await fetch("https://api.spotify.com/v1/users/" + user + "/playlists", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + sessionStorage.getItem('token')
      }
    })
    let data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    showPlaylists(data);
  }
  catch (error) {
    console.log(error);
    window.open('error.html', '_self')
  }
}

//show user playlists
function showPlaylists(data) {
  let row = document.getElementById("playlist");
  data.items.forEach(element => {
    let p1 = `  
    <div class="col-xs-4 col-md-4 col-md-push-1"> 
    <i onclick="favourite(this,'${element.id}')"class="fa fa-fw fa-heart fa-3x" style="color:blue"></i>
      <div class="card text-center">
          <img src=${element.images[0]?.url} onclick="getItems('${element.id}')" onerror=this.src="https://i.pinimg.com/originals/d3/b1/25/d3b1252338c0461134e34aa7f902552e.jpg" class="zoom" style="width:170px;height:177px;">
          
      
        <p style="font-family:cursive;font-size:20px"> ${element.name} </p>
        
       
      </div> <br><br><br><br>
     `
    row.innerHTML += p1;
  });
}

//to get genre items
function getItems(track) {

  window.location = `https://open.spotify.com/playlist/${track}`

}

//favourite or unfavuorite playlist
function favourite(x, playlist_id) {
  if (x.style.color === "red") {
    x.style.color = "blue";
    followPlaylist(playlist_id);
  }
  else {
    x.style.color = "red";
    unfollowPlaylist(playlist_id);
  }
}

//call to api to unfollow playlist 
async function unfollowPlaylist(playlist_id) {
  try {
    let response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/followers`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + sessionStorage.getItem('token')
      }
    })
    let data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    GetPlaylists();
  }
  catch (error) {
    console.log(error);
    window.open('error.html', '_self')
  }
}

//call to api to follow playlist 
async function followPlaylist(playlist_id) {
  try {
    let response = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/followers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + sessionStorage.getItem('token')
      }
    })
    let data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    GetPlaylists();
  }
  catch (error) {
    console.log(error);
    window.open('error.html', '_self')
  }
}

//broswe music by genres
async function browse() {
  const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + sessionStorage.getItem('token') }
  });

  const data = await result.json();

  getGenre(data.categories.items)
}

//add genre to select
function getGenre(genres) {
  genres.forEach(element => createGenre(element.name, element.href));
}

function createGenre(text, value) {
  let lastSlash = value.lastIndexOf("/");
  value = value.substring(lastSlash + 1);
  value = `https://open.spotify.com/genre/${value}`
  const html = `<option value="${value}">${text}</option>`;

  document.getElementById('select_genre').innerHTML += html;
}
