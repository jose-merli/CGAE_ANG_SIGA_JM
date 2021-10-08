import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CargasMasivasGuardiaComponent } from './cargas-masivas-guardia.component';

describe('CargasMasivasGuardiaComponent', () => {
  let component: CargasMasivasGuardiaComponent;
  let fixture: ComponentFixture<CargasMasivasGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargasMasivasGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargasMasivasGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
