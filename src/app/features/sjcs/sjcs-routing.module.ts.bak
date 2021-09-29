import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routesSjcs: Routes = [

	{
		path: 'facturacionesYPagos',
		loadChildren: './facturacionSJCS/facturacionsjcs.module#FacturacionSJCSModule'
	},
	{
		path: 'cartaFacturacionPago',
		loadChildren: './facturacionSJCS/facturacionsjcs.module#FacturacionSJCSModule'
	},
	{
		path: 'zonasYsubzonas',
		loadChildren: './maestros/maestros.module#MaestrosModule'
	},
	{
		path: 'mantenimientoJuzgados',
		loadChildren: './maestros/maestros.module#MaestrosModule'
	},
	{
		path: 'areasYMaterias',
		loadChildren: './maestros/maestros.module#MaestrosModule'
	},
	{
		path: 'costesFijos',
		loadChildren: './maestros/maestros.module#MaestrosModule'
	},
	{
		path: 'fundamentosCalificacion',
		loadChildren: './maestros/maestros.module#MaestrosModule'
	},
	{
		path: 'fundamentosResolucion',
		loadChildren: './maestros/maestros.module#MaestrosModule'
	},
	{
		path: 'maestrosModulos',
		loadChildren: './maestros/maestros.module#MaestrosModule'
	},
	{
		path: 'mantenimientoPrisiones',
		loadChildren: './maestros/maestros.module#MaestrosModule'
	},
	{
		path: 'partidosJudiciales',
		loadChildren: './maestros/maestros.module#MaestrosModule'
	},
	{
		path: 'mantenimientoComisarias',
		loadChildren: './maestros/maestros.module#MaestrosModule'
	},
	{
		path: 'calendarioLaboralAgenda',
		loadChildren: './maestros/maestros.module#MaestrosModule'
	},
	{
		path: 'mantenimientoprocuradores',
		loadChildren: './maestros/maestros.module#MaestrosModule'
	},
	{
		path: 'tiposActuacion',
		loadChildren: './maestros/maestros.module#MaestrosModule'
	},
	{
		path: 'destinatariosRetenciones',
		loadChildren: './maestros/maestros.module#MaestrosModule'
	},
	{
		path: 'procedimientos',
		loadChildren: './maestros/maestros.module#MaestrosModule'
	},
	{
		path: 'documentacionEJG',
		loadChildren: './maestros/maestros.module#MaestrosModule'
	},
	{
		path: 'justiciables',
		loadChildren: './justiciables/justiciables.module#JusticiablesModule'
	}
];

@NgModule({
	imports: [RouterModule.forChild(routesSjcs)],
	exports: [RouterModule]
})
export class SjcsRoutingModule { }
export const routingSjcs = RouterModule.forChild(routesSjcs);
