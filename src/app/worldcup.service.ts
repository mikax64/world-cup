import { Injectable } from '@angular/core';
import { APIWC } from './mock-teams';

@Injectable()
export class WorldcupService {
  public apiwc : any;
  public teamsData : any;
  public groupData : any;
  public knockoutData : any;

  public firstLoading : boolean;


  public knockoutArrayService: any;


  constructor() {
    this.apiwc = APIWC[0];
    this.teamsData = APIWC[0].teams;
    this.knockoutData = APIWC[0].knockout;
    this.groupData ={};
    this.knockoutArrayService = [];
    this.firstLoading = true;
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
        if(homeResult == null && awayResult!= null){
   
          matchData.home_result = 0;
        }
        if(awayResult == null && homeResult!= null){
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
        
            }else if(homeResult!= null &&  awayResult!= null && matchResult == 0 ){
              
              if(homeTeam == winnerTeam || awayTeam == winnerTeam){
                this.knockoutArrayService[k].winner = winnerTeam;
              }
              if(homeTeam != winnerTeam && awayTeam != winnerTeam && homeTeam !=this.knockoutArrayService[k].winner && awayTeam !=this.knockoutArrayService[k].winner && this.knockoutArrayService[k].winner!= null){
                this.knockoutArrayService[k].winner = homeTeam;
              }
              
            
              
              
            }
          }

        }
        
    }
  }

}



}
