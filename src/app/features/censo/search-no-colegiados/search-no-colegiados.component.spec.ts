import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNoColegiadosComponent } from './search-no-colegiados.component';

describe('SearchNoColegiadosComponent', () => {
  let component: SearchNoColegiadosComponent;
  let fixture: ComponentFixture<SearchNoColegiadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchNoColegiadosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNoColegiadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
