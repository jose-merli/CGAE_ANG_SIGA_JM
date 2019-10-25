
import { Injectable } from '../../../node_modules/@angular/core';

@Injectable()
export class PersistenceService {

    private filtrosName: string = "filtros";
    private filtrosAuxName: string = "filtroAux";
    private datosName: string = "datos";
    private historicoName: string = "historico";
    private permisosName: string = "permisos";
    private fichasPosibles: string = "fichasPosibles";

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

    setFiltrosAux(data: any) {
        sessionStorage.setItem(this.filtrosAuxName, JSON.stringify(data));
    }

    getFiltrosAux() {
        let data = sessionStorage.getItem(this.filtrosAuxName);
        return JSON.parse(data);
    }

    clearFiltrosAux() {
        sessionStorage.removeItem(this.filtrosAuxName);
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

    setFichasPosibles(data: any) {
        sessionStorage.setItem(this.fichasPosibles, JSON.stringify(data));
    }

    getFichasPosibles() {
        let data = sessionStorage.getItem(this.fichasPosibles);
        return JSON.parse(data);
    }

    clearFichasPosibles() {
        sessionStorage.removeItem(this.fichasPosibles);
    }

    clearPersistence() {
        this.clearFiltros();
        this.clearHistorico();
        this.clearDatos();
        this.clearPermisos();
        this.clearFiltrosAux();
        this.clearFichasPosibles();
    }

}

