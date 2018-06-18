import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestrosModulosComponent } from './maestros-modulos.component';

describe('MaestrosModulosComponent', () => {
  let component: MaestrosModulosComponent;
  let fixture: ComponentFixture<MaestrosModulosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaestrosModulosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaestrosModulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
