import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobrosRecobrosComponent } from './cobros-recobros.component';

describe('CobrosRecobrosComponent', () => {
  let component: CobrosRecobrosComponent;
  let fixture: ComponentFixture<CobrosRecobrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CobrosRecobrosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobrosRecobrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
