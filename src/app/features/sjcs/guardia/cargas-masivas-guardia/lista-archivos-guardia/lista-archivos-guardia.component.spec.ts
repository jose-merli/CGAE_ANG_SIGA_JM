import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaArchivosGuardiaComponent } from './lista-archivos-guardia.component';



describe('ListaArchivosGuardiaComponent', () => {
  let component: ListaArchivosGuardiaComponent;
  let fixture: ComponentFixture<ListaArchivosGuardiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaArchivosGuardiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaArchivosGuardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
