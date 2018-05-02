import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurarPerfilComponent } from './configurar-perfil.component';

describe('ConfigurarPerfilComponent', () => {
  let component: ConfigurarPerfilComponent;
  let fixture: ComponentFixture<ConfigurarPerfilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfigurarPerfilComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurarPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
