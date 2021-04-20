import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDocFichaActComponent } from './tarjeta-doc-ficha-act.component';

describe('TarjetaDocFichaActComponent', () => {
  let component: TarjetaDocFichaActComponent;
  let fixture: ComponentFixture<TarjetaDocFichaActComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaDocFichaActComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaDocFichaActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
