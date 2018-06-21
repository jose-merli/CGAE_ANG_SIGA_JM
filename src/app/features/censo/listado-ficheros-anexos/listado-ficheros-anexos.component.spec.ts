import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoFicherosAnexosComponent } from './listado-ficheros-anexos.component';

describe('ListadoFicherosAnexosComponent', () => {
  let component: ListadoFicherosAnexosComponent;
  let fixture: ComponentFixture<ListadoFicherosAnexosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoFicherosAnexosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoFicherosAnexosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
