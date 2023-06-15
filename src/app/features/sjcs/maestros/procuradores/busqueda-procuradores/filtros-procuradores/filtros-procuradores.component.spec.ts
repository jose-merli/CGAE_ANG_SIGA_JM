import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosProcuradoresComponent } from './filtros-procuradores.component';

describe('FiltrosProcuradoresComponent', () => {
  let component: FiltrosProcuradoresComponent;
  let fixture: ComponentFixture<FiltrosProcuradoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltrosProcuradoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosProcuradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
