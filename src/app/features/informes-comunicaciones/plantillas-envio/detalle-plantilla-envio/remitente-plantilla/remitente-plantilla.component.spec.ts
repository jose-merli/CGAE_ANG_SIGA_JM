import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitentePlantillaComponent } from './remitente-plantilla.component';

describe('RemitentePlantillaComponent', () => {
  let component: RemitentePlantillaComponent;
  let fixture: ComponentFixture<RemitentePlantillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemitentePlantillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitentePlantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
