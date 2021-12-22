import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemesasResultadosComponent } from './remesas-resultados.component';

describe('RemesasResultadosComponent', () => {
  let component: RemesasResultadosComponent;
  let fixture: ComponentFixture<RemesasResultadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemesasResultadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemesasResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
