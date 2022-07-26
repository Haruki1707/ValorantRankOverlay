const urlParams = new URLSearchParams(window.location.search);
const apiURL = "https://api.henrikdev.xyz/valorant/v3/matches";
var fetchedtUID = null; var nWins = 0; var nLost = 0;
var W_L_Text; var region; var user; var refreshSeconds = 30; var AlreadyFetched = false;

async function OnLoadWL() {
    W_L_Text = document.getElementById("W_L_Text");
    region = urlParams.get('region');
    user = urlParams.get('user');

    if (urlParams.get('refreshRate') != null) {
        refreshSeconds = urlParams.get('refreshRate');
    }

    getWinLose();
    setInterval(getWinLose, refreshSeconds * 1.25 * 1000);
}

function updateText(customText = null){
    if(customText == null){
        W_L_Text.innerHTML = `W: ${nWins} L: ${nLost}`;
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
                }
                else if(thisPlayerTeam['has_won'] == false && thisPlayerEnemyTeam['has_won'] == true){
                    nLost++;
                }
            }
            
            fetchedtUID = currentUID;
            updateText();
        }
    });
}

async function getLatestMacth(){
    var jsonData = await getMatchHistory();
    if(jsonData['status'] == 200){
        return jsonData['data'][0];
    }
    else{
        updateText('Error: ' + jsonData['message']);
    }
    return false;
}

async function getMatchHistory(){
    var response = await fetch(`${apiURL}/${region}/${user}?filter=competitive`);
    return await response.json();
}
