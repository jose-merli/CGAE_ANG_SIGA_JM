
import { Injectable } from '../../../node_modules/@angular/core';
import { Subject } from '../../../node_modules/rxjs';

@Injectable()
export class PersistenceService {

    private filtrosName: string = "filtros";
    private datosName: string = "datos";
    private historicoName: string = "historico";
    private permisosName: string = "permisos";

    private obtenerDatos = new Subject<any>();
    obtenerDatos$ = this.obtenerDatos.asObservable();

    constructor() { }

    setFiltros(data: any) {
        sessionStorage.setItem(this.filtrosName, JSON.stringify(data));
    }

    getFiltros() {
        let data = sessionStorage.getItem(this.filtrosName);
        return JSON.parse(data);
    }

    clearFiltros() {
        sessionStorage.removeItem(this.filtrosName);
    }

    setDatos(data: any) {
        sessionStorage.setItem(this.datosName, JSON.stringify(data));
    }

    getDatos() {
        let data = sessionStorage.getItem(this.datosName);
        return JSON.parse(data);
    }

    clearDatos() {
        sessionStorage.removeItem(this.datosName);
    }

    setHistorico(data: any) {
        sessionStorage.setItem(this.historicoName, JSON.stringify(data));
    }

    getHistorico() {
        let data = sessionStorage.getItem(this.historicoName);
        return JSON.parse(data);
    }

    clearHistorico() {
        sessionStorage.removeItem(this.historicoName);
    }

    setPermisos(data: any) {
        sessionStorage.setItem(this.permisosName, JSON.stringify(data));
    }

    getPermisos() {
        let data = sessionStorage.getItem(this.permisosName);
        return JSON.parse(data);
    }

    clearPermisos() {
        sessionStorage.removeItem(this.permisosName);
    }

    clearPersistence() {
        this.clearFiltros();
        this.clearHistorico();
        this.clearDatos();
        this.clearPermisos();
    }

    notifyObtenerDatos(datos) {
        this.obtenerDatos.next(datos);
    }
}

