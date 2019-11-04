import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorProcuradoresComponent } from './buscador-procuradores.component';

describe('BuscadorProcuradoresComponent', () => {
  let component: BuscadorProcuradoresComponent;
  let fixture: ComponentFixture<BuscadorProcuradoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscadorProcuradoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscadorProcuradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
