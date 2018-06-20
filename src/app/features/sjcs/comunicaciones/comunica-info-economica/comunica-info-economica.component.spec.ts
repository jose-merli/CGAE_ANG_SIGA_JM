import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicaInfoEconomicaComponent } from './comunica-info-economica.component';

describe('ComunicaInfoEconomicaComponent', () => {
  let component: ComunicaInfoEconomicaComponent;
  let fixture: ComponentFixture<ComunicaInfoEconomicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComunicaInfoEconomicaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComunicaInfoEconomicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
