import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargasMasivasComprasComponent } from './cargas-masivas-compras.component';

describe('CargasMasivasComprasComponent', () => {
  let component: CargasMasivasComprasComponent;
  let fixture: ComponentFixture<CargasMasivasComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargasMasivasComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargasMasivasComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
