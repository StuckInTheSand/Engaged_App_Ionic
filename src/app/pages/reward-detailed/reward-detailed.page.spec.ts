import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardDetailedPage } from './reward-detailed.page';

describe('RewardDetailedPage', () => {
  let component: RewardDetailedPage;
  let fixture: ComponentFixture<RewardDetailedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardDetailedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardDetailedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
