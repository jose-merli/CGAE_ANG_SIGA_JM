import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { Observable, Subscriber } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams, HttpResponseBase } from '@angular/common/http';

@Injectable()
export class OldSigaServices {

    oldServices = {
        //Censo

        busquedaSanciones: "Dispatcher.do?proceso=566",
        certificadosAca: "Dispatcher.do?proceso=130",
        comisionesCargos: "Dispatcher.do?proceso=48",
        documentacionSolicitudes: "Dispatcher.do?proceso=10",
        mantenimientoGruposFijos: "Dispatcher.do?proceso=993",
        mantenimientoMandatos: "Dispatcher.do?proceso=19",
        nuevaIncorporacion: "Dispatcher.do?proceso=47",
        busquedaColegiados: "Dispatcher.do?proceso=1",
        busquedaNoColegiados: "Dispatcher.do?proceso=2",
        solicitudesEspecificas: "Dispatcher.do?proceso=5",
        solicitudesGenericas: "Dispatcher.do?proceso=4",
        solicitudesIncorporacion: "Dispatcher.do?proceso=3",
        fichaColegial: "Dispatcher.do?proceso=12",
        busquedaLetrados: "Dispatcher.do?proceso=11",
        mantenimientoDuplicados: "Dispatcher.do?proceso=18",
        modificacionDatos: "Dispatcher.do?proceso=13",
        cargasPeriodicas: "Dispatcher.do?proceso=161",
        configurarPerfil: "Dispatcher.do?proceso=172",
        censoDocumentacion: "Dispatcher.do?proceso=10",
        gestionSubtiposCV: "Dispatcher.do?proceso=15E",

        //Certificados
        comunicacionInterprofesional: "Dispatcher.do?proceso=64",
        solicitarCompra: "Dispatcher.do?proceso=63",
        solicitudCertificados: "Dispatcher.do?proceso=60",
        gestionSolicitudes: "Dispatcher.do?proceso=61",
        mantenimientoCertificados: "Dispatcher.do?proceso=62",

        //Facturacion
        mantenimientoSufijos: "Dispatcher.do?proceso=214",

        //Productos y Servicios
        categoriasProducto: "Dispatcher.do?proceso=400",
        categoriasServicios: "Dispatcher.do?proceso=401",
        mantenimientoProductos: "Dispatcher.do?proceso=40",
        mantenimientoServicios: "Dispatcher.do?proceso=41",
        gestionarSolicitudes: "Dispatcher.do?proceso=36",
        solicitudCompraSubscripcion: "Dispatcher.do?proceso=37",
        solicitudAnulacion: "Dispatcher.do?proceso=40",
        cargaCompras: "Dispatcher.do?proceso=44",

        //Expedientes
        tiposExpedientes: "Dispatcher.do?proceso=41",
        gestionarExpedientes: "Dispatcher.do?proceso=42",
        alertas: "Dispatcher.do?proceso=44",
        nuevoExpediente: "Dispatcher.do?proceso=46",

        //Justicia Gratuita
        zonasYsubzonas: "Dispatcher.do?proceso=911",
        areasYMaterias: "Dispatcher.do?proceso=912",
        partidas: "Dispatcher.do?proceso=113",
        partidosJudiciales: "Dispatcher.do?proceso=91C",
        retencionesIRPF: "Dispatcher.do?proceso=92S",
        maestrosModulos: "Dispatcher.do?proceso=91D",
        calendarioLaboral: "Dispatcher.do?proceso=938",
        mantenimientoprocuradores: "Dispatcher.do?proceso=91F",
        mantenimientoPrisiones: "Dispatcher.do?proceso=91G",
        mantenimientoComisarias: "Dispatcher.do?proceso=91H",
        mantenimientoJuzgados: "Dispatcher.do?proceso=91I",
        documentacionEJG: "Dispatcher.do?proceso=91J",
        maestroPJ: "Dispatcher.do?proceso=992",
        destinatariosRetenciones: "Dispatcher.do?proceso=996",
        tiposAsistencia: "Dispatcher.do?proceso=99J",
        turnos: "Dispatcher.do?proceso=913",
        solicitudesTurnosGuardias: "Dispatcher.do?proceso=922",
        bajasTemporales: "Dispatcher.do?proceso=9Z5",
        saltosYCompensaciones: "Dispatcher.do?proceso=93N",
        designaciones: "Dispatcher.do?proceso=959",
        guardiasSolicitudesTurnos: "Dispatcher.do?proceso=74S",
        guardiasIncompatibilidades: "Dispatcher.do?proceso=914",
        programacionCalendarios: "Dispatcher.do?proceso=997",
        guardiasBajasTemporales: "Dispatcher.do?proceso=75S",
        guardiasSaltosCompensaciones: "Dispatcher.do?proceso=76S",
        definirListasGuardias: "Dispatcher.do?proceso=91B",
        guardiasAsistencias: "Dispatcher.do?proceso=952",
        guardiasAceptadasCentralita: "Dispatcher.do?proceso=956",
        volanteExpres: "Dispatcher.do?proceso=11A",
        soj: "Dispatcher.do?proceso=941",
        ejg: "Dispatcher.do?proceso=946",
        gestionActas: "Dispatcher.do?proceso=947",
        mantenimientoFacturacion: "Dispatcher.do?proceso=600",
        previsiones: "Dispatcher.do?proceso=616",
        mantenimientoPagos: "Dispatcher.do?proceso=621",
        movimientosVarios: "Dispatcher.do?proceso=608",
        tramosLEC: "Dispatcher.do?proceso=623",
        retencionesJudiciales: "Dispatcher.do?proceso=611",
        busquedaRetencionesAplicadas: "Dispatcher.do?proceso=617",
        generarImpreso190: "Dispatcher.do?proceso=613",
        resumenPagos: "Dispatcher.do?proceso=953",
        envioReintegrosXunta: "Dispatcher.do?proceso=12U",
        justificacionLetrado: "Dispatcher.do?proceso=995",
        informeFacturacion: "Dispatcher.do?proceso=96E",
        informeFacturacionMultiple: "Dispatcher.do?proceso=96G",
        informeFacturacionPersonalizado: "Dispatcher.do?proceso=96H",
        fichaFacturacion: "Dispatcher.do?proceso=96A",
        fichaPago: "Dispatcher.do?proceso=96B",
        cartaPagosColegiados: "Dispatcher.do?proceso=96C",
        cartaFacturaColegiado: "Dispatcher.do?proceso=96I",
        certificadosPagos: "Dispatcher.do?proceso=96D",
        certificadosIrpf: "Dispatcher.do?proceso=96F",
        comunicaPreparacion: "Dispatcher.do?proceso=12B",
        comunicaRemesaEnvio: "Dispatcher.do?proceso=12C",
        comunicaRemesaResultado: "Dispatcher.do?proceso=12Z",
        comunicaEnvioActualizacion: "Dispatcher.do?proceso=12W",
        comunicaInfoEconomica: "Dispatcher.do?proceso=12Y",
        comunicaCarga: "Dispatcher.do?proceso=12X",
        comunicaResoluciones: "Dispatcher.do?proceso=12F",
        comunicaDesignaciones: "Dispatcher.do?proceso=12G",

        recuperarConsultas: "Dispatcher.do?proceso=107",
        consultasListasDinamicas: "Dispatcher.do?proceso=18a",
        nuevaConsulta: "Dispatcher.do?proceso=108",
        nuevaConsultaExperta: "Dispatcher.do?proceso=106",

        loginDevelop: "developmentLogin.do",
        login: "sigainit.do"

    }

    constructor(private http: HttpClient) {
    }

    getOldSigaUrl(service: string) {
        return environment.oldSigaUrl + this.oldServices[service];
    }


    get(url: string): Observable<any> {
        let headers = new HttpHeaders({
            "X-UA-Compatible": "IE=EmulateIE7"
        });

        // let options = { headers: headers, responseType: 'blob' }
        // options.responseType = ResponseContentType.Blob;

        // return this.http.get(url, { headers: headers, responseType: 'blob' });

        return new Observable((observer: Subscriber<any>) => {
            let objectUrl: string = null;

            this.http
                .get(url, { headers: headers, responseType: 'blob' })
                .subscribe(m => {
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