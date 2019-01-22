import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterMutuaOfertasComponent } from './alter-mutua-ofertas.component';

describe('SolicitudesIncorporacionComponent', () => {
  let component: AlterMutuaOfertasComponent;
  let fixture: ComponentFixture<AlterMutuaOfertasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlterMutuaOfertasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterMutuaOfertasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
