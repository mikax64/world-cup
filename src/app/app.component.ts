import { Component } from '@angular/core';
import { WorldcupService } from './worldcup.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(private _worldcupService: WorldcupService) {}

}
