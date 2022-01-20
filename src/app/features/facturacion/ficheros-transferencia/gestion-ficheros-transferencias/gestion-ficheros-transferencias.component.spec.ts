import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionFicherosTransferenciasComponent } from './gestion-ficheros-transferencias.component';

describe('GestionFicherosTransferenciasComponent', () => {
  let component: GestionFicherosTransferenciasComponent;
  let fixture: ComponentFixture<GestionFicherosTransferenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionFicherosTransferenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionFicherosTransferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
