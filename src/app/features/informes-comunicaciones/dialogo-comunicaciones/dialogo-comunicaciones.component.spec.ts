import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoComunicacionesComponent } from './dialogo-comunicaciones.component';

describe('DialogoComunicacionesComponent', () => {
  let component: DialogoComunicacionesComponent;
  let fixture: ComponentFixture<DialogoComunicacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogoComunicacionesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoComunicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
