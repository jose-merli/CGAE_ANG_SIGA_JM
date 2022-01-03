import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoFacturaFactProgramadasComponent } from './info-factura-fact-programadas.component';

describe('InfoFacturaFactProgramadasComponent', () => {
  let component: InfoFacturaFactProgramadasComponent;
  let fixture: ComponentFixture<InfoFacturaFactProgramadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoFacturaFactProgramadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoFacturaFactProgramadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
