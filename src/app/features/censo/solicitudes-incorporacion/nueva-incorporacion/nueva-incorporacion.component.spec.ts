import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaIncorporacionComponent } from './nueva-incorporacion.component';

describe('NuevaIncorporacionComponent', () => {
  let component: NuevaIncorporacionComponent;
  let fixture: ComponentFixture<NuevaIncorporacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaIncorporacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaIncorporacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
