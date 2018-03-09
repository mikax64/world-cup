import { Injectable } from '@angular/core';
import { APIWC } from './mock-teams';

@Injectable()
export class WorldcupService {
  public apiwc: any;
  public teamsData: any;
  public groupData: any;
  public knockoutData: any;

  public firstLoading: boolean;


  public knockoutArrayService: any;


  constructor() {
    this.apiwc = APIWC[0];
    this.teamsData = APIWC[0].teams;
    this.knockoutData = APIWC[0].knockout;
    this.groupData = {};
    this.knockoutArrayService = [];
    this.firstLoading = true;
  }


  resetKnockout() {
    for (var i = 0; i < 4; i++) {
      let roundName = Object.keys(this.apiwc.knockout)[i];

      for (var j = 0; j < this.apiwc.knockout[roundName].matches.length; j++) {
        let matchData = this.apiwc.knockout[roundName].matches[j];
        matchData.home_result = null;
        matchData.away_result = null;
      }

    }

    for (var k = 0; k < this.knockoutArrayService.length; k++) {
      this.knockoutArrayService[k].winner = null;
    }
  }


  updateKnockout(winnerTeam?) {

    // Calcul  winner
    for (var i = 0; i < 4; i++) {
      let roundName = Object.keys(this.apiwc.knockout)[i];
      for (var j = 0; j < this.apiwc.knockout[roundName].matches.length; j++) {


        let matchResult = 0;
        let matchData = this.apiwc.knockout[roundName].matches[j];

        let homeResult = matchData.home_result;
        let awayResult = matchData.away_result;
        let homeTeam = matchData.home_team;
        let awayTeam = matchData.away_team;

        // Put the score 0 to the other input
        if (homeResult == null && awayResult != null) {

          matchData.home_result = 0;
        }
        if (awayResult == null && homeResult != null) {
          matchData.away_result = 0;
        }

        matchResult = homeResult - awayResult;

        // Transform team(winner_a, 49...) to name
        if (roundName == "round_16") {
          let groupNameHome = homeTeam.substr(homeTeam.length - 1);
          let groupNameAway = awayTeam.substr(awayTeam.length - 1);

          homeTeam = this.groupData[groupNameHome][0].name;
          awayTeam = this.groupData[groupNameAway][1].name;

        }
        else {

          for (var k = 0; k < this.knockoutArrayService.length; k++) {

            if (homeTeam == this.knockoutArrayService[k].name) {

              homeTeam = this.knockoutArrayService[k].winner;

            }
            if (awayTeam == this.knockoutArrayService[k].name) {
              awayTeam = this.knockoutArrayService[k].winner;

            }

          }

        }


        // Push winner name in Array
        for (var k = 0; k < this.knockoutArrayService.length; k++) {

          if (matchData.name == this.knockoutArrayService[k].name) {


            if (matchResult > 0) {
              this.knockoutArrayService[k].winner = homeTeam;

            } else if (matchResult < 0) {
              this.knockoutArrayService[k].winner = awayTeam;

            } else if (homeResult != null && awayResult != null && matchResult == 0) {

              if (homeTeam == winnerTeam || awayTeam == winnerTeam) {
                this.knockoutArrayService[k].winner = winnerTeam;
              }
              else if (homeTeam != winnerTeam && awayTeam != winnerTeam && homeTeam != this.knockoutArrayService[k].winner && awayTeam != this.knockoutArrayService[k].winner && this.knockoutArrayService[k].winner != null) {
                this.knockoutArrayService[k].winner = homeTeam;
              } else if (winnerTeam == "randomWinner") {
    
                let randomNumber = Math.abs(this.getRandom(0, 1));
                if (randomNumber == 0) {
                  this.knockoutArrayService[k].winner = homeTeam;
                } else {
                  this.knockoutArrayService[k].winner = awayTeam;
                }
              }
            }
          }

        }

      }
    }

  }
  //***** METHOD RANDOM
  getRandom(min, max) {
    return Math.round(Math.random() * (max - min + 1) + (min - .5));
  }

  //***** RESULTS KNOCKOUT RANDOM FUNCTION
  randomResultKnockout() {

    for (var i = 0; i < 4; i++) {
      let roundName = Object.keys(this.apiwc.knockout)[i];
      
      for (var j = 0; j < this.apiwc.knockout[roundName].matches.length; j++) {


        let matchData = this.apiwc.knockout[roundName].matches[j];


        let homeTeam = matchData.home_team;
        let awayTeam = matchData.away_team;
        let homeResult = matchData.home_result;
        let awayResult = matchData.away_result;
        let homeOdd = null;
        let awayOdd = null;

        
        // Transform team(winner_a, 49...) to name
        if (roundName == "round_16") {
          let groupNameHome = homeTeam.substr(homeTeam.length - 1);
          let groupNameAway = awayTeam.substr(awayTeam.length - 1);

          homeTeam = this.groupData[groupNameHome][0].name;
          awayTeam = this.groupData[groupNameAway][1].name;

        }
        else {

          for (var k = 0; k < this.knockoutArrayService.length; k++) {
            if (homeTeam == this.knockoutArrayService[k].name) {
              homeTeam = this.knockoutArrayService[k].winner;
            }
            if (awayTeam == this.knockoutArrayService[k].name) {
              awayTeam = this.knockoutArrayService[k].winner;

            }
          }
        }
        

        for (var k = 0; k < this.teamsData.length; k++) {
          if (homeTeam == this.teamsData[k].name) {
            homeOdd = this.teamsData[k].odd;
          }
          if (awayTeam == this.teamsData[k].name) {
            awayOdd = this.teamsData[k].odd;
          }
        }


        let calculOdd = homeOdd - awayOdd;
        


        if (calculOdd < 0) { // if the first have a smaller odd than second
          let oddRatio = Math.round(awayOdd / homeOdd);
          oddRatioRules(oddRatio, homeResult, awayResult, "home");
          this.updateKnockout("randomWinner");

        } else {	// if the second have a smaller odd than first
          let oddRatio = Math.round(homeOdd / awayOdd);
          oddRatioRules(oddRatio, awayResult, homeResult, "away");
          this.updateKnockout("randomWinner");
        }



        function oddRatioRules(oddRatio, favoriteResult, outsiderResult, favoriteTeam) {

          function getRandom(min, max) {
            return Math.round(Math.random() * (max - min + 1) + (min - .5));
          }


          let calculChanceWin = null;

          // calcul chance of the favorite team to win
          if (oddRatio < 10 && oddRatio > 1) {
            let calculChanceStep1 = (100 / oddRatio);
            calculChanceWin = Math.round(100 - (calculChanceStep1 - (2 * (calculChanceStep1 / 10))));
          } else if (oddRatio == 1) {
            calculChanceWin = 50;
          } else {
            calculChanceWin = 95;
          }

          // random probability to draw or win
          if (calculChanceWin < 75) {
            let drawChance = getRandom(1, 3);

            if (drawChance == 1) {
              calculScore("draw");
            } else {
              calculResult();
            }
          } else {
            calculResult();
          }

          function calculResult() {
            let calculWinner = getRandom(1, 100);

            if (calculWinner < calculChanceWin) {
              calculScore("favorite");
            } else {
              calculScore("outsider");
            }
          }


          function calculScore(result) {
            let highScore;
            let smallScore;

            if (oddRatio < 30) {
              highScore = getRandom(1, 3);
              smallScore = getRandom(0, highScore - 1);

            } else {
              highScore = getRandom(1, 4);
              smallScore = getRandom(0, highScore - 1);
            }

            let drawScore = getRandom(0, 2);


            if (result == "draw") {

              favoriteResult = drawScore;
              outsiderResult = drawScore;
              matchData.home_result = drawScore;
              matchData.away_result = drawScore;

            } else if (result == "favorite") {

              if (favoriteTeam == "home") {
                matchData.home_result = highScore;
                matchData.away_result = smallScore;
              } else {
                matchData.home_result = smallScore;
                matchData.away_result = highScore;
              }
            } else {
              if (favoriteTeam == "home") {
                matchData.home_result = smallScore;
                matchData.away_result = highScore;
              } else {
                matchData.home_result = highScore;
                matchData.away_result = smallScore;
              }
            }

          }

        }

      }


    }

    

  }





  //***** RESULTS RANDOM FUNCTION
  randomResultGroups() {

    for (var i = 0; i < 8; i++) { // 8 is the number of groups

      let groupName = Object.keys(this.apiwc.groups)[i];
      for (var j = 0; j < this.apiwc.groups[groupName].matches.length; j++) {


        let matchData = this.apiwc.groups[groupName].matches[j];


        let homeTeam = matchData.home_team;
        let awayTeam = matchData.away_team;
        let homeResult = matchData.home_result;
        let awayResult = matchData.away_result;
        let homeOdd = null;
        let awayOdd = null;

        for (var k = 0; k < this.teamsData.length; k++) {
          if (homeTeam == this.teamsData[k].id) {
            homeOdd = this.teamsData[k].odd;
          }
          if (awayTeam == this.teamsData[k].id) {
            awayOdd = this.teamsData[k].odd;
          }
        }



        let calculOdd = homeOdd - awayOdd;


        if (calculOdd < 0) { // if the first have a smaller odd than second
          let oddRatio = Math.round(awayOdd / homeOdd);
          oddRatioRules(oddRatio, homeResult, awayResult, "home");

        } else {	// if the second have a smaller odd than first
          let oddRatio = Math.round(homeOdd / awayOdd);
          oddRatioRules(oddRatio, awayResult, homeResult, "away");
        }



        function oddRatioRules(oddRatio, favoriteResult, outsiderResult, favoriteTeam) {
          //console.log(favoriteResult);

          function getRandom(min, max) {
            return Math.round(Math.random() * (max - min + 1) + (min - .5));
          }


          let calculChanceWin = null;

          // calcul chance of the favorite team to win
          if (oddRatio < 10 && oddRatio > 1) {
            let calculChanceStep1 = (100 / oddRatio);
            calculChanceWin = Math.round(100 - (calculChanceStep1 - (2 * (calculChanceStep1 / 10))));
          } else if (oddRatio == 1) {
            calculChanceWin = 50;
          } else {
            calculChanceWin = 95;
          }


          // random probability to draw or win
          if (calculChanceWin < 75) {
            let drawChance = getRandom(1, 3);

            if (drawChance == 1) {
              calculScore("draw");
            } else {
              calculResult();
            }
          } else {
            calculResult();
          }

          function calculResult() {
            let calculWinner = getRandom(1, 100);

            if (calculWinner < calculChanceWin) {
              calculScore("favorite");
            } else {
              calculScore("outsider");
            }
          }


          function calculScore(result) {
            let highScore;
            let smallScore;

            if (oddRatio < 30) {
              highScore = getRandom(1, 3);
              smallScore = getRandom(0, highScore - 1);

            } else {
              highScore = getRandom(1, 4);
              smallScore = getRandom(0, highScore - 1);
            }

            let drawScore = getRandom(0, 2);


            if (result == "draw") {

              favoriteResult = drawScore;
              outsiderResult = drawScore;
              matchData.home_result = drawScore;
              matchData.away_result = drawScore;

            } else if (result == "favorite") {

              if (favoriteTeam == "home") {
                matchData.home_result = highScore;
                matchData.away_result = smallScore;
              } else {
                matchData.home_result = smallScore;
                matchData.away_result = highScore;
              }
            } else {
              if (favoriteTeam == "home") {
                matchData.home_result = smallScore;
                matchData.away_result = highScore;
              } else {
                matchData.home_result = highScore;
                matchData.away_result = smallScore;
              }
            }

          }

        }

      }


    }
    this.calculRanking();
    this.resetKnockout();
    this.updateKnockout();
  }



  //***** CALCUL RANKING GROUP

  calculRanking() {
    for (var a = 0; a < 8; a++) {
      let groupName = Object.keys(this.apiwc.groups)[a];
      let currentGroup = this.groupData[groupName];

      // reset points and difference to 0
      for (var k = 0; k < 4; k++) {
        currentGroup[k].points = 0;
        currentGroup[k].difference = 0;
      }

      for (var i = 0; i < 6; i++) { // 6 is the number of matches
        let matchResult = 0;

        let matchData = this.apiwc.groups[groupName].matches[i];

        let homeResult = matchData.home_result;
        let awayResult = matchData.away_result;
        let homeTeam = matchData.home_team;
        let awayTeam = matchData.away_team;

        matchResult = homeResult - awayResult;

        // Calcul the points and difference

        for (var j = 0; j < currentGroup.length; j++) {

          if (currentGroup[j].id == homeTeam) {


            if (matchResult > 0) {
              currentGroup[j].points += 3;
            }

            if (matchResult == 0) {
              currentGroup[j].points += 1;
            }

            currentGroup[j].difference += matchResult;
          }

          if (currentGroup[j].id == awayTeam) {

            if (matchResult < 0) {
              currentGroup[j].points += 3;
            }
            if (matchResult == 0) {
              currentGroup[j].points += 1;
            }

            currentGroup[j].difference -= matchResult;

          }

        }

      }


    }
    this.updateKnockout();
  }






}
