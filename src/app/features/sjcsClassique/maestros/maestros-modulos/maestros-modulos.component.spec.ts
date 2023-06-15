import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestrosModulosClassiqueComponent } from './maestros-modulos.component';

describe('MaestrosModulosClassiqueComponent', () => {
  let component: MaestrosModulosClassiqueComponent;
  let fixture: ComponentFixture<MaestrosModulosClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaestrosModulosClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaestrosModulosClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
