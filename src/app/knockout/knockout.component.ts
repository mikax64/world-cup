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
  teamsArray : any;

   knockoutData: any;
   knockoutInfo: KnockoutInfo;
   knockoutArray: KnockoutInfo[];

  constructor(private _worldcupService: WorldcupService) { }

  ngOnInit() {
    this.dataWorldcup = this._worldcupService.apiwc;
    this.groupArray = this._worldcupService.groupData;
    this.knockoutData = this._worldcupService.knockoutData;
    this.teamsArray  = this._worldcupService.teamsData;
    this.knockoutArray = this._worldcupService.knockoutArrayService;
    this.initKnockout();
    //this.initScores();
  }
    // Create knockout Array

  initKnockout() {

    for (var i = 0; i < 4; i++) { // 4 is the number of knockouts (16th,8th...)
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
    for (var i = 0; i < 4; i++) {
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

 

    


// updateKnockout(winnerTeam?) {

//     // Calcul  winner
//     for (var i = 0; i < 4; i++) {
//       let roundName = Object.keys(this.dataWorldcup.knockout)[i];
//       for (var j = 0; j < this.dataWorldcup.knockout[roundName].matches.length; j++) {


//         let matchResult = 0;
//         let matchData = this.dataWorldcup.knockout[roundName].matches[j];

//         let homeResult = matchData.home_result;
//         let awayResult = matchData.away_result;
//         let homeTeam = matchData.home_team;
//         let awayTeam = matchData.away_team;

        
        

//         // Put the score 0 to the other input
//         if(homeResult == null && awayResult!= null){
   
//           matchData.home_result = 0;
//         }
//         if(awayResult == null && homeResult!= null){
//           matchData.away_result = 0;
//         }
        
//         matchResult = homeResult - awayResult;

        
//         // Transform team(winner_a, 49...) to name
//         if (roundName == "round_16") {
//           let groupNameHome = homeTeam.substr(homeTeam.length - 1);
//           let groupNameAway = awayTeam.substr(awayTeam.length - 1);

//           homeTeam = this.groupArray[groupNameHome][0].name;
//           awayTeam = this.groupArray[groupNameAway][1].name;
          
//         } 
//         else {

//           for (var k = 0; k < this.knockoutArray.length; k++) {
//             if (homeTeam == this.knockoutArray[k].name) {
//               homeTeam = this.knockoutArray[k].winner;
//             }
//             if (awayTeam == this.knockoutArray[k].name) {
//               awayTeam = this.knockoutArray[k].winner;
//             }
            
//           }

//         }
        
//         // Push winner name in Array
//         for (var k = 0; k < this.knockoutArray.length; k++) {

//           if (matchData.name == this.knockoutArray[k].name) {
    
//             if (matchResult > 0) {
//               this.knockoutArray[k].winner = homeTeam;
              
//             } else if (matchResult < 0) {
//               this.knockoutArray[k].winner = awayTeam;
//             }else if(homeResult!= null && matchResult == 0 ){
//               if(homeTeam == winnerTeam || awayTeam == winnerTeam){
//                 this.knockoutArray[k].winner = winnerTeam;
//               }
              
//             }
//           }

//         }
//       console.log(this.knockoutArray);
//     }
//   }
  

//   }

  // Get team tag for knockout

  getTeamTag(teamName) {

    for (var i = 0; i < this.teamsArray.length; i++) {
        if (this.teamsArray[i].name === teamName) {
            return this.teamsArray[i].iso2;
            
        }
    }
}

  // Get the winner if draw

  winnerDraw(matchName, teamName) {

    for (var j = 0; j < this.knockoutArray.length; j++) {
      
      if (matchName == this.knockoutArray[j].name) {
        this.knockoutArray[j].winner = teamName;
        this._worldcupService.updateKnockout(teamName);
      }
      
    }
    
    
    
  }


  testClass(matchName, teamName,teamResult){

    for (var j = 0; j < this.knockoutArray.length; j++) {
      
      if (matchName == this.knockoutArray[j].name) {

        if(teamName == this.knockoutArray[j].winner){
          return "is-winner";
        }else if(teamName != this.knockoutArray[j].winner && this.knockoutArray[j].winner!=null){
          return "is-looser"
        }
      }
      
    }
    

  }

}
