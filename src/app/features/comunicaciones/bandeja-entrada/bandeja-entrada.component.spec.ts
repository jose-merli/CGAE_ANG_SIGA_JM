import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaEntradaComponent } from './bandeja-entrada.component';

describe('BandejaEntradaComponent', () => {
  let component: BandejaEntradaComponent;
  let fixture: ComponentFixture<BandejaEntradaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BandejaEntradaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
