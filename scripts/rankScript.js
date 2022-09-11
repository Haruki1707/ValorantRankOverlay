function OnLoadRank() {
    rankText = document.getElementById("rankText");
    rankImage = document.getElementById("rankImage");
    OnLoadCommon();

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
                if(player.currenttierpatched !== null && player.old != true){
                    rankText.innerHTML = `${player.currenttierpatched}: ${player.ranking_in_tier}pts`;
                    getValorantAPImage(player.currenttier, function (image) {
                        rankImage.src = image;
                    });

                    //WomboCombo code xd
                    if(user.includes("Outshot")){
                        document.getElementById("womboText").innerHTML = "Buena Out :|"
                    }
                }
                else{
                    rankText.innerHTML = "No rank";
                    rankImage.src = defaultImage;   
                }

        }
    });
}

var getHenrikAPI = function (callback) {
    getJSON(`${apiRankURL}/${region}/${user}`, function (err, data) {
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
