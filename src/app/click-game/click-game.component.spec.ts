import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickGameComponent } from './click-game.component';

describe('ClickGameComponent', () => {
  let component: ClickGameComponent;
  let fixture: ComponentFixture<ClickGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClickGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClickGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
