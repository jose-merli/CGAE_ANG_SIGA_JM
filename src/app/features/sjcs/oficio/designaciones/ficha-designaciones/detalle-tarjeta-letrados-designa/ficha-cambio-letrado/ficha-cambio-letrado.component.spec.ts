import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaCambioLetradoComponent } from './ficha-cambio-letrado.component';

describe('FichaCambioLetradoComponent', () => {
  let component: FichaCambioLetradoComponent;
  let fixture: ComponentFixture<FichaCambioLetradoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaCambioLetradoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaCambioLetradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
