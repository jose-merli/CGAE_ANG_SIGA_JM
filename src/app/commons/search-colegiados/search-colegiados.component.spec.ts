import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchColegiadosComponent } from './search-colegiados.component';

describe('SearchColegiadosComponent', () => {
  let component: SearchColegiadosComponent;
  let fixture: ComponentFixture<SearchColegiadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchColegiadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchColegiadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
