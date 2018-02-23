import { Pipe, PipeTransform } from '@angular/core';
import { TeamInfo } from './team-info';

@Pipe({
  name: 'sortRanking',
  pure: false
})
export class SortRankingPipe implements PipeTransform {

  transform(array: Array<TeamInfo>): Array<TeamInfo> {
    // first sort by difference
    array.sort((a: TeamInfo, b: TeamInfo) => {
      if (a.difference < b.difference) {
        return 1;
      } else if (a.difference > b.difference) {
        return -1;
      } else {
        return 0;
      }
    });
    // then sort by points
    array.sort((a: TeamInfo, b: TeamInfo) => {
      if (a.points < b.points) {
        return 1;
      } else if (a.points > b.points) {
        return -1;
      } else {
        return 0;
      }
    });
    return array;

  }

}
