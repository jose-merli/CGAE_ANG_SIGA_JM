import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadFamiliarComponent } from './unidad-familiar.component';

describe('UnidadFamiliarComponent', () => {
  let component: UnidadFamiliarComponent;
  let fixture: ComponentFixture<UnidadFamiliarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnidadFamiliarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadFamiliarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
