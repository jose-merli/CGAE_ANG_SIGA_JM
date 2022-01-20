import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroCargaDesignaProcuradorComponent } from './filtro-carga-designa-procurador.component';

describe('FiltroCargaDesignaProcuradorComponent', () => {
  let component: FiltroCargaDesignaProcuradorComponent;
  let fixture: ComponentFixture<FiltroCargaDesignaProcuradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroCargaDesignaProcuradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroCargaDesignaProcuradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
