import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMatchsComponent } from './group-matchs.component';

describe('GroupMatchsComponent', () => {
  let component: GroupMatchsComponent;
  let fixture: ComponentFixture<GroupMatchsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupMatchsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMatchsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
