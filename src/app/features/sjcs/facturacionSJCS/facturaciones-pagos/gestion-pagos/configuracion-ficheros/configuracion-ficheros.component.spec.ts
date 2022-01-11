import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionFicherosComponent } from './configuracion-ficheros.component';

describe('ConfiguracionFicherosComponent', () => {
  let component: ConfiguracionFicherosComponent;
  let fixture: ComponentFixture<ConfiguracionFicherosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguracionFicherosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionFicherosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
