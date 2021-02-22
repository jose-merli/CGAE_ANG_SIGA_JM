import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDictamenEjgsComponent } from './tarjeta-dictamen-ejgs.component';

describe('TarjetaDictamenEjgsComponent', () => {
  let component: TarjetaDictamenEjgsComponent;
  let fixture: ComponentFixture<TarjetaDictamenEjgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TarjetaDictamenEjgsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaDictamenEjgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
