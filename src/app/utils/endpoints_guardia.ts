export let endpoints_guardia: any = {


    busquedaGuardia_grupoZona: "combo/zonas",
    busquedaGuardia_zonas: "combo/subzonas",
    busquedaGuardia_jurisdicciones: "combo/jurisdicciones",
    busquedaGuardia_gruposFacturacion: "combo/grupoFacturacion",
    busquedaGuardia_partidaspresupuestarias: "combo/partidasPresupuestarias",
    busquedaGuardia_turno: "combo/turnos",
    busquedaGuardia_area: "combo/areas",
    busquedaGuardia_materia: "combo/materias",
    busquedaGuardia_tipoTurno: "combo/tipoTurno",
    busquedaGuardia_tiposGuardia: "combo/tipoGuardia",
    busquedaGuardia_grupo: "combo/guardiasGrupo",
    busquedaGuardia_noGrupo: "combo/guardiasNoGrupo",
    busquedaGuardia_listasGuardia: "combo/listasguardias",
    busquedaGuardia_conjuntoGuardia: "combo/conjuntoguardias",
    busquedaGuardia_estado: "combo/estado",
    busquedaGuardia_comboGuardia_Nogrupo: "combo/guardiasNoGrupo",


    // Guardias

    busquedaGuardias_searchGuardias: "guardia/busquedaGuardia/searchGuardias",
    busquedaGuardias_deleteGuardias: "guardia/busquedaGuardia/deleteGuardias",
    busquedaGuardias_activateGuardias: "guardia/busquedaGuardia/activateGuardias",
    busquedaGuardias_getGuardia: "guardia/busquedaGuardia/detalleGuardia",
    busquedaGuardias_updateGuardia: "guardia/busquedaGuardia/updateGuardia",
    busquedaGuardias_updateUltimo: "guardia/busquedaGuardia/ultimo",
    busquedaGuardias_createGuardia: "guardia/busquedaGuardia/createGuardia",
    busquedaGuardias_resumenGuardia: "guardia/busquedaGuardia/resumenGuardia",
    busquedaGuardias_resumenConfCola: "guardia/busquedaGuardia/resumenConfiguracionCola",
    busquedaGuardias_tarjetaIncompatibilidades: "guardia/busquedaGuardia/tarjetaIncompatibilidades",
    busquedaGuardias_getBaremos: "guardia/busquedaGuardia/getBaremos",
    busquedaGuardias_getCalendario: "guardia/busquedaGuardia/getCalendario",
    busquedaGuardias_getColaGuardia: "guardia/busquedaGuardia/getColaGuardia",
    busquedaGuardias_updateColaGuardia: "guardia/busquedaGuardia/updateColaGuardia",
    busquedaGuardias_getUltimo: "guardia/gestionGuardia/ultimo",
    gestionGuardias_updateColaGuardia: "guardia/gestionGuardia/updateColaGuardia",
    gestionGuardias_resumenIncompatibilidades: "guardia/gestionGuardia/resumenIncompatibilidades",
    gestionGuardias_resumenTurno: "guardia/gestionGuardia/resumenTurno",
    gestionGuardias_guardarCola: "guardia/gestionGuardia/guardarCola",


    // Saltos y compensaciones Guardia
    saltosCompensacionesGuardia_buscar: "guardia/saltosCompensaciones/buscarSaltosOCompensaciones",
    saltosCompensacionesGuardia_guardar: "guardia/saltosCompensaciones/guardarSaltosCompensaciones",
    saltosCompensacionesGuardia_anular: "guardia/saltosCompensaciones/anularSaltosCompensaciones",
    saltosCompensacionesGuardia_borrar: "guardia/saltosCompensaciones/borrarSaltosCompensaciones",
    saltosCompensacionesGuardia_comboColegiados: "guardia/letradosGuardia",
    saltosCompensacionesGuardia_esGuardia: "guardia/saltosCompensaciones/isGrupo",

    //Incompatibilidades
    guardiasIncompatibilidades_buscarIncompatibilidades : "guardia/buscarIncompatibilidades",
    guardiasIncompatibilidades_eliminarIncompatibilidades:  "guardia/eliminarIncompatibilidades",
    guardiasIncompatibilidades_guardarIncompatibilidades: "guardia/guardarIncompatibilidades",
    guardiasIncompatibilidades_getCombo: "guardia/getComboGuardiasInc",

    //Calendarios programados
    guardiaCalendario_buscar : "guardia/buscarCalendariosProgramados",
    guardiaCalendario_eliminar : "guardia/eliminarCalendariosProgramados",
    guardiaCalendario_guardar : "guardia/guardarCalendariosProgramados",
    guardiaCalendario_guardiaFromConjunto: "guardia/guardiasFromIdConjunto",
    guardiaCalendario_getGuardiasFromCalendar : "guardia/getGuardiasCalendario",
    guardiaCalendario_getFechasProgFromGuardia: "guardia/getFechasProgramacionGuardia",
    guardiaCalendario_guardarGuardiaConjunto: "guardia/addGuardiaConjunto",
    guardiaCalendario_guardarGuardiaCalendar: "guardia/addGuardiaCalendario",
    guardiaCalendario_eliminarGuardiaCalendar: "guardia/deleteGuardiaCalendario",
    guardiaCalendario_updateCalendarioProgramado: "guardia/updateCalendarioProgramado",
    guardiaCalendario_newCalendarioProgramado: "guardia/newCalendarioProgramado",
    guardiaCalendario_generar: "guardia/generarCalendario",
    guardiaCalendario_descargarExcelLog: "guardia/descargarExcelLog",
    

    //Asistencia
    busquedaGuardias_getTurnosByColegiadoFecha: "asistencia/turnosByColegiadoFecha",
    busquedaGuardias_getTiposAsistencia: "asistencia/getTiposAsistencia",
    busquedaGuardias_getLetradosGuardiaDia: "asistencia/getColegiadosGuardiaDia",
    busquedaGuardias_buscarAsistencias: "asistencia/buscarAsistencias",
    busquedaGuardias_getComisarias: "asistencia/getComisarias",
    busquedaGuardias_getJuzgados: "asistencia/getJuzgados",
    busquedaGuardias_guardarAsistencias: "asistencia/guardarAsistenciasExpres",
    busquedaGuardias_buscarAsistenciasAsociadas: "asistencia/buscarAsistenciasByIdSolicitud",
    busquedaGuardias_getDefaultTipoAsistenciaColegio: "asistencia/getDefaultTipoAsistenciaColegio",
    busquedaGuardias_guardarAsistenciasDatosGenerales: "asistencia/guardarAsistencia",
    busquedaGuardias_buscarTarjetaAsistencia: "asistencia/buscarTarjetaAsistencia",
    busquedaGuardias_updateEstadoAsistencia: "asistencia/updateEstadoAsistencia",
    busquedaGuardias_asociarAsistido: "asistencia/asociarAsistido",
    busquedaGuardias_desasociarAsistido: "asistencia/desasociarAsistido",
    busquedaGuardias_searchListaContrarios: "asistencia/searchListaContrarios",
    busquedaGuardias_asociarContrario: "asistencia/asociarContrario",
    busquedaGuardias_desasociarContrario: "asistencia/desasociarContrario",
    busquedaGuardias_searchTarjetaDefensaJuridica: "asistencia/searchTarjetaDefensaJuridica",
    busquedaGuardias_guardarTarjetaDefensaJuridica: "asistencia/guardarTarjetaDefensaJuridica",
    busquedaGuardias_searchTarjetaObservaciones: "asistencia/searchTarjetaObservaciones",
    busquedaGuardias_guardarTarjetaObservaciones: "asistencia/guardarTarjetaObservaciones",
    busquedaGuardias_searchRelaciones: "asistencia/searchRelaciones",
    busquedaGuardias_asociarDesigna: "asistencia/asociarDesigna",
    busquedaGuardias_asociarEjg: "asistencia/asociarEjg",
    busquedaGuardias_eliminarRelacion: "asistencia/eliminarRelacion",
    busquedaGuardias_searchDocumentacion: "asistencia/searchDocumentacion",
    busquedaGuardias_subirDocumentoAsistencia: "asistencia/subirDocumentoAsistencia",
    busquedaGuardias_eliminarDocumentoAsistencia: "asistencia/eliminarDocumentoAsistencia",
    busquedaGuardias_descargarDocumentosAsistencia: "asistencia/descargarDocumentoAsistencia",
    busquedaGuardias_searchCaracteristicas: "asistencia/searchCaracteristicas",
    busquedaGuardias_saveCaracteristicas: "asistencia/saveCaracteristicas",
    busquedaGuardias_searchActuaciones: "asistencia/searchActuaciones",
    busquedaGuardias_updateEstadoActuacion: "asistencia/updateEstadoActuacion",
    busquedaGuardias_eliminarActuaciones: "asistencia/eliminarActuaciones",

    //Actuaciones asistencias
    actuaciones_searchTarjetaActuacion: "actuacionAsistencia/searchTarjetaActuacion",
    actuaciones_searchTarjetaDatosGenerales: "actuacionAsistencia/searchTarjetaDatosGenerales",
    actuaciones_saveTarjetaDatosGenerales: "actuacionAsistencia/saveDatosGenerales",
    actuaciones_searchTarjetaJustificacion: "actuacionAsistencia/searchTarjetaJustificacion",
    actuaciones_saveTarjetaJustificacion: "actuacionAsistencia/saveTarjetaJustificacion",
    actuaciones_updateEstadoActuacion: "actuacionAsistencia/updateEstadoActuacion",
    actuaciones_searchHistorico: "actuacionAsistencia/searchHistorico",

    //Preasistencias
    busquedaPreasistencias_buscarPreasistencias: "preasistencia/buscarPreAsistencias",
    busquedaPreasistencias_denegarPreasistencias: "preasistencia/denegarPreAsistencias",
    busquedaPreasistencias_activarPreasistenciasDenegadas: "preasistencia/activarPreAsistenciasDenegadas",
    //Inscripciones
    guardiasInscripciones_buscarInscripciones : "guardia/busquedainscripciones",


}