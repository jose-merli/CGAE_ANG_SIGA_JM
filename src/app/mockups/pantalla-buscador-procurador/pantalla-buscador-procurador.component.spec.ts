import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaBuscadorProcuradorComponent } from './pantalla-buscador-procurador.component';

describe('PantallaBuscadorProcuradorComponent', () => {
  let component: PantallaBuscadorProcuradorComponent;
  let fixture: ComponentFixture<PantallaBuscadorProcuradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PantallaBuscadorProcuradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PantallaBuscadorProcuradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
