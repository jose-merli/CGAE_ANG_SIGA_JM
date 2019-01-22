import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlterMutua } from './alter-mutua.component';

describe('SolicitudesIncorporacionComponent', () => {
  let component: AlterMutua;
  let fixture: ComponentFixture<AlterMutua>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AlterMutua]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlterMutua);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
