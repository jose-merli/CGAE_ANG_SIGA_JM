import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarImpreso190ClassiqueComponent } from './generar-impreso190-Classique.component';

describe('GenerarImpreso190Component', () => {
  let component: GenerarImpreso190ClassiqueComponent;
  let fixture: ComponentFixture<GenerarImpreso190ClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenerarImpreso190ClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarImpreso190ClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
