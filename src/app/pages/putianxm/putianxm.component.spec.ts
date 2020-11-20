import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PutianxmComponent } from './putianxm.component';

describe('PutianxmComponent', () => {
  let component: PutianxmComponent;
  let fixture: ComponentFixture<PutianxmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PutianxmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PutianxmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
