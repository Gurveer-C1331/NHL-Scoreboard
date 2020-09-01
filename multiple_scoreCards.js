url = "https://statsapi.web.nhl.com"

function drawHTML(div, count) {
  var scoreCard_listItem = document.createElement("li");
  var scoreCard_div = document.createElement("div");
  scoreCard_div.innerHTML =
`<div class="scoreboard-card">
  <div class="status away-status" id="away-status-`+count+`"></div>
  <span class="status-text away-status-text" id="away-status-text-`+count+`"></span>
  <div class="score-card">
    <div class="team">
      <img class="team-logo" id="away-logo-`+count+`" src="/Toronto_Maple_Leafs.svg" alt="">
      <span class="team-name" id="away-name-`+count+`">TOR</span>
      <span class="record preview-`+count+`" id="away-record-`+count+`">20-10-5</span>
      <span class="sog no-preview-`+count+`" id="away-shots-`+count+`">8 SOG</span>
    </div>

    <div class="game-info">
      <div class="top-info">
        <span class="playoff-`+count+` game-number" id="game-number-`+count+`">GAME 3</span>
        <span class="playoff-`+count+` series-status" id="series-status-`+count+`">MTL LEADS 2-1</span>
        <span class="game-type" id="game-type-`+count+`">1ST ROUND</span>
      </div>
      <div class="middle-info">
        <span class="start-time preview-`+count+`" id="start-time-`+count+`">8:00 PM</span>
        <div class="scoreboard no-preview-`+count+`">
          <span class="score" id="away-score-`+count+`">2</span>
          <div class="game-time live-`+count+`">
            <span class="period" id="period-`+count+`">1ST</span>
            <span class="time" id="time-`+count+`">12:42</span>
          </div>
          <span class="final-`+count+` final-text" id="final-`+count+`">FINAL</span>
          <span class="score" id="home-score-`+count+`">3</span>
        </div>
      </div>
      <div class="bottom-info">
        <span class="broadcast-text preview-`+count+`" id="broadcast-text-`+count+`"></span>
        <span class="venue-text preview-`+count+`" id="venue-text-`+count+`"></span>
        <span class="goal-info live-`+count+`" id="goal-info-`+count+`"></span>
        <span class="goal-scorer live-`+count+`" id="goal-scorer-`+count+`"></span>
        <span class="goalie-win goalie final-`+count+`" id="goalie-win-`+count+`"></span>
        <span class="goalie-loss goalie final-`+count+`" id="goalie-loss-`+count+`"></span>
      </div>
    </div>

    <div class="team">
      <img class="team-logo" id="home-logo-`+count+`" src="/Montreal_Canadiens.svg" alt="">
      <span class="team-name" id="home-name-`+count+`">MTL</span>
      <span class="record preview-`+count+`" id="home-record-`+count+`">25-5-5</span>
      <span class="sog no-preview-`+count+`" id="home-shots-`+count+`">10 SOG</span>
    </div>
  </div>
  <span class="status-text home-status-text" id="home-status-text-`+count+`"></span>
  <div class="status home-status" id="home-status-`+count+`"></div>
</div>`;
  scoreCard_listItem.appendChild(scoreCard_div);
  div.appendChild(scoreCard_listItem);
}

async function getScore() {
  const date_selected = "";
  const scoreCard_list  = document.getElementById("score-card-list")
  //getting schedule data for current day
  const schedule_response = await axios.get(url+"/api/v1/schedule?hydrate=team,linescore,broadcasts(all),game(seriesSummary),scoringplays,decisions&site=en_nhlCA&teamId=&gameType=&date="+date_selected);
  const schedule_data = schedule_response.data;
  var day_data = schedule_data["dates"][0]; //first day object
  var games = day_data["games"]; //list of game objects

  for (var count = 0; count < games.length; count++) {
    var game = games[count];
    var season = game["season"];
    //create html scorecard (allows drawHTML to happen once)
    if (scoreCard_list.children.length < games.length) {
      drawHTML(scoreCard_list, count);
    }
    //html elements
    var date = document.getElementById("date");
    //away team
    var away_logo = document.getElementById("away-logo-"+count);
    var away_name = document.getElementById("away-name-"+count);
    var away_record = document.getElementById("away-record-"+count);
    var away_shots = document.getElementById("away-shots-"+count);
    var away_score = document.getElementById("away-score-"+count);
    var away_status = document.getElementById("away-status-"+count);
    var away_status_text = document.getElementById("away-status-text-"+count);
    //home team
    var home_logo = document.getElementById("home-logo-"+count);
    var home_name = document.getElementById("home-name-"+count);
    var home_record = document.getElementById("home-record-"+count);
    var home_shots = document.getElementById("home-shots-"+count);
    var home_score = document.getElementById("home-score-"+count);
    var home_status = document.getElementById("home-status-"+count);
    var home_status_text = document.getElementById("home-status-text-"+count);
    //game stats
    var game_type = document.getElementById("game-type-"+count);
    var series_game_number = document.getElementById("game-number-"+count);
    var series_status = document.getElementById("series-status-"+count);
    var start_time = document.getElementById("start-time-"+count);
    var period = document.getElementById("period-"+count);
    var game_time = document.getElementById("time-"+count);
    var final_text = document.getElementById("final-"+count);
    //extra information
    var broadcast_text = document.getElementById("broadcast-text-"+count);
    var venue_text = document.getElementById('venue-text-'+count);
    var goal_info_text = document.getElementById('goal-info-'+count);
    var goal_scorer_text = document.getElementById('goal-scorer-'+count);
    var goalie_win_text = document.getElementById('goalie-win-'+count);
    var goalie_loss_text = document.getElementById('goalie-loss-'+count);
    //elements
    var preview_elements = document.getElementsByClassName("preview-"+count);
    var no_preview_elements = document.getElementsByClassName("no-preview-"+count);
    var live_elements = document.getElementsByClassName("live-"+count);
    var final_elements = document.getElementsByClassName("final-"+count);
    var playoff_elements = document.getElementsByClassName("playoff-"+count);
    var no_playoff_elements = document.getElementsByClassName("no-playoff-"+count);

    var game_link = game["link"]; //link to games live feed
    var startTime = game["gameDate"]; //game date time
    var gameState = game["status"]["detailedState"]; //game state
    var gameDate = new Date(startTime); //game Date object
    date.innerHTML = gameDate.toDateString().substring(0,10).toUpperCase();
    var gamePk = game["gamePk"]; //gamePk or gameId
    var gameType = game["gameType"]; //game type
    var gameStatus = game["status"]["abstractGameState"];
    var linescore = game["linescore"]; //linescore data
    //team objects (liveGame data)
    var home_team = game["teams"]["home"];
    var away_team = game["teams"]["away"];
    //team records (schedule data)
    var home_leagueRecord = home_team["leagueRecord"];
    var away_leagueRecord = away_team["leagueRecord"];
    home_record.innerHTML = home_leagueRecord["wins"]+"-"+home_leagueRecord["losses"]+"-"+home_leagueRecord["ot"]
    away_record.innerHTML = away_leagueRecord["wins"]+"-"+away_leagueRecord["losses"]+"-"+away_leagueRecord["ot"]

    //setting the team names, logos, shots, score
    away_name.innerHTML = away_team["team"]["abbreviation"];
    away_logo.src = "https://www-league.nhlstatic.com/images/logos/teams-20192020-light/"+away_team["team"]["id"]+".svg";
    away_score.innerHTML = linescore["teams"]["away"]["goals"];
    away_shots.innerHTML = linescore["teams"]["away"]["shotsOnGoal"]+" SOG";
    home_name.innerHTML = home_team["team"]["abbreviation"];
    home_logo.src = "https://www-league.nhlstatic.com/images/logos/teams-20192020-light/"+home_team["team"]["id"]+".svg";
    home_score.innerHTML = linescore["teams"]["home"]["goals"];
    home_shots.innerHTML = linescore["teams"]["home"]["shotsOnGoal"]+" SOG";

    //setting the extra information
    venue_text.innerHTML = game["venue"]["name"];
    var broadcasts = "";
    for (var broadcast of game["broadcasts"]) {
      broadcasts = broadcasts + broadcast["name"] + ", ";
    }
    broadcast_text.innerHTML = broadcasts.slice(0, -2);
    if (game["scoringPlays"].length != 0) {
      var latest_goal = game["scoringPlays"][game["scoringPlays"].length-1];
      goal_info_text.innerHTML = "GOAL" + " - " + latest_goal["about"]["ordinalNum"] + " " + latest_goal["about"]["periodTime"];
      goal_scorer_text.innerHTML = latest_goal["players"][0]["player"]["fullName"];
    }
    if (gameStatus == "Final") {
      goalie_win_text.innerHTML = "W "+ game["decisions"]["winner"]["fullName"].toUpperCase();
      goalie_loss_text.innerHTML = "L "+ game["decisions"]["loser"]["fullName"].toUpperCase();
    }

    //checking goalie pulled
    var home_goaliePulled = linescore["teams"]["home"]["goaliePulled"];
    var away_goaliePulled = linescore["teams"]["away"]["goaliePulled"];
    //checking power play
    var home_powerPlay = linescore["teams"]["home"]["powerPlay"];
    var away_powerPlay = linescore["teams"]["away"]["powerPlay"];
    //home team status
    if (home_goaliePulled) {
      home_status.style.backgroundColor = "#E9E9E9";
      home_status_text.style.color = "#E9E9E9";
      home_status_text.innerHTML = "EN";
    }
    else if (home_powerPlay) {
      home_status.style.backgroundColor = "#DE0000";
      home_status_text.style.color = "#DE0000";
      home_status_text.innerHTML = "PP";
    }
    else {
      home_status.style.backgroundColor = "#E9E9E9";
      home_status_text.innerHTML = "";
    }
    //away team status
    if (away_goaliePulled) {
      away_status.style.backgroundColor = "#E9E9E9";
      away_status_text.style.color = "#E9E9E9";
      away_status_text.innerHTML = "EN";
    }
    else if (away_powerPlay) {
      away_status.style.backgroundColor = "#DE0000";
      away_status_text.style.color = "#DE0000";
      away_status_text.innerHTML = "PP";
    }
    else {
      away_status.style.backgroundColor = "#E9E9E9";
      away_status_text.innerHTML = "";
    }

    //checking game status
    if (gameStatus == "Preview") { //game not started yet
      for (var element of preview_elements) {element.classList.remove("hide");}
      for (var element of no_preview_elements) {element.classList.add("hide");}
      for (var element of live_elements) {element.classList.add("hide");}
      for (var element of final_elements) {element.classList.add("hide");}
      //check if game is postponed
      if (gameState != "Postponed") {
        var time = gameDate.toLocaleTimeString().split(":");
        start_time.innerHTML = time[0]+":"+time[1]+" PM";
        console.log(time[0]+":"+time[1], "PM");
      }
      else {
        start_time.innerHTML = "PPD"
        console.log("PPD");
      }
    }
    else if (gameStatus == "Live") { //game has started
      for (var element of preview_elements) {element.classList.add("hide");}
      for (var element of no_preview_elements) {element.classList.remove("hide");}
      for (var element of live_elements) {element.classList.remove("hide");}
      for (var element of final_elements) {element.classList.add("hide");}
      period.innerHTML = linescore["currentPeriodOrdinal"]; 
      game_time.innerHTML = linescore["currentPeriodTimeRemaining"]; 
      console.log(linescore["currentPeriodOrdinal"], linescore["currentPeriodTimeRemaining"]);
    } 
    else { //game has ended
      for (var element of preview_elements) {element.classList.add("hide");}
      for (var element of no_preview_elements) {element.classList.remove("hide");}
      for (var element of live_elements) {element.classList.add("hide");}
      for (var element of final_elements) {element.classList.remove("hide");}
      home_status_text.classList.add("hide");
      away_status_text.classList.add("hide");
      //setting the final text
      if (linescore["currentPeriodOrdinal"] != "3rd") {
        final_text.innerHTML = "FINAL/"+linescore["currentPeriodOrdinal"];
      }
      else {
        final_text.innerHTML = "FINAL";
      }
      //setting win status for winning team
      if (home_score.innerHTML > away_score.innerHTML) {
        home_status.style.backgroundColor = "#00EC00";
        away_status.style.backgroundColor = "#FAFAFA";
      }
      else {
        home_status.style.backgroundColor = "#FAFAFA";
        away_status.style.backgroundColor = "#00EC00";
      }
      console.log("FINAL");
    }

    console.log(away_team["team"]["name"], linescore["teams"]["away"]["goals"]);
    console.log(home_team["team"]["name"], linescore["teams"]["home"]["goals"]);
    console.log();

    //setting game type
    const gameType_response = await axios.get("https://statsapi.web.nhl.com/api/v1/gameTypes");
    const gameType_data = gameType_response.data;
    for (var type of gameType_data) {
      if (gameType == type["id"]) {
        game_type.innerHTML = type["description"].toUpperCase();
      }
    }
    //for playoff game
    if (gameType == "P") {
      var series_data = game["seriesSummary"];
      series_game_number.innerHTML = series_data["gameLabel"].toUpperCase();
      series_status.innerHTML = series_data["seriesStatusShort"].toUpperCase();
      for (var element of no_playoff_elements) {element.classList.add("hide");}
    }
    else { //for non playoff games
      for (var element of playoff_elements) {element.classList.add("hide");}
    }
  }
}

getScore();
setInterval(getScore, 15000);