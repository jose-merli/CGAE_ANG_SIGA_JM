
import { Injectable } from '../../../node_modules/@angular/core';

@Injectable()
export class PersistenceService {

    private filtrosName: string = "filtros";
    private filtrosAuxName: string = "filtroAux";
    private paginacionName: string = "paginacion";
    private datosName: string = "datos";
    private bodyName: string = "body";
    private bodyAuxName: string = "bodyAux";
    private historicoName: string = "historico";
    private permisosName: string = "permisos";
    private fichasPosibles: string = "fichasPosibles";
    private datosBusquedaGeneralSJCS: string = "datosBusquedaGeneralSJCS";
    private filtrosBusquedaGeneralSJCS: string = "filtrosBusquedaGeneralSJCS";

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

    setPaginacion(data: any) {
        sessionStorage.setItem(this.paginacionName, JSON.stringify(data));
    }

    getPaginacion() {
        let data = sessionStorage.getItem(this.paginacionName);
        return JSON.parse(data);
    }

    clearPaginacion() {
        sessionStorage.removeItem(this.paginacionName);
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

    setBody(data: any) {
        sessionStorage.setItem(this.bodyName, JSON.stringify(data));
    }

    getBody() {
        let data = sessionStorage.getItem(this.bodyName);
        return JSON.parse(data);
    }

    clearBody() {
        sessionStorage.removeItem(this.bodyName);
    }

    setBodyAux(data: any) {
        sessionStorage.setItem(this.bodyAuxName, JSON.stringify(data));
    }

    getBodyAux() {
        let data = sessionStorage.getItem(this.bodyAuxName);
        return JSON.parse(data);
    }

    clearBodyAux() {
        sessionStorage.removeItem(this.bodyAuxName);
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

    setDatosBusquedaGeneralSJCS(data: any) {
        sessionStorage.setItem(this.datosBusquedaGeneralSJCS, JSON.stringify(data));
    }

    getDatosBusquedaGeneralSJCS() {
        let data = sessionStorage.getItem(this.datosBusquedaGeneralSJCS);
        return JSON.parse(data);
    }

    clearDatosBusquedaGeneralSJCS() {
        sessionStorage.removeItem(this.datosBusquedaGeneralSJCS);
    }

    setFiltrosBusquedaGeneralSJCS(data: any) {
        sessionStorage.setItem(this.filtrosBusquedaGeneralSJCS, JSON.stringify(data));
    }

    getFiltrosBusquedaGeneralSJCS() {
        let data = sessionStorage.getItem(this.filtrosBusquedaGeneralSJCS);
        return JSON.parse(data);
    }

    clearFiltrosBusquedaGeneralSJCS() {
        sessionStorage.removeItem(this.filtrosBusquedaGeneralSJCS);
    }


    clearPersistence() {
        this.clearFiltros();
        this.clearHistorico();
        this.clearDatos();
        this.clearPermisos();
        this.clearFiltrosAux();
        this.clearFichasPosibles();
        this.clearBody();
        this.clearBodyAux();
        this.clearPaginacion();
        this.clearDatosBusquedaGeneralSJCS();
        this.clearFiltrosBusquedaGeneralSJCS();
    }

}

