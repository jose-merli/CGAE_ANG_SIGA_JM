import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TablaCargaDesignaProcuradorComponent } from './tabla-carga-designa-procurador.component';

describe('TablaCargaDesignaProcuradorComponent', () => {
  let component: TablaCargaDesignaProcuradorComponent;
  let fixture: ComponentFixture<TablaCargaDesignaProcuradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaCargaDesignaProcuradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaCargaDesignaProcuradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
