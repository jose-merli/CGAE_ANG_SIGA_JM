import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteFacturasComponent } from './cliente-facturas.component';

describe('ClienteFacturasComponent', () => {
  let component: ClienteFacturasComponent;
  let fixture: ComponentFixture<ClienteFacturasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteFacturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
