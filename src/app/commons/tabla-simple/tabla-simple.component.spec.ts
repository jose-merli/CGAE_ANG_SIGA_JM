import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaSimpleComponent } from './tabla-simple.component';

describe('TablaSimpleComponent', () => {
  let component: TablaSimpleComponent;
  let fixture: ComponentFixture<TablaSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaSimpleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
