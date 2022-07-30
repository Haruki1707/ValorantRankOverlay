const urlParams = new URLSearchParams(window.location.search);
const apiRepoFileURL = "https://api.github.com/repos/Haruki1707/ValorantRankOverlay/contents/scripts/";
const apiRankURL = "https://api.henrikdev.xyz/valorant/v1/mmr";
const apiMatchesURL = "https://api.henrikdev.xyz/valorant/v3/matches";
const defaultImage = "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/0/smallicon.png";
var thisFileSHA = null; var thisFileName;
var fetchedtUID = null; var nWins = 0; var nLosses = 0; var W_L_Text; var rankText; var rankImage;
var region; var user; var refreshSeconds = 30; var AlreadyFetched = false; var HenrikAPIJSON = null; var ValAPImageJSON = null;

function OnLoadCommon(){
    region = urlParams.get('region');
    user = urlParams.get('user');

    if (urlParams.get('refreshRate') != null) {
        refreshSeconds = urlParams.get('refreshRate');
    }

    checkSHAtoReload();
    setInterval(checkSHAtoReload, 2.5 * 1000 * 60);
}

function checkSHAtoReload(){
    if(thisFileName == null){
        alert("FILE NAME SHOULD BE DETERMINED BEFORE ONLOADCOMMON()");
        return;
    }
    
    getJSONFromURL(`${apiRepoFileURL}${thisFileName}`).then(function (jsonData){
        if(thisFileSHA == null){
            thisFileSHA = jsonData['sha'];
            console.log(`${thisFileName} SHA obtained`);
        }

        if(thisFileSHA != jsonData['sha']){
            location.reload();
        }
    });
}

async function getJSONFromURL(URL){
    var response = await fetch(URL);
    return await response.json();
}

function setCookie(cname, cvalue, exminutes) {
    const d = new Date();
    d.setTime(d.getTime() + (exminutes * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
  
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
}