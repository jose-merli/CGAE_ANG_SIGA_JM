import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionSociedadesCensoComponent } from './facturacion-sociedades-censo.component';

describe('FacturacionSociedadesCensoComponent', () => {
	let component: FacturacionSociedadesCensoComponent;
	let fixture: ComponentFixture<FacturacionSociedadesCensoComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ FacturacionSociedadesCensoComponent ]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(FacturacionSociedadesCensoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
