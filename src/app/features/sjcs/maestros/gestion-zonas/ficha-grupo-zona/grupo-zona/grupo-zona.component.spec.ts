import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoZonaComponent } from './grupo-zona.component';

describe('GrupoZonaComponent', () => {
  let component: GrupoZonaComponent;
  let fixture: ComponentFixture<GrupoZonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoZonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoZonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
