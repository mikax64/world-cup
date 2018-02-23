import { Injectable } from '@angular/core';
import { APIWC } from './mock-teams';


@Injectable()
export class WorldcupService {
  public apiwc : any;
  public teamsData : any;
  public groupData : any;
  public knockoutData : any;


  constructor() {
    this.apiwc = APIWC[0];
    this.teamsData = APIWC[0].teams;
    this.knockoutData = APIWC[0].knockout;
    this.groupData ={};

   }

 

}
