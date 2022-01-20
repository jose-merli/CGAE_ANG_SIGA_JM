import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemesasComponent } from './remesas.component';

describe('RemesasComponent', () => {
  let component: RemesasComponent;
  let fixture: ComponentFixture<RemesasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemesasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemesasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
