import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {GuardiasSolicitudesCentralitaComponent} from './guardias-solicitudes-centralita.component';


describe('GuardiasSolicitudesCentralitaComponent', () => {
  let component: GuardiasSolicitudesCentralitaComponent;
  let fixture: ComponentFixture<GuardiasSolicitudesCentralitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuardiasSolicitudesCentralitaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardiasSolicitudesCentralitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
