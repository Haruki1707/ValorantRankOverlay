async function OnLoadWL() {
    W_L_Text = document.getElementById("W_L_Text");
    
    tempNWins = getCookie('nWins');
    if(tempNWins != null){
        nWins = parseInt(tempNWins);
    }

    tempNLosts = getCookie('nLosts');
    if(tempNLosts != null){
        nLosses = parseInt(tempNLosts);
    }
    
    OnLoadCommon();

    setTimeout(function() {
        getWinLose();
        setInterval(getWinLose, refreshSeconds * 1000);
    }, 5000);
}

function updateText(customText = null){
    if(customText == null){
        W_L_Text.innerHTML = `W: ${nWins} L: ${nLosses}`;
    }
    else{
        W_L_Text.innerHTML = customText;
    }
}

function getWinLose(){
    console.log("Refreshing matches");
    getLatestMacth().then(function (latestMatch){
        if(latestMatch == null){
            updateText('No competitive matches found');
            return;
        }

        var currentUID = latestMatch['metadata']['matchid'];

        if(fetchedtUID != currentUID && latestMatch != false){
            
            var thisPlayerData = null;
            latestMatch['players']['all_players'].forEach(player => {
                if((`${player['name']}/${player['tag']}`) == user){
                    thisPlayerData = player;
                }
            });
            
            if(thisPlayerData != null && fetchedtUID != null){
                var thisTeamKey = thisPlayerData['team'].toLowerCase();
                var enemyTeamKey = thisTeamKey == 'red' ? 'blue' : 'red';

                var thisPlayerTeam = latestMatch['teams'][thisTeamKey];
                var thisPlayerEnemyTeam = latestMatch['teams'][enemyTeamKey]
                if(thisPlayerTeam['has_won'] == true && thisPlayerEnemyTeam['has_won'] == false){
                    nWins++;
                    setCookie('nWins', nWins, 5);
                }
                else if(thisPlayerTeam['has_won'] == false && thisPlayerEnemyTeam['has_won'] == true){
                    nLosses++;
                    setCookie('nLosts', nLosses, 5);
                }
            }
            
            fetchedtUID = currentUID;
            updateText();
        }
    });
}

async function getLatestMacth(){
    var jsonData = await getJSONFromURL(`${apiMatchesURL}/${region}/${user}?filter=competitive`);
    if(jsonData['status'] == 200){
        AlreadyFetched = true;
        return jsonData['data'][0];
    }
    else if(AlreadyFetched == false){
        updateText('Error: ' + jsonData['message']);
    }
    return false;
}
