import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoEJGComponent } from './resultado-ejg.component';

describe('ResultadoEJGComponent', () => {
  let component: ResultadoEJGComponent;
  let fixture: ComponentFixture<ResultadoEJGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultadoEJGComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoEJGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
