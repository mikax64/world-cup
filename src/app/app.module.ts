import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, Headers, Response } from '@angular/http';

import { AppComponent } from './app.component';
import { GroupMatchsComponent } from './group-matchs/group-matchs.component';
import { KnockoutComponent } from './knockout/knockout.component';


import { KeysPipe } from './keys.pipe';
import { SortRankingPipe } from './sort-ranking.pipe';
import { WorldcupService } from './worldcup.service';
import { AppRoutingModule } from './/app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    GroupMatchsComponent,
    KnockoutComponent,
    KeysPipe,
    SortRankingPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [WorldcupService],
  bootstrap: [AppComponent]
})
export class AppModule { }
