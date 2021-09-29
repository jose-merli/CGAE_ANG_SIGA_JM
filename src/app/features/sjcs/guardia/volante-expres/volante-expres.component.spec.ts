import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolanteExpresComponent } from './volante-expres.component';

describe('VolanteExpresComponent', () => {
  let component: VolanteExpresComponent;
  let fixture: ComponentFixture<VolanteExpresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VolanteExpresComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolanteExpresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
