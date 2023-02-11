import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonasYSubzonasClassiqueComponent } from './zonas-subzonas.component';

describe('ZonasYSubzonasClassiqueComponent', () => {
  let component: ZonasYSubzonasClassiqueComponent;
  let fixture: ComponentFixture<ZonasYSubzonasClassiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ZonasYSubzonasClassiqueComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonasYSubzonasClassiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
