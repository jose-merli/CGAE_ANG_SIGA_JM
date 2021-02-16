import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDictamenComponent } from './tarjeta-dictamen.component';

describe('TarjetaDictamenComponent', () => {
  let component: TarjetaDictamenComponent;
  let fixture: ComponentFixture<TarjetaDictamenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TarjetaDictamenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TarjetaDictamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
