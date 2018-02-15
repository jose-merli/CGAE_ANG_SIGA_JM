import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesGenericasComponent } from './solicitudes-genericas.component';

describe('SolicitudesGenericasComponent', () => {
  let component: SolicitudesGenericasComponent;
  let fixture: ComponentFixture<SolicitudesGenericasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudesGenericasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesGenericasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
