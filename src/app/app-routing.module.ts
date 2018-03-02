import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { KnockoutComponent } from './knockout/knockout.component';
import { GroupMatchsComponent } from './group-matchs/group-matchs.component';


const routes: Routes = [
  { path: '', redirectTo: '/group', pathMatch: 'full' },
  { path: 'group', component: GroupMatchsComponent },
  { path: 'knockout', component: KnockoutComponent }
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}