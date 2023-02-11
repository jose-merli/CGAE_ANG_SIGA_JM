import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoJuzgadosClassiqueComponent } from './mantenimiento-juzgados.component';

describe('MantenimientoJuzgadosClassiqueComponent', () => {
  let component: MantenimientoJuzgadosClassiqueComponent;
  let fixture: ComponentFixture<MantenimientoJuzgadosClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoJuzgadosClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenimientoJuzgadosClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
