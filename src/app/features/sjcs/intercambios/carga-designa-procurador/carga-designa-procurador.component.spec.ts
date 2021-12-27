import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaDesignaProcuradorComponent } from './carga-designa-procurador.component';

describe('CargaDesignaProcuradorComponent', () => {
  let component: CargaDesignaProcuradorComponent;
  let fixture: ComponentFixture<CargaDesignaProcuradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargaDesignaProcuradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaDesignaProcuradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
