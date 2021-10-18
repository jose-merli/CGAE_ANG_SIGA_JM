import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructorConsultasComponent } from './constructor-consultas.component';

describe('ConstructorConsultasComponent', () => {
  let component: ConstructorConsultasComponent;
  let fixture: ComponentFixture<ConstructorConsultasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstructorConsultasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstructorConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
