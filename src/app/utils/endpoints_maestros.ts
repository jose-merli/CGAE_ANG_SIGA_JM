export let endpoints_maestros: any = {

    fichaZonas_getPartidosJudiciales: "maestros/fichaZonas/partidosJudiciales",
    gestionZonas_searchZones: "maestros/gestionZonas/searchZones",
    fichaZonas_createZones: "maestros/fichaZonas/createZones",
    fichaZonas_searchSubzones: "maestros/fichaZonas/searchSubzones",
    fichaZonas_searchGroupZone: "maestros/fichaZonas/searchGroupZone",
    fichaZonas_updateGroupZone: "maestros/fichaZonas/updateGroupZone",
    fichaZonas_createGroupZone: "maestros/fichaZonas/createGroupZone",
    fichaZonas_updateZones: "maestros/fichaZonas/updateZones",
    fichaZonas_createZone: "maestros/fichaZonas/createZone",
    fichaZonas_deleteZones: "maestros/fichaZonas/deleteZones",
    fichaZonas_deleteGroupZones: "maestros/fichaZonas/deleteGroupZones",
    fichaZonas_activateGroupZones: "maestros/fichaZonas/activateGroupZones",

    fichaAreas_getJurisdicciones: "maestros/areasMaterias/jurisdicciones",
    fichaAreas_searchAreas: "maestros/areasMaterias/searchAreas",
    fichaAreas_deleteAreas: "maestros/areasMaterias/deleteAreas",
    fichaAreas_updateAreas: "maestros/areasMaterias/updateAreas",
    fichaAreas_createAreas: "maestros/areasMaterias/createAreas",
    fichaAreas_searchMaterias: "maestros/areasMaterias/searchMaterias",
    fichaAreas_updateMaterias: "maestros/areasMaterias/updateMaterias",
    fichaAreas_createMaterias: "maestros/areasMaterias/createMaterias",
    fichaAreas_deleteMaterias: "maestros/areasMaterias/deleteMaterias",
    areasMaterias_activateMaterias: "maestros/areasMaterias/activateMaterias",

    busquedaJuzgados_searchCourt: "maestros/busquedaJuzgados/searchCourt",
    busquedaJuzgados_provinces: "maestros/busquedaJuzgados/provinces",
    busquedaJuzgados_population: "maestros/busquedaJuzgados/population",
    busquedaJuzgados_deleteCourt: "maestros/busquedaJuzgados/deleteCourt",
    busquedaJuzgados_activateCourt: "maestros/busquedaJuzgados/activateCourt",
    gestionJuzgados_searchProcess: "maestros/gestionJuzgados/searchProcess",
    gestionJuzgados_searchProcCourt: "maestros/gestionJuzgados/searchProcCourt",
    gestionJuzgados_createCourt: "maestros/gestionJuzgados/createCourt",
    gestionJuzgados_updateCourt: "maestros/gestionJuzgados/updateCourt",
    gestionJuzgados_associateProcess: "maestros/gestionJuzgados/associateProcess",
    gestionJuzgados_asociarModulosAJuzgados: "maestros/gestionJuzgados/asociarModulosAJuzgados",

    gestionCostesFijos_getCosteFijos: "maestros/gestionCostesFijos/comboCosteFijos",
    gestionCostesFijos_getComboAsistencia: "maestros/gestionCostesFijos/comboAsistencia",
    gestionCostesFijos_getComboActuacion: "maestros/gestionCostesFijos/comboActuacion",
    gestionCostesFijos_searchCosteFijos: "maestros/gestionCostesFijos/searchCostesFijos",
    gestionCostesFijos_createCosteFijo: "maestros/gestionCostesFijos/createCosteFijo",
    gestionCostesFijos_deleteCostesFijos: "maestros/gestionCostesFijos/deleteCostesFijos",
    gestionCostesFijos_activateCostesFijos: "maestros/gestionCostesFijos/activateCostesFijos",
    gestionCostesFijos_updateCostesFijos: "maestros/gestionCostesFijos/updateCostesFijos",

    gestionFundamentosResolucion_searchFundamentosResolucion: "maestros/gestionFundamentosResolucion/searchFundamentosResolucion",
    gestionFundamentosResolucion_deleteFundamentosResolucion: "maestros/gestionFundamentosResolucion/deleteFundamentosResolucion",
    gestionFundamentosResolucion_activateFundamentosResolucion: "maestros/gestionFundamentosResolucion/activateFundamentosResolucion",
    gestionFundamentosResolucion_getResoluciones: "maestros/gestionFundamentosResolucion/getResoluciones",
    gestionFundamentosResolucion_createFundamentoResolucion: "maestros/gestionFundamentosResolucion/createFundamentoResolucion",
    gestionFundamentosResolucion_updateFundamentoResolucion: "maestros/gestionFundamentosResolucion/updateFundamentoResolucion",

    // Módulos y bases de compensación
    modulosYBasesDeCompensacion_searchModulos: "maestros/modulosybasesdecompensacion/searchModulos",
    modulosybasesdecompensacion_deleteModulos: "maestros/modulosybasesdecompensacion/deleteModulos",
    modulosybasesdecompensacion_checkModulos: "maestros/modulosybasesdecompensacion/checkModulos",
    modulosybasesdecompensacion_searchAcreditaciones: "maestros/modulosybasesdecompensacion/searchAcreditaciones",
    modulosybasesdecompensacion_comboAcreditacionesDisponibles: "maestros/modulosybasesdecompensacion/comboAcreditacionesDisponibles",
    modulosybasesdecompensacion_comboAcreditaciones: "maestros/modulosybasesdecompensacion/comboAcreditaciones",
    modulosybasesdecompensacion_updatemoduloybasedecompensacion: "maestros/modulosybasesdecompensacion/updatemoduloybasedecompensacion",
    modulosybasesdecompensacion_createmoduloybasedecompensacion: "maestros/modulosybasesdecompensacion/createmoduloybasedecompensacion",
    modulosybasesdecompensacion_deleteAcreditacion: "maestros/modulosybasesdecompensacion/deleteAcreditacion",
    modulosybasesdecompensacion_updateAcreditacion: "maestros/modulosybasesdecompensacion/updateAcreditacion",
    modulosybasesdecompensacion_createAcreditacion: "maestros/modulosybasesdecompensacion/createAcreditacion",
    modulosybasesdecompensacion_procedimientos: "maestros/modulosybasesdecompensacion/procedimientos",
    modulosybasesdecompensacion_getComplementoProcedimiento: "maestros/modulosybasesdecompensacion/getComplementoProcedimiento",

    // Gestion partidas presupuestarias
    gestionPartidasPres_searchPartidasPres: "maestros/gestionPartidasPres/searchPartidasPres",
    gestionPartidasPres_eliminatePartidasPres: "maestros/gestionPartidasPres/eliminatePartidasPres",
    gestionPartidasPres_updatePartidasPres: "maestros/gestionPartidasPres/updatePartidasPres",
    gestionPartidasPres_createPartidasPres: "maestros/gestionPartidasPres/createPartidasPres",

    busquedaPrisiones_searchPrisiones: "maestros/busquedaPrisiones/searchPrisiones",
    busquedaPrisiones_provinces: "maestros/busquedaPrisiones/provinces",
    busquedaPrisiones_population: "maestros/busquedaPrisiones/population",
    busquedaPrisiones_deletePrisiones: "maestros/busquedaPrisiones/deletePrisiones",
    busquedaPrisiones_activatePrisiones: "maestros/busquedaPrisiones/activatePrisiones",
    gestionPrisiones_createPrision: "maestros/gestionPrisiones/createPrision",
    gestionPrisiones_updatePrision: "maestros/gestionPrisiones/updatePrision",

    //Documentacion EJG
    busquedaDocumentacionEjg_searchDocumento: "maestros/busquedaDocumentacionEjg/searchDocumento",
    //busquedaDocumentacionEjg_searchTipoDocumento: "maestros/busquedaDocumentacionEjg/searchTipoDocumento",
    busquedaDocumentacionEjg_createDocumento: "maestros/busquedaDocumentacionEjg/createDocumentacionejg",
    busquedaDocumentacionEjg_updateDocumento: "maestros/busquedaDocumentacionEjg/updateDocumentacionejg",
    busquedaDocumentacionEjg_deleteTipoDoc: "maestros/busquedaDocumentacionEjg/deleteTipoDoc",
    busquedaDocumentacionEjg_searchDocumentos: "maestros/busquedaDocumentacionEjg/searchDocumentos",
    gestionDocumentacionEjg_deleteDoc: "maestros/gestionDocumentacionEjg/deleteDoc",
    gestionDocumentacionEjg_createTipoDoc: "maestros/gestionDocumentacionEjg/createTipoDoc",
    gestionDocumentacionEjg_updateTipoDoc: "maestros/gestionDocumentacionEjg/updateTipoDoc",
    gestionDocumentacionEjg_createDoc: "maestros/gestionDocumentacionEjg/createDoc",
    gestionDocumentacionEjg_updateDoc: "maestros/gestionDocumentacionEjg/updateDoc",




    //Fundamentos calificacion
    busquedaFundamentosCalificacion_comboDictamen: "maestros/busquedaFundamentosCalificacion/comboDictamen",
    busquedaFundamentosCalificacion_searchFundamentos: "maestros/busquedaFundamentosCalificacion/searchFundamentos",
    fundamentosCalificacion_deleteFundamentoCalificacion: "maestros/busquedaFundamentosCalificacion/deleteFundamentos",
    busquedaFundamentosCalificacion_activateFundamentos: "maestros/busquedaFundamentosCalificacion/activateFundamentos",
    busquedaFundamentosCalificacion_createFundamentos: "maestros/busquedaFundamentosCalificacion/createFundamento",
    busquedaFundamentosCalificacion_updateFundamento: "maestros/busquedaFundamentosCalificacion/updateFundamentoCalificacion",

    //Comisarias
    busquedaComisarias_searchComisarias: "maestros/gestionComisarias/searchComisarias",
    gestionComisarias_createComisaria: "maestros/gestionComisarias/createComisarias",
    gestionComisarias_updateComisarias: "maestros/gestionComisarias/updateComisarias",
    busquedaComisarias_deleteComisarias: "maestros/gestionComisarias/deleteComisarias",
    busquedaComisarias_activateComisarias: "maestros/gestionComisarias/activateComisarias",
    busquedaComisarias_provinces: "maestros/gestionComisarias/provinces",
    busquedaCommisarias_poblacion: "maestros/gestionComisarias/population",

    //Procuradores
    busquedaProcuradores_searchProcuradores: "maestros/gestionProcuradores/busquedaProcuradores",
    busquedaProcuradores_deleteProcuradores: "maestros/gestionProcuradores/deleteProcuradores",
    busquedaProcuradores_activateProcuradores: "maestros/gestionProcuradores/activateProcuradores",
    gestionProcuradores_createProcurador: "maestros/gestionProcuradores/createProcurador",
    gestionProcuradores_updateProcurador: "maestros/gestionProcuradores/updateProcurador",
    busquedaProcuradores_colegios: "maestros/gestionProcuradores/colegios",

    //Procedimientos
    busquedaProcedimientos_jurisdiccion: "maestros/busquedaPretensiones/jurisdiccion",
    busquedaProcedimientos_procedimientos: "maestros/busquedaPretensiones/procesos",
    busquedaProcedimientos_searchProcedimientos: "maestros/gestionPretensiones/busquedaPretensiones",
    gestionProcedimientos_deleteProcedimientos: "maestros/gestionPretensiones/deletePretensiones",
    gestionProcedimientos_activateProcedimientos: "maestros/gestionPretensiones/activatePretensiones",
    gestionPretensiones_createPretension: "maestros/gestionPretensiones/createPretension",
    gestionPretensiones_updatePretension: "maestros/gestionPretensiones/updatePretension",

    //RetencionesIRPF
    busquedaRetencionesIRPF_sociedades: "maestros/gestionRetencionesIRPF/sociedades",
    busquedaRetencionesIRPF_busquedaRetencionesIRPF: "maestros/gestionRetencionesIRPF/busquedaRetencionesIRPF",
    busquedaRetencionesIRPF_deleteRetencionesIRPF: "maestros/gestionRetencionesIRPF/deleteRetencionesIRPF",
    busquedaRetencionesIRPF_activateRetencionesIRPF: "maestros/gestionRetencionesIRPF/activateRetencionesIRPF",
    busquedaRetencionesIRPF_createRetencionesIRPF: "maestros/gestionRetencionesIRPF/createRetencionIRPF",
    busquedaRetencionesIRPF_updateRetencionesIRPF: "maestros/gestionRetencionesIRPF/updateRetencionesIRPF",

    gestionPartidosJudi_busquedaPartidosJudi: "maestros/gestionPartidosJudi/searchoPartidosJudi",
    deletePartidosJudi_deletePartidosJudi: "maestros/deletePartidosJudi/deletePartidosJudi",
    gestionPartidosJudi_ComboPartidosJudi: "maestros/gestionPartidosJudi/ComboPartidosJudi",
    gestionPartidosJudi_createPartidosJudi: "maestros/gestionPartidosJudi/createPartidosJudi",

    calendarioLaboralAgenda_searchFestivos: "calendarioLaboralAgenda/searchFestivos",
    calendarioLaboralAgenda_deleteFestivos: "calendarioLaboralAgenda/deleteFestivos",
    calendarioLaboralAgenda_activateFestivos: "calendarioLaboralAgenda/activateFestivos",

    gestionTiposAsistencia_busquedaTiposAsistencia: "maestros/gestionTiposAsistencia/busquedaTiposAsistencia",
    gestionTiposAsistencia_ComboTiposAsistencia: "maestros/gestionTiposAsistencia/ComboTiposAsistencia",
    gestionTiposAsistencia_deleteTipoAsitencia: "maestros/gestionTiposAsistencia/deleteTipoAsitencia",
    gestionTiposAsistencia_updateTiposAsistencias: "maestros/gestionTiposAsistencia/updateTiposAsistencias",
    gestionTiposAsistencia_activateTipoAsitencia: "maestros/gestionTiposAsistencia/activateTipoAsitencia",
    gestionTiposAsistencia_createTipoAsistencia: "maestros/gestionTiposAsistencia/createTipoAsistencia",

    gestionTiposActuacion_busquedaTiposActuacion: "maestros/gestionTiposActuacion/busquedaTiposActuacion",
    gestionTiposAsistencia_ComboTiposActuacion: "maestros/gestionTiposAsistencia/ComboTiposActuacion",
    gestionTiposActuacion_updateTiposActuacion: "maestros/gestionTiposActuacion/updateTiposActuacion",
    gestionTiposActuacion_deleteTipoActuacion: "maestros/gestionTiposActuacion/deleteTipoActuacion",
    gestionTiposActuacion_activateTipoActuacion: "maestros/gestionTiposActuacion/activateTipoActuacion",
    gestionTiposActuacion_createTipoActuacion: "maestros/gestionTiposActuacion/createTipoActuacion",

    gestionDestinatariosRetenc_searchDestinatariosRetenc: "maestros/gestionDestinatariosRetenc/searchDestinatariosRetenc",
    gestionDestinatariosRetenc_updateDestinatariosRetenc: "maestros/gestionDestinatariosRetenc/updateDestinatariosRetenc",
    gestionDestinatariosRetenc_eliminateDestinatariosRetenc: "maestros/gestionDestinatariosRetenc/eliminateDestinatariosRetenc",
    gestionDestinatariosRetenc_createDestinatarioRetenc: "maestros/gestionDestinatariosRetenc/createDestinatarioRetenc"
}
