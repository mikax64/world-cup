import { Component, OnInit } from '@angular/core';
import { TeamInfo } from '../team-info';
import { WorldcupService } from '../worldcup.service';


@Component({
    selector: 'app-group-matchs',
    templateUrl: './group-matchs.component.html',
    styleUrls: ['./group-matchs.component.css']
})
export class GroupMatchsComponent implements OnInit {

    dataWorldcup : any;
    teamsArray : any;

    teamInfo: TeamInfo;
    teamsInfoArray: TeamInfo[] = [];
    groupArray : object;

    constructor(private _worldcupService: WorldcupService) {}

    ngOnInit() {
        this.dataWorldcup = this._worldcupService.apiwc;
        this.teamsArray  = this._worldcupService.teamsData;
        this.groupArray = this._worldcupService.groupData;
        this.initGroups();
        this.resetScores();
    }


    initGroups() {

        // Create an array of teams infos
        for (var i = 0; i < this.teamsArray.length; i++) {
            this.teamInfo = new TeamInfo;
            this.teamInfo.id = this.teamsArray[i].id;
            this.teamInfo.name = this.teamsArray[i].name;
            this.teamInfo.points = 3;
            this.teamInfo.difference = 0;
            this.teamsInfoArray.push(this.teamInfo);
        }

        // Create an object of group with teams
        for (var i = 0; i < 8; i++) {
            let groupName = Object.keys(this.dataWorldcup.groups)[i];
            let splitGroup = this.teamsInfoArray.slice(i * 4, i * 4 + 4);
            this.groupArray[groupName] = splitGroup;
        }

    }

    resetScores() {
        for (var i = 0; i < 8; i++) {
            let groupName = Object.keys(this.dataWorldcup.groups)[i];

            for (var j = 0; j < 6; j++) {
                let matchData = this.dataWorldcup.groups[groupName].matches[j];

                matchData.home_result = 0;
                matchData.away_result = 0;
            }
            this.calculRanking(groupName);

            this.groupArray[groupName].sort(this.resetArray);
        }   
    }
    resetArray(a,b) {
        if (a.id < b.id)
          return -1;
        if (a.id > b.id)
          return 1;
        return 0;
      }

    getGroupName(index) {
        return Object.keys(this.dataWorldcup.groups)[index];
    }

    getTeamName(teamId) {

        for (var i = 0; i < this.teamsArray.length; i++) {
            if (this.teamsArray[i].id === teamId) {
                return this.teamsArray[i].name;
            }
        }
    }

    getTeamTag(teamId) {

        for (var i = 0; i < this.teamsArray.length; i++) {
            if (this.teamsArray[i].id === teamId) {
                return this.teamsArray[i].iso2;
                
            }
        }
    }


    calculRanking(groupName) {

        let currentGroup = this.groupArray[groupName];

        // reset points and difference to 0
        for (var k = 0; k < 4; k++) {
            currentGroup[k].points = 0;
            currentGroup[k].difference = 0;
        }

        for (var i = 0; i < 6; i++) { // 6 is the number of matches
            let matchResult = 0;
            
            let matchData = this.dataWorldcup.groups[groupName].matches[i];
           
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

    }


}
