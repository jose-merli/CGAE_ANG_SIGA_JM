import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosProcuradorContrarioComponent } from './datos-procurador-contrario.component';

describe('DatosProcuradorContrarioComponent', () => {
  let component: DatosProcuradorContrarioComponent;
  let fixture: ComponentFixture<DatosProcuradorContrarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosProcuradorContrarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosProcuradorContrarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
