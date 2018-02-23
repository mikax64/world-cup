import { Component, OnInit } from '@angular/core';
import { WorldcupService } from '../worldcup.service';
import { KnockoutInfo } from '../knockout-info';

@Component({
  selector: 'app-knockout',
  templateUrl: './knockout.component.html',
  styleUrls: ['./knockout.component.css']
})
export class KnockoutComponent implements OnInit {
  groupArray: object;
  dataWorldcup: any;

  knockoutData: any;
  knockoutInfo: KnockoutInfo;
  knockoutArray: KnockoutInfo[] = [];

  constructor(private _worldcupService: WorldcupService) { }

  ngOnInit() {
    this.dataWorldcup = this._worldcupService.apiwc;
    this.groupArray = this._worldcupService.groupData;
    this.knockoutData = this._worldcupService.knockoutData;
    this.initKnockout();
    this.initScores();
  }
    // Create knockout Array

  initKnockout() {

    for (var i = 0; i < 5; i++) { // 5 is the number of knockouts (16th,8th...)
      let roundName = Object.keys(this.knockoutData)[i];


      for (var j = 0; j < this.knockoutData[roundName].matches.length; j++) {
        this.knockoutInfo = new KnockoutInfo;
        this.knockoutInfo.name = this.knockoutData[roundName].matches[j].name;
        this.knockoutInfo.winner = null;
        this.knockoutArray.push(this.knockoutInfo);
      }

    }

  }

  initScores() {
    for (var i = 0; i < 5; i++) {
        let roundName = Object.keys(this.dataWorldcup.knockout)[i];

        for (var j = 0; j < this.dataWorldcup.knockout[roundName].matches.length; j++) {
            let matchData = this.dataWorldcup.knockout[roundName].matches[j];
          if(roundName =="round_16"){
            matchData.home_result = 0;
            matchData.away_result = 0;
          }else{
            matchData.home_result = null;
            matchData.away_result = null;
          }
            
        }
    }   
}

// Test to active scores and enable input
activeScore(teamHome, teamAway){
  if(teamHome == null || teamAway == null){
    
    return true;
  }
  return false;
}
  getTeamName(team, matchName) {
    // for the 16 round
    if (typeof team == "string") {
      let groupName = team.substr(team.length - 1);
      if (team.indexOf("winner") !== -1) { //if winner
        return this.groupArray[groupName][0].name;
      } else { // if runner
        return this.groupArray[groupName][1].name;
      }

      // for others rounds
    } else {
      for (var j = 0; j < this.knockoutArray.length; j++) {
        if (matchName == this.knockoutArray[j].name) {

          for (var k = 0; k < this.knockoutArray.length; k++) {
            if (team == this.knockoutArray[k].name) {
              return this.knockoutArray[k].winner
            }
          }
        }
      }


    }

  }



  calculKnockout(roundName, matchName) {

    // Calcul  winner
    for (var i = 0; i < roundName.matches.length; i++) {
      if (matchName == roundName.matches[i].name) {
        let matchResult = 0;
        let matchData = roundName.matches[i];

        let homeResult = matchData.home_result;
        let awayResult = matchData.away_result;
        let homeTeam = matchData.home_team;
        let awayTeam = matchData.away_team;

        matchResult = homeResult - awayResult;

        if (roundName.name == "Round of 16") {
          let groupNameHome = homeTeam.substr(homeTeam.length - 1);
          let groupNameAway = awayTeam.substr(awayTeam.length - 1);

          homeTeam = this.groupArray[groupNameHome][0].name;
          awayTeam = this.groupArray[groupNameAway][1].name;

        } 
        else if (roundName.name == "Semi-finals") {
          for (var j = 0; j < this.knockoutArray.length; j++) {

            
            if (homeTeam == this.knockoutArray[j].name) {
              homeTeam = this.knockoutArray[j].winner;
            }
            if (awayTeam == this.knockoutArray[j].name) {
              awayTeam = this.knockoutArray[j].winner;
            }
          }

        }     
        
        else {

          for (var j = 0; j < this.knockoutArray.length; j++) {
            if (homeTeam == this.knockoutArray[j].name) {
              homeTeam = this.knockoutArray[j].winner;
            }
            if (awayTeam == this.knockoutArray[j].name) {
              awayTeam = this.knockoutArray[j].winner;
            }
          }

        }


        // Push winner name in Array
        for (var j = 0; j < this.knockoutArray.length; j++) {
          if (matchName == this.knockoutArray[j].name) {

            if (matchResult > 0) {
              this.knockoutArray[j].winner = homeTeam;
            } else if (matchResult < 0) {
              this.knockoutArray[j].winner = awayTeam;
            } else {
              this.knockoutArray[j].winner = null;
            }
          }

        }
      }
    }

  }

  // Get the winner if draw

  winnerDraw(matchName, teamName) {

    for (var j = 0; j < this.knockoutArray.length; j++) {
      if (matchName == this.knockoutArray[j].name) {
        this.knockoutArray[j].winner = teamName;
      }
    }
  }

  // Get the class winner
  isWinner(matchName) {
    for (var j = 0; j < this.knockoutArray.length; j++) {
      if (matchName == this.knockoutArray[j].name) {
        return this.knockoutArray[j].winner;
      }
    }

  }

}
