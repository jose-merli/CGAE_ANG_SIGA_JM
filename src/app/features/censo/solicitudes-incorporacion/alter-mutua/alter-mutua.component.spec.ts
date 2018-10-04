import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterMutuaComponent } from './alter-mutua.component';

describe('SolicitudesIncorporacionComponent', () => {
  let component: AlterMutuaComponent;
  let fixture: ComponentFixture<AlterMutuaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlterMutuaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterMutuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
