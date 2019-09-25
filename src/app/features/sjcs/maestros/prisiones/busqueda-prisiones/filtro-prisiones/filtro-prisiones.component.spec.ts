import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroPrisionesComponent } from './filtro-prisiones.component';

describe('FiltroPrisionesComponent', () => {
  let component: FiltroPrisionesComponent;
  let fixture: ComponentFixture<FiltroPrisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroPrisionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroPrisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
