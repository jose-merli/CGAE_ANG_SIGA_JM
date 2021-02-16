import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaDesignacionOficioComponent } from './ficha-designacion-oficio.component';

describe('FichaDesignacionOficioComponent', () => {
  let component: FichaDesignacionOficioComponent;
  let fixture: ComponentFixture<FichaDesignacionOficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FichaDesignacionOficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FichaDesignacionOficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
