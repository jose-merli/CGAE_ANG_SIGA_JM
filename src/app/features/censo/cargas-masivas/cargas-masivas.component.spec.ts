import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargasMasivasComponent } from './cargas-masivas.component';

describe('CargasMasivasComponent', () => {
  let component: CargasMasivasComponent;
  let fixture: ComponentFixture<CargasMasivasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CargasMasivasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargasMasivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
