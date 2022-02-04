import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaExpExeaHistoricoComponent } from './ficha-exp-exea-historico.component';

describe('FichaExpExeaHistoricoComponent', () => {
  let component: FichaExpExeaHistoricoComponent;
  let fixture: ComponentFixture<FichaExpExeaHistoricoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaExpExeaHistoricoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaExpExeaHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
