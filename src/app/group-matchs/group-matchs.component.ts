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
        
       // reset scores and init groups only at the first loading
        if(this._worldcupService.firstLoading == true){
            this.initGroups();
            this.resetScores();
            this._worldcupService.firstLoading = false;
        }
        
        
        
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
            this._worldcupService.calculRanking();

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


    

        


}
