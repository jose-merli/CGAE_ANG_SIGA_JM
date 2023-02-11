import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartidasClassiqueComponent } from './partidas.component';

describe('PartidasClassiqueComponent', () => {
  let component: PartidasClassiqueComponent;
  let fixture: ComponentFixture<PartidasClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartidasClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartidasClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
