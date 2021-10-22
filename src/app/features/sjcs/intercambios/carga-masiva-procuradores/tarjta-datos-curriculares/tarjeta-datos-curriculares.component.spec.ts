import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDatosCurricularesComponent } from './tarjeta-datos-curriculares.component';

describe('TarjetaDatosCurricularesComponent', () => {
  let component: TarjetaDatosCurricularesComponent;
  let fixture: ComponentFixture<TarjetaDatosCurricularesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaDatosCurricularesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaDatosCurricularesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
