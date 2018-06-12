import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaltosYCompensacionesComponent } from './saltos-compensaciones.component';

describe('SaltosYCompensacionesComponent', () => {
  let component: SaltosYCompensacionesComponent;
  let fixture: ComponentFixture<SaltosYCompensacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaltosYCompensacionesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaltosYCompensacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
