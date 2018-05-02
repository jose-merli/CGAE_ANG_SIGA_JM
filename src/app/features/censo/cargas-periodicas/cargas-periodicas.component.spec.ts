import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargasPeriodicasComponent } from './cargas-periodicas.component';

describe('CargasPeriodicasComponent', () => {
  let component: CargasPeriodicasComponent;
  let fixture: ComponentFixture<CargasPeriodicasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CargasPeriodicasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargasPeriodicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
