import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IllustrationsPage } from './illustrations.page';

describe('IllustrationsPage', () => {
  let component: IllustrationsPage;
  let fixture: ComponentFixture<IllustrationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IllustrationsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IllustrationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
