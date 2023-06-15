import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaResultadoComponent } from './tabla-resultado.component';

describe('TablaResultadoComponent', () => {
  let component: TablaResultadoComponent;
  let fixture: ComponentFixture<TablaResultadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaResultadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
