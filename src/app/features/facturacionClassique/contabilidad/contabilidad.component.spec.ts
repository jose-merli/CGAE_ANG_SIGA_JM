import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabilidadClassiqueComponent } from './contabilidad.component';

describe('ContabilidadClassiqueComponent', () => {
  let component: ContabilidadClassiqueComponent;
  let fixture: ComponentFixture<ContabilidadClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContabilidadClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContabilidadClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
