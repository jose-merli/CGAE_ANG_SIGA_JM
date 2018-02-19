import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TieredMenuComponent } from './tieredMenu.component';

describe('TieredMenuComponent', () => {
  let component: TieredMenuComponent;
  let fixture: ComponentFixture<TieredMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TieredMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TieredMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
