import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroGestionZonasComponent } from './filtro-gestion-zonas.component';

describe('FiltroGestionZonasComponent', () => {
  let component: FiltroGestionZonasComponent;
  let fixture: ComponentFixture<FiltroGestionZonasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroGestionZonasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroGestionZonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
