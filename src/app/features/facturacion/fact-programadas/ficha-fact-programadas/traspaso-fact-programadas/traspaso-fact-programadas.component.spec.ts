import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraspasoFactProgramadasComponent } from './traspaso-fact-programadas.component';

describe('TraspasoFactProgramadasComponent', () => {
  let component: TraspasoFactProgramadasComponent;
  let fixture: ComponentFixture<TraspasoFactProgramadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraspasoFactProgramadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraspasoFactProgramadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
