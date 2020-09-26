import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFilterLineComponent } from './user-filter-line.component';

describe('UserFilterLineComponent', () => {
  let component: UserFilterLineComponent;
  let fixture: ComponentFixture<UserFilterLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFilterLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFilterLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
