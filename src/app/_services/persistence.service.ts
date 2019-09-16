
import { Injectable } from '../../../node_modules/@angular/core';
import { Subject } from '../../../node_modules/rxjs';

@Injectable()
export class PersistenceService {

    // historico: boolean;
    // filtros: any;
    // datos: any;

    private filtrosName: string = "filtros";
    private datosName: string = "datos";
    private historicoName: string = "historico";

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

    clearPersistence() {
        this.clearFiltros();
        this.clearHistorico();
        this.clearDatos();
    }

    notifyObtenerDatos(datos) {
        this.obtenerDatos.next(datos);
    }
}

