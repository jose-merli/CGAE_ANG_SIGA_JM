import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoJuzgadosComponent } from './mantenimiento-juzgados.component';

describe('MantenimientoJuzgadosComponent', () => {
  let component: MantenimientoJuzgadosComponent;
  let fixture: ComponentFixture<MantenimientoJuzgadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoJuzgadosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoJuzgadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
