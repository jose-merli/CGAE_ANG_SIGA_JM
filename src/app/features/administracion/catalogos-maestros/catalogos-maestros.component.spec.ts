import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogosMaestros } from './catalogos-maestros.component';

describe('HomeComponent', () => {
  let component: CatalogosMaestros;
  let fixture: ComponentFixture<CatalogosMaestros>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogosMaestros]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogosMaestros);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
