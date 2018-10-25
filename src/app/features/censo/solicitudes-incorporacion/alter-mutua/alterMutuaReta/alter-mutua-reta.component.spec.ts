import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterMutuaRetaComponent } from './alter-mutua-reta.component';

describe('SolicitudesIncorporacionComponent', () => {
  let component: AlterMutuaRetaComponent;
  let fixture: ComponentFixture<AlterMutuaRetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlterMutuaRetaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterMutuaRetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
