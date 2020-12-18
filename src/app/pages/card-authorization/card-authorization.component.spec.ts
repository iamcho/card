import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { cardAuthorizationComponent } from './card-authorization.component';

describe('cardAuthorizationComponent', () => {
  let component: cardAuthorizationComponent;
  let fixture: ComponentFixture<cardAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ cardAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(cardAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
