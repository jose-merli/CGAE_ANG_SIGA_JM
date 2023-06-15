import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionZonasComponent } from './gestion-zonas.component';

describe('GestionZonasComponent', () => {
  let component: GestionZonasComponent;
  let fixture: ComponentFixture<GestionZonasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionZonasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionZonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
