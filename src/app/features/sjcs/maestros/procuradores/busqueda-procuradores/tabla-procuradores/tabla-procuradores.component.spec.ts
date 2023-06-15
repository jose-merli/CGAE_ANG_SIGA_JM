import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaProcuradoresComponent } from './tabla-procuradores.component';

describe('TablaProcuradoresComponent', () => {
  let component: TablaProcuradoresComponent;
  let fixture: ComponentFixture<TablaProcuradoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaProcuradoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaProcuradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
