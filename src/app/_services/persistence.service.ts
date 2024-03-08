
import { Injectable } from '../../../node_modules/@angular/core';

@Injectable()
export class PersistenceService {
    private filtrosName: string = "filtros";
    private filtrosEJGName: string = "filtrosEJG";
    private filtrosAuxName: string = "filtroAux";
    private volverEJGName: string = "volverEJG";
    private paginacionName: string = "paginacion";
    private datosName: string = "datos";
    private datosColegName: string = "datosColeg";
    private datosEJGName: string = "datosEJG";
    private datosRelaciones: string = "datos";
    private bodyName: string = "body";
    private bodyAuxName: string = "bodyAux";
    private historicoName: string = "historico";
    private permisosName: string = "permisos";
    private fichasPosibles: string = "fichasPosibles";
    private datosBusquedaGeneralSJCS: string = "datosBusquedaGeneralSJCS";
    private filtrosBusquedaGeneralSJCS: string = "filtrosBusquedaGeneralSJCS";
    private idJuzgadoName: string = "idJuzgado";
    private historicoJuzgadoName: string = "historicoJuzgado";
    private designacionName: string = "Designacion";
    private asistenciaName: string = "asistencia";
    private fromDesignacionesName: string = "fromDesignaciones";
    private designaItemName: string = "designaItem";
    private designaItemLinkName: string = "designaItemLink";
    private ejgCopyName: string = "EJGcopy";
    private asistenciaItemName: string = "asistenciaItem";
    private asistenciaCopyName: string = "asistenciaCopy";

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

    setFiltrosEJG(data: any) {
        sessionStorage.setItem(this.filtrosEJGName, JSON.stringify(data));
    }

    getFiltrosEJG() {
        let data = sessionStorage.getItem(this.filtrosEJGName);
        return JSON.parse(data);
    }

    clearFiltrosEJG() {
        sessionStorage.removeItem(this.filtrosEJGName);
    }
    
    setVolverEJG() {
        sessionStorage.setItem(this.volverEJGName, "true");
    }

    getVolverEJG() {
        let data = sessionStorage.getItem(this.volverEJGName);
        return JSON.parse(data);
    }

    clearVolverEJG() {
        sessionStorage.removeItem(this.volverEJGName);
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

    setIdJuzgado(data: any) {
        sessionStorage.setItem(this.idJuzgadoName, data);
    }

    getIdJuzgado() {
        return sessionStorage.getItem(this.idJuzgadoName);
    }

    clearIdJuzgado() {
        sessionStorage.removeItem(this.idJuzgadoName);
    }

    //historicoJuzgado
    setHistoricoJuzgado(data: any) {
        sessionStorage.setItem(this.historicoJuzgadoName, data);
    }

    getHistoricoJuzgado() {
        return sessionStorage.getItem(this.historicoJuzgadoName);
    }

    clearHistoricoJuzgado() {
        sessionStorage.removeItem(this.historicoJuzgadoName);
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

    setDatosColeg(data: any) {
        sessionStorage.setItem(this.datosColegName, JSON.stringify(data));
    }

    getDatosColeg() {
        let data = sessionStorage.getItem(this.datosColegName);
        return JSON.parse(data);
    }

    clearDatosColeg() {
        sessionStorage.removeItem(this.datosColegName);
    }

    clearDatosEJG() {
        sessionStorage.removeItem(this.datosEJGName);
    }

    setDatosEJG(data: any) {
        sessionStorage.setItem(this.datosEJGName, JSON.stringify(data));
    }

    getDatosEJG() {
        let data = sessionStorage.getItem(this.datosEJGName);
        return JSON.parse(data);
    }

    setDatosRelaciones(relaciones: any[]) {
        sessionStorage.setItem(this.datosRelaciones, JSON.stringify(relaciones));
    }

    getDatosRelaciones() {
        let data = sessionStorage.getItem(this.datosRelaciones);
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
        if(data != undefined)
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

    clearDesignacion(){
        sessionStorage.removeItem(this.designacionName);
    }

    clearAsistencia(){
        sessionStorage.removeItem(this.asistenciaName);
    }

    clearFromDesignaciones(){
        sessionStorage.removeItem(this.fromDesignacionesName);
    }

    clearDesignaItem(){
        sessionStorage.removeItem(this.designaItemName);
    }

    clearDesignaItemLink(){
        sessionStorage.removeItem(this.designaItemLinkName);
    }

    clearEJGCopy(){
        sessionStorage.removeItem(this.ejgCopyName);
    }

    clearAsistenciaItem(){
        sessionStorage.removeItem(this.asistenciaItemName);
    }

    clearAsistenciaCopy(){
        sessionStorage.removeItem(this.asistenciaCopyName);
    }

    clearRelacionesEjgDesignaAsistencia(){
        this.clearDatosEJG();
        this.clearEJGCopy();
        this.clearAsistencia();
        this.clearAsistenciaItem();
        this.clearDesignacion();
        this.clearDesignaItem();
        this.clearDesignaItemLink();
        this.clearFromDesignaciones();
        this.clearAsistenciaCopy();
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

