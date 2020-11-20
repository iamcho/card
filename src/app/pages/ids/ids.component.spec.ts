import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdsComponent } from './ids.component';

describe('IdsComponent', () => {
  let component: IdsComponent;
  let fixture: ComponentFixture<IdsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
