import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunicacionSociedadesComponent } from './comunicacion-sociedades.component';

describe('ComunicacionSociedadesComponent', () => {
	let component: ComunicacionSociedadesComponent;
	let fixture: ComponentFixture<ComunicacionSociedadesComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ ComunicacionSociedadesComponent ]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(ComunicacionSociedadesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
