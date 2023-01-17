import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarImpreso190ComponentClassique } from './generar-impreso190-classique.component';

describe('GenerarImpreso190Component', () => {
  let component: GenerarImpreso190ComponentClassique;
  let fixture: ComponentFixture<GenerarImpreso190ComponentClassique>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenerarImpreso190ComponentClassique]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarImpreso190ComponentClassique);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
