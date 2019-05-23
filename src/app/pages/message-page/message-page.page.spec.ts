import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagePagePage } from './message-page.page';

describe('MessagePagePage', () => {
  let component: MessagePagePage;
  let fixture: ComponentFixture<MessagePagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagePagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
