import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroBuscadorProcuradorComponent } from './filtro.component';

describe('FiltroComponent', () => {
  let component: FiltroBuscadorProcuradorComponent;
  let fixture: ComponentFixture<FiltroBuscadorProcuradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiltroBuscadorProcuradorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroBuscadorProcuradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
