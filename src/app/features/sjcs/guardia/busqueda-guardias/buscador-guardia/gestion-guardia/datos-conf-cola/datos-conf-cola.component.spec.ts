import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosConfColaComponent } from './datos-conf-cola.component';

describe('DatosConfColaComponent', () => {
  let component: DatosConfColaComponent;
  let fixture: ComponentFixture<DatosConfColaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosConfColaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosConfColaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
