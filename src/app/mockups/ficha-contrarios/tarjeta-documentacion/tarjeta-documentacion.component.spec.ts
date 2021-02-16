import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDocumentacionComponent } from './tarjeta-documentacion.component';

describe('TarjetaDocumentacionComponent', () => {
  let component: TarjetaDocumentacionComponent;
  let fixture: ComponentFixture<TarjetaDocumentacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaDocumentacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaDocumentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
