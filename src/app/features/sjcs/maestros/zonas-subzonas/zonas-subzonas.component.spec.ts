import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonasYSubzonasComponent } from './zonas-subzonas.component';

describe('ZonasYSubzonasComponent', () => {
  let component: ZonasYSubzonasComponent;
  let fixture: ComponentFixture<ZonasYSubzonasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZonasYSubzonasComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonasYSubzonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
