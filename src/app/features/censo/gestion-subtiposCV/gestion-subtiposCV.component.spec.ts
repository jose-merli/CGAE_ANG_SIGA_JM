import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionSubtiposCVComponent } from './gestion-subtiposCV.component';

describe('GestionSubtiposCVComponent', () => {
  let component: GestionSubtiposCVComponent;
  let fixture: ComponentFixture<GestionSubtiposCVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GestionSubtiposCVComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionSubtiposCVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
