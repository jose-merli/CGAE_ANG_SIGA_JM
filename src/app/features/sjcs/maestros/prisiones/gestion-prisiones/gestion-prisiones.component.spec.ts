import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPrisionesComponent } from './gestion-prisiones.component';

describe('GestionPrisionesComponent', () => {
  let component: GestionPrisionesComponent;
  let fixture: ComponentFixture<GestionPrisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionPrisionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPrisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
