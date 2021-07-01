import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaPreasistenciasComponent } from './ficha-preasistencias.component';

describe('FichaPreasistenciasComponent', () => {
  let component: FichaPreasistenciasComponent;
  let fixture: ComponentFixture<FichaPreasistenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaPreasistenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaPreasistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
