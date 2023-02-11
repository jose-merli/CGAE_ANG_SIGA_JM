import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionActasClassiqueComponent } from './gestion-actas.component';

describe('GestionActasClassiqueComponent', () => {
  let component: GestionActasClassiqueComponent;
  let fixture: ComponentFixture<GestionActasClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GestionActasClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionActasClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
