import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesGenericosComponent } from './informes-genericos.component';

describe('InformesGenericosComponent', () => {
  let component: InformesGenericosComponent;
  let fixture: ComponentFixture<InformesGenericosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InformesGenericosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformesGenericosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
