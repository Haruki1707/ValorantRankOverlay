const urlParams = new URLSearchParams(window.location.search);
const apiURL = "https://api.henrikdev.xyz/valorant/v1/mmr";
const defaultImage = "https://media.valorant-api.com/competitivetiers/e4e9a692-288f-63ca-7835-16fbf6234fda/0/smallicon.png";
var rankText; var rankImage; var region; var user; var refreshSeconds = 30; var AlreadyFetched = false; var HenrikAPIJSON = null; var ValAPImageJSON = null;

function OnLoad() {
    rankText = document.getElementById("rankText");
    rankImage = document.getElementById("rankImage");
    region = urlParams.get('region');
    user = urlParams.get('user');

    if (urlParams.get('refreshRate') != null) {
        refreshSeconds = urlParams.get('refreshRate');
    }

    FetchRank();
    setInterval(FetchRank, refreshSeconds * 1000);
}

function FetchRank() {
    console.log("Refreshing rank");
    getHenrikAPI(function (err, player) {
        if (err != null) {
            if (!AlreadyFetched) {
                rankText.innerHTML = err;
            }
        } else {
            AlreadyFetched = true;
                HenrikAPIJSON = player;
                if(player.currenttierpatched !== null)
                    rankText.innerHTML = `${player.currenttierpatched}: ${player.ranking_in_tier}pts`;
                else
                    rankText.innerHTML = "No rank";

                getValorantAPImage(player.currenttier, function (image) {
                    rankImage.src = image;
                });
        }
    });
}

var getHenrikAPI = function (callback) {
    getJSON(`${apiURL}/${region}/${user}`, function (err, data) {
        if (err != null) {
            callback("Not Found");
        } else {
            callback(null, data.data);
        }
    });
}

var getValorantAPImage = function (nTier, callback) {
    if(ValAPImageJSON === null){
        getJSON("https://valorant-api.com/v1/competitivetiers", function (err, data) {
            if (err != null) {
                callback(defaultImage);
            }
            else {
                ValAPImageJSON = data;
                selectImage(data, nTier, callback);
            }
        });
    }
    else{
        selectImage(ValAPImageJSON, nTier, callback);
    }
}

var selectImage = function (data, nTier, callback){
    var already = false;
    var currentdata = data.data[Object.keys(data.data).length - 1]["tiers"];
    currentdata.forEach(tier => {
        if (nTier === tier.tier) {
            callback(tier.smallIcon);
            already = true;
        }
    });
    if (already === false) {
        callback(defaultImage);
    }
}

var getJSON = function (url, callback) {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';

    xhr.onload = function () {

        var status = xhr.status;

        if (status == 200) {
            callback(null, xhr.response);
        } else {
            callback(status);
        }
    };

    xhr.send();
};