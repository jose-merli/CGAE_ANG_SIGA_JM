import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, Subscriber } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams, HttpResponseBase } from '@angular/common/http';

@Injectable()
export class OldSigaServices {
	oldServices = {
		mantenerSesion: 'notImplemented.do',
		//Censo
		busquedaSanciones: 'Dispatcher.do?proceso=566',
		certificadosAca: 'Dispatcher.do?proceso=130',
		comisionesCargos: 'Dispatcher.do?proceso=48',
		documentacionSolicitudes: 'Dispatcher.do?proceso=10',
		mantenimientoGruposFijos: 'Dispatcher.do?proceso=993',
		mantenimientoMandatos: 'Dispatcher.do?proceso=19',
		nuevaIncorporacion: 'Dispatcher.do?proceso=47',
		busquedaColegiados: 'Dispatcher.do?proceso=1',
		busquedaNoColegiados: 'Dispatcher.do?proceso=2',
		solicitudesEspecificas: 'Dispatcher.do?proceso=5',
		solicitudesGenericas: 'Dispatcher.do?proceso=4',
		solicitudesIncorporacion: 'Dispatcher.do?proceso=3',
		fichaColegial: 'Dispatcher.do?proceso=12',
		busquedaLetrados: 'Dispatcher.do?proceso=11',
		mantenimientoDuplicados: 'Dispatcher.do?proceso=18',
		modificacionDatos: 'Dispatcher.do?proceso=13',
		cargasPeriodicas: 'Dispatcher.do?proceso=161',
		configurarPerfil: 'Dispatcher.do?proceso=172',
		censoDocumentacion: 'Dispatcher.do?proceso=10',
		gestionSubtiposCV: 'Dispatcher.do?proceso=15E',
		cargaEtiquetas: 'Dispatcher.do?proceso=99E',
		datosCv: 'Dispatcher.do?proceso=15F',
		serviciosInteres: 'Dispatcher.do?proceso=234',
		fichaGeneral: 'Dispatcher.do?proceso=120',

		//Certificados
		comunicacionInterprofesional: 'Dispatcher.do?proceso=64',
		solicitarCompra: 'Dispatcher.do?proceso=63',
		solicitudCertificados: 'Dispatcher.do?proceso=60',
		gestionSolicitudes: 'Dispatcher.do?proceso=61',
		mantenimientoCertificados: 'Dispatcher.do?proceso=62',

		//Facturacion
		mantenimientoSufijos: 'Dispatcher.do?proceso=214',
		facturaPlantillas: 'Dispatcher.do?proceso=213',
		gestionCuentasBancarias: 'Dispatcher.do?proceso=281',
		seriesFactura: 'Dispatcher.do?proceso=200',
		previsionesFactura: 'Dispatcher.do?proceso=2A2',
		programarFactura: 'Dispatcher.do?proceso=280',
		generarFactura: 'Dispatcher.do?proceso=240',
		mantenimientoFactura: 'Dispatcher.do?proceso=241',
		eliminarFactura: 'Dispatcher.do?proceso=242',
		facturas: 'Dispatcher.do?proceso=220',
		ficherosAdeudos: 'Dispatcher.do?proceso=261',
		ficherosDevoluciones: 'Dispatcher.do?proceso=2C1',
		devolucionManual: 'Dispatcher.do?proceso=2C2',
		abonos: 'Dispatcher.do?proceso=2G0',
		ficherosTransferencia: 'Dispatcher.do?proceso=2G4',
		contabilidad: 'Dispatcher.do?proceso=250',
		cobrosRecobros: 'Dispatcher.do?proceso=2F0',
		facturasEmitidas: 'Dispatcher.do?proceso=2A1',

    	//Productos y Servicios
		categoriasProducto: 'Dispatcher.do?proceso=400',
		categoriasServicios: 'Dispatcher.do?proceso=401',
		mantenimientoProductos: 'Dispatcher.do?proceso=34',
		mantenimientoServicios: 'Dispatcher.do?proceso=35',
		gestionarSolicitudes: 'Dispatcher.do?proceso=36',
		solicitudCompraSubscripcion: 'Dispatcher.do?proceso=37',
		solicitudAnulacion: 'Dispatcher.do?proceso=40',
		cargaCompras: 'Dispatcher.do?proceso=38',

		//Expedientes
		tiposExpedientes: 'Dispatcher.do?proceso=41',
		gestionarExpedientes: 'Dispatcher.do?proceso=42',
		alertas: 'Dispatcher.do?proceso=44',
		nuevoExpediente: 'Dispatcher.do?proceso=46',

		//Justicia Gratuita
		zonasYsubzonas: 'Dispatcher.do?proceso=911',
		areasYMaterias: 'Dispatcher.do?proceso=912',
		partidas: 'Dispatcher.do?proceso=113',
		partidosJudiciales: 'Dispatcher.do?proceso=91C',
		retencionesIRPF: 'Dispatcher.do?proceso=92S',
		maestrosModulos: 'Dispatcher.do?proceso=91D',
		calendarioLaboral: 'Dispatcher.do?proceso=938',
		mantenimientoprocuradores: 'Dispatcher.do?proceso=91F',
		mantenimientoPrisiones: 'Dispatcher.do?proceso=91G',
		mantenimientoComisarias: 'Dispatcher.do?proceso=91H',
		mantenimientoJuzgados: 'Dispatcher.do?proceso=91I',
		documentacionEJG: 'Dispatcher.do?proceso=91J',
		maestroPJ: 'Dispatcher.do?proceso=992',
		destinatariosRetenciones: 'Dispatcher.do?proceso=996',
		tiposAsistencia: 'Dispatcher.do?proceso=99J',
		turnos: 'Dispatcher.do?proceso=913',
		solicitudesTurnosGuardias: 'Dispatcher.do?proceso=922',
		bajasTemporales: 'Dispatcher.do?proceso=9Z5',
		saltosYCompensaciones: 'Dispatcher.do?proceso=93N',
		designaciones: 'Dispatcher.do?proceso=959',
		guardiasSolicitudesTurnos: 'Dispatcher.do?proceso=74S',
		guardiasIncompatibilidades: 'Dispatcher.do?proceso=914',
		programacionCalendarios: 'Dispatcher.do?proceso=997',
		guardiasBajasTemporales: 'Dispatcher.do?proceso=75S',
		guardiasSaltosCompensaciones: 'Dispatcher.do?proceso=76S',
		definirListasGuardias: 'Dispatcher.do?proceso=91B',
		guardiasAsistencias: 'Dispatcher.do?proceso=952',
		guardiasAsistenciasExpres: 'Dispatcher.do?proceso=952',
		guardiasAceptadasCentralita: 'Dispatcher.do?proceso=956',
		volanteExpres: 'Dispatcher.do?proceso=11A',
		soj: 'Dispatcher.do?proceso=941',
		ejg: 'Dispatcher.do?proceso=946',
		gestionActas: 'Dispatcher.do?proceso=947',
		mantenimientoFacturacion: 'Dispatcher.do?proceso=600',
		previsiones: 'Dispatcher.do?proceso=616',
		mantenimientoPagos: 'Dispatcher.do?proceso=621',
		movimientosVarios: 'Dispatcher.do?proceso=608',
		tramosLEC: 'Dispatcher.do?proceso=623',
		retencionesJudiciales: 'Dispatcher.do?proceso=611',
		busquedaRetencionesAplicadas: 'Dispatcher.do?proceso=617',
		generarImpreso190: 'Dispatcher.do?proceso=613',
		resumenPagos: 'Dispatcher.do?proceso=953',
		envioReintegrosXunta: 'Dispatcher.do?proceso=12U',
		justificacionLetrado: 'Dispatcher.do?proceso=995',
		informeFacturacion: 'Dispatcher.do?proceso=96E',
		informeFacturacionMultiple: 'Dispatcher.do?proceso=96G',
		informeFacturacionPersonalizado: 'Dispatcher.do?proceso=96H',
		fichaFacturacion: 'Dispatcher.do?proceso=96A',
		fichaPago: 'Dispatcher.do?proceso=96B',
		cartaPagosColegiados: 'Dispatcher.do?proceso=96C',
		cartaFacturaColegiado: 'Dispatcher.do?proceso=96I',
		certificadosPagos: 'Dispatcher.do?proceso=96D',
		certificadosIrpf: 'Dispatcher.do?proceso=96F',
		comunicaPreparacion: 'Dispatcher.do?proceso=12B',
		comunicaRemesaEnvio: 'Dispatcher.do?proceso=12C',
		comunicaRemesaResultado: 'Dispatcher.do?proceso=12Z',
		comunicaEnvioActualizacion: 'Dispatcher.do?proceso=12W',
		comunicaInfoEconomica: 'Dispatcher.do?proceso=12Y',
		comunicaCarga: 'Dispatcher.do?proceso=12X',
		comunicaResoluciones: 'Dispatcher.do?proceso=12F',
		comunicaDesignaciones: 'Dispatcher.do?proceso=12G',
		justificacion: 'Dispatcher.do?proceso=710',
		certificacion: 'Dispatcher.do?proceso=711',
		devolucion: 'Dispatcher.do?proceso=712',

		//Consultas
		recuperarConsultas: 'Dispatcher.do?proceso=107',
		consultasListasDinamicas: 'Dispatcher.do?proceso=18a',
		nuevaConsulta: 'Dispatcher.do?proceso=108',
		nuevaConsultaExperta: 'Dispatcher.do?proceso=106',

		//Comunicaciones
		informesGenericos: 'Dispatcher.do?proceso=I00',
		definirTipoPlantilla: 'Dispatcher.do?proceso=74',
		listaCorreos: 'Dispatcher.do?proceso=72',
		bandejaSalida: 'Dispatcher.do?proceso=73',
		bandejaEntrada: 'Dispatcher.do?proceso=75',

		//Administracion
		catalogosMaestros: 'Dispatcher.do?proceso=78',

		//EJG
		expedienteDatAudi: 'Dispatcher.do?proceso=300', 
		detalleSOJ: 'Dispatcher.do?proceso=94A',

		//expedienteDatAudi: 'EXP_Auditoria_DatosGenerales.do?soloSeguimiento=false&editable=1&modo=&avanzada=&metodo=abrirNuevoEjg&numeroEjg=80&numEJGDisciplinario=20120&idTipoEjg=3&anioEjg=2021&nifSolicitante=&nombreSolicitante=++&idInstitucion_TipoExpediente=2005&numeroProcedimiento=&anioProcedimiento=&procedimiento=1231&asunto=&juzgado=114&juzgadoInstitucion=&pretension=128&pretensionInstitucion=2005&idturnoDesignado=3931&nombreDesignado=2005001421&numColDesignado=&idclasificacion=1&solicitanteEjgNif=&solicitanteEjgNombre=&solicitanteEjgApellido1=&solicitanteEjgApellido2=',

		loginDevelop: 'developmentLogin.do',
		//login: "sigainit.do"
		login: 'login.do'
	};

	constructor(private http: HttpClient) {}

	getOldSigaUrl(service: string) {
		if(service=="login"||service=="loginDevelop"){
			return environment.oldSigaUrl + this.oldServices[service] + '?token=' + sessionStorage.getItem('AuthOldSIGA');
		}else{
			return environment.oldSigaUrl + this.oldServices[service] + '&token=' + sessionStorage.getItem('AuthOldSIGA');
		}
	}

	getBackend(service: string, reqParams?: Map<string,string>, respose: boolean = false): Observable<any> {

		let headers = new HttpHeaders({
			"Content-Type": "application/x-www-form-urlencoded"
		});

		let params = new HttpParams();
		if(reqParams != undefined){
			reqParams.forEach((value, key) => {
				params = params.set(key, value);
			});
		}

		let options = {};
		if(respose){
			options = { params: params, observe: 'response', headers: headers, responseType: 'text'};
		} else {
			options = { params: params, observe: 'body', headers: headers};
		}

		return this.http.get(this.getOldSigaUrl(service), options).map(response => {
			return response;
		});
	}

	get(url: string): Observable<any> {
		let headers = new HttpHeaders({
			'X-UA-Compatible': 'IE=EmulateIE7'
		});
		// let options = { headers: headers, responseType: 'blob' }
		// options.responseType = ResponseContentType.Blob;

		// return this.http.get(url, { headers: headers, responseType: 'blob' });

		return new Observable((observer: Subscriber<any>) => {
			let objectUrl: string = null;

			this.http.get(url, { headers: headers, responseType: 'blob' }).subscribe((m) => {
				objectUrl = URL.createObjectURL(m);
				observer.next(objectUrl);
			});

			return () => {
				if (objectUrl) {
					URL.revokeObjectURL(objectUrl);
					objectUrl = null;
				}
			};
		});
	}
}
