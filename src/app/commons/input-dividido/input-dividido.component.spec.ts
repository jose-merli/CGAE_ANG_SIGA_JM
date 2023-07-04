import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDivididoComponent } from './input-dividido.component';

describe('InputDivididoComponent', () => {
  let component: InputDivididoComponent;
  let fixture: ComponentFixture<InputDivididoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputDivididoComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDivididoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
