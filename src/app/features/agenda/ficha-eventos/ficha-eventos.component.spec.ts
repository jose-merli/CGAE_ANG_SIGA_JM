import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaEventosComponent } from './ficha-eventos.component';

describe('FichaEventosComponent', () => {
  let component: FichaEventosComponent;
  let fixture: ComponentFixture<FichaEventosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FichaEventosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
