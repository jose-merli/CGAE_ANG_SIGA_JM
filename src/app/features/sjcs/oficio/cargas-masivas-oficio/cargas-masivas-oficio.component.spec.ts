import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargasMasivasOficioComponent } from './cargas-masivas-oficio.component';

describe('CargasMasivasOficioComponent', () => {
  let component: CargasMasivasOficioComponent;
  let fixture: ComponentFixture<CargasMasivasOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargasMasivasOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargasMasivasOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
