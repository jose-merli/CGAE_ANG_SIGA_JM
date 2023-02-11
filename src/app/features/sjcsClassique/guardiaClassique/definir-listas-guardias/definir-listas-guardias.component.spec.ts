import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefinirListasGuardiasClassiqueComponent } from './definir-listas-guardias.component';

describe('DefinirListasGuardiasClassiqueComponent', () => {
  let component: DefinirListasGuardiasClassiqueComponent;
  let fixture: ComponentFixture<DefinirListasGuardiasClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DefinirListasGuardiasClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinirListasGuardiasClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
