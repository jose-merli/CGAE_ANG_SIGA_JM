
import { Injectable } from '../../../node_modules/@angular/core';
import { Subject } from '../../../node_modules/rxjs';

@Injectable()
export class PersistenceService {

    private filtrosName: string = "filtros";
    private filtrosAuxName: string = "filtroAux";
    private datosName: string = "datos";
    private historicoName: string = "historico";
    private permisosName: string = "permisos";

    private obtenerDatos = new Subject<any>();
    obtenerDatos$ = this.obtenerDatos.asObservable();

    constructor() { }

    setFiltros(data: any) {
        localStorage.setItem(this.filtrosName, JSON.stringify(data));
    }

    getFiltros() {
        let data = localStorage.getItem(this.filtrosName);
        return JSON.parse(data);
    }

    setFiltrosAux(data: any) {
        localStorage.setItem(this.filtrosAuxName, JSON.stringify(data));
    }

    getFiltrosAux() {
        let data = localStorage.getItem(this.filtrosAuxName);
        return JSON.parse(data);
    }

    clearFiltros() {
        localStorage.removeItem(this.filtrosName);
    }

    setDatos(data: any) {
        localStorage.setItem(this.datosName, JSON.stringify(data));
    }

    getDatos() {
        let data = localStorage.getItem(this.datosName);
        return JSON.parse(data);
    }

    clearDatos() {
        localStorage.removeItem(this.datosName);
    }

    setHistorico(data: any) {
        localStorage.setItem(this.historicoName, JSON.stringify(data));
    }

    getHistorico() {
        let data = localStorage.getItem(this.historicoName);
        return JSON.parse(data);
    }

    clearHistorico() {
        localStorage.removeItem(this.historicoName);
    }

    setPermisos(data: any) {
        localStorage.setItem(this.permisosName, JSON.stringify(data));
    }

    getPermisos() {
        let data = localStorage.getItem(this.permisosName);
        return JSON.parse(data);
    }

    clearPermisos() {
        localStorage.removeItem(this.permisosName);
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

