const AUTHORIZE = "https://accounts.spotify.com/authorize"


var redirect_uri = '/index.html'; // Your redirect uri// 

function requestAuthorization(){
    var client_id = ''; // Your client id
    var client_secret = ''; // Your secret
    
    try
    {
        
    localStorage.setItem("logsuccess","LoginSuccess")
    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // Show Spotify's authorization screen
   
    }
    catch(error)
    {
        localStorage.setItem("logsuccess","LoginFailure")

    }
}

