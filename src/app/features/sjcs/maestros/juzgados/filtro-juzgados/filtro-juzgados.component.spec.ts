import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroJuzgadosComponent } from './filtro-juzgados.component';

describe('FiltroJuzgadosComponent', () => {
  let component: FiltroJuzgadosComponent;
  let fixture: ComponentFixture<FiltroJuzgadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroJuzgadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroJuzgadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
