import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogosMaestrosComponent } from './catalogos-maestros-classique.component';

describe('CatalogosMaestrosComponent', () => {
  let component: CatalogosMaestrosComponent;
  let fixture: ComponentFixture<CatalogosMaestrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CatalogosMaestrosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogosMaestrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
