import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinirListasGuardiasComponent } from './definir-listas-guardias.component';

describe('DefinirListasGuardiasComponent', () => {
  let component: DefinirListasGuardiasComponent;
  let fixture: ComponentFixture<DefinirListasGuardiasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DefinirListasGuardiasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinirListasGuardiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
