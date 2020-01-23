import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BajasTemporalesComponent } from './busqueda-bajas-temporales.component';

describe('BajasTemporalesComponent', () => {
  let component: BajasTemporalesComponent;
  let fixture: ComponentFixture<BajasTemporalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BajasTemporalesComponent]
    })
      .compileComponents();
  }));
  

  beforeEach(() => {
    fixture = TestBed.createComponent(BajasTemporalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
