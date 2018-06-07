import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposExpedientesComponent } from './tipos-expedientes.component';

describe('TiposExpedientesComponent', () => {
  let component: TiposExpedientesComponent;
  let fixture: ComponentFixture<TiposExpedientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TiposExpedientesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposExpedientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
