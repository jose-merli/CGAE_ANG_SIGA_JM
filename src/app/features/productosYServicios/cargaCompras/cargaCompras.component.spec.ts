import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaComprasComponent } from './cargaCompras.component';

describe('CargaComprasComponent', () => {
  let component: CargaComprasComponent;
  let fixture: ComponentFixture<CargaComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CargaComprasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
