import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionGestionSubtiposCvComponent } from './informacion-gestion-subtipos-cv.component';

describe('InformacionGestionSubtiposCvComponent', () => {
  let component: InformacionGestionSubtiposCvComponent;
  let fixture: ComponentFixture<InformacionGestionSubtiposCvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionGestionSubtiposCvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionGestionSubtiposCvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
