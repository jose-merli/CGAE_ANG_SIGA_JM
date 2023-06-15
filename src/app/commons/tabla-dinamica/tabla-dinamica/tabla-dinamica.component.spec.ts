import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDinamicaComponent } from './tabla-dinamica.component';

describe('TablaDinamicaComponent', () => {
  let component: TablaDinamicaComponent;
  let fixture: ComponentFixture<TablaDinamicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaDinamicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaDinamicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
