import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolanteExpresClassiqueComponent } from './volante-expres.component';

describe('VolanteExpresClassiqueComponent', () => {
  let component: VolanteExpresClassiqueComponent;
  let fixture: ComponentFixture<VolanteExpresClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VolanteExpresClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolanteExpresClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
