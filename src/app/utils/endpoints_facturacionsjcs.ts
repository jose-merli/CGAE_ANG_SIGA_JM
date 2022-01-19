export let endpoints_facturacionsjcs: any = {

    combo_comboFactEstados: "combo/comboFactEstados",
    combo_comboPagosjg: "combo/comboPagosjg",
    combo_comboPagoEstados: "combo/comboPagoEstados",
    combo_partidasPresupuestarias: "combo/partidasPresupuestarias",
    combo_grupoFacturacion: "combo/grupoFacturacion",
    combo_comboFactConceptos: "combo/comboFactConceptos",
    combo_comboFactColegio: "combo/comboFactColegio",
    combo_comboPagosColegio: "combo/comboPagosColegio",
    combo_comboEstadosAbono: "combo/estadoAbonos",
    combo_comboGrupoFacturacion: "combo/grupoFacturacion",
    combo_comboFacturaciones: "combo/comboFacturaciones",
    combo_comboFactMovimientos: "/combo/comboFactMovimientos",
    combo_AplicadoEnPago: "/combo/comboAplicadoEnPago",
    combo_comboAgrupacionEnTurnos: "/combo/comboAgrupacionEnTurnos",
    combo_comboTiposMovVarios: "/combo/comboTiposMovimientos",
    combo_comboColegios: "combo/getComboColegios",
    combo_grupoFacturacionByColegio: "combo/grupoFacturacionByColegio",
    combo_certificacionSJCS: "/combo/comboCertificacionSJCS",
    combo_grupoFacturacionByColegios: "combo/grupoFacturacionByColegios",
    combo_factByPartidaPresu: "combo/comboFactByPartidaPresu",
    combo_factNull: "combo/comboFactNull",
    combo_comboFacBaremos: "combo/comboFactBaremos",

    /* Endpoints FACTURACIONSJCS */

    facturacionsjcs_buscarfacturaciones: "facturacionsjcs/buscarfacturaciones",
    facturacionsjcs_eliminarFacturacion: "facturacionsjcs/eliminarFacturacion",
    facturacionsjcs_datosfacturacion: "facturacionsjcs/datosfacturacion",
    facturacionsjcs_historicofacturacion: "facturacionsjcs/historicofacturacion",
    facturacionsjcs_saveFacturacion: "facturacionsjcs/saveFacturacion",
    facturacionsjcs_updateFacturacion: "facturacionsjcs/updateFacturacion",
    facturacionsjcs_ejecutarfacturacion: "facturacionsjcs/ejecutarfacturacion",
    facturacionsjcs_buscarCartasfacturacion: "facturacionsjcs/buscarCartasfacturacion",
    facturacionsjcs_buscarCartaspago: "facturacionsjcs/buscarCartaspago",
    facturacionsjcs_reabrirfacturacion: "facturacionsjcs/reabrirfacturacion",
    facturacionsjcs_simularfacturacion: "facturacionsjcs/simularfacturacion",
    facturacionsjcs_tarjetaConceptosfac: "facturacionsjcs/tarjetaConceptosfac",
    facturacionsjcs_saveConceptosFac: "facturacionsjcs/saveConceptosFac",
    facturacionsjcs_updateConceptosFac: "facturacionsjcs/updateConceptosFac",
    facturacionsjcs_deleteConceptosFac: "facturacionsjcs/deleteConceptosFac",
    facturacionsjcs_datospagos: "facturacionsjcs/datospagos",
    facturacionsjcs_numApuntes: "facturacionsjcs/numApuntes",
    factuarcionsjscs_buscarAbonos : "facturacionsjcs/buscarAbonosSJCS",

    facturacionsjcs_getAgrupacionDeTurnosPorTurno: "facturacionsjcs/getAgrupacionDeTurnosPorTurno",
    facturacionsjcs_descargarLogFacturacion: "facturacionsjcs/getFicheroErroresFacturacion",

    /* Endpoints PAGOSJCS */

    pagosjcs_buscarPagos: "pagosjcs/buscarPagos",
    pagosjcs_datosGeneralesPago: "pagosjcs/datosGeneralesPago",
    pagosjcs_historicoPago: "pagosjcs/historicoPagos",
    pagosjcs_getPago: "pagosjcs/getPago",
    pagosjcs_savePago: "pagosjcs/savePago",
    pagosjcs_updatePago: "pagosjcs/updatePago",
    pagosjcs_deletePago: "pagosjcs/deletePago",
    pagosjcs_ejecutarPago: "pagosjcs/ejecutarPagoSJCS",
    pagosjcs_simularPago: "pagosjcs/simularPagoSJCS",
    pagosjcs_comboConceptoPago: "pagosjcs/comboConceptosPago",
    pagosjcs_getConceptosPago: "pagosjcs/getConceptosPago",
    pagosjcs_saveConceptoPago: "pagosjcs/saveConceptoPago",
    pagosjcs_deleteConceptoPago: "pagosjcs/deleteConceptoPago",
    pagosjcs_comboPropTranferenciaSepa: "pagosjcs/comboPropTranferenciaSepa",
    pagosjcs_comboPropOtrasTranferencias: "pagosjcs/comboPropOtrasTranferencias",
    pagosjcs_comboSufijos: "pagosjcs/comboSufijos",
    pagosjcs_comboCuentasBanc: "pagosjcs/comboCuentasBanc",
    pagosjcs_saveConfigFichAbonos: "pagosjcs/saveConfigFichAbonos",
    pagosjcs_getConfigFichAbonos: "pagosjcs/getConfigFichAbonos",
    pagosjcs_getNumApuntesPago: "pagosjcs/getNumApuntesPago",
    pagosjcs_getCompensacionFacturas: "pagosjcs/getCompensacionFacturas",
    pagosjcs_cerrarPago: "pagosjcs/cerrarPago",
    pagosjcs_cerrarPagoManual: "pagosjcs/cerrarPagoManual",
    pagosjcs_deshacerCierre: "pagosjcs/deshacerCierre",

    /* Endpoints combos Retenciones */
    retenciones_comboDestinatarios: "combo/getComboDestinatarios",
    retenciones_comboPagos: "combo/getComboPagosRetenciones",

    /* Endpoints Retenciones */
    retenciones_buscarRetenciones: "retenciones/searchRetenciones",
    retenciones_buscarRetencion: "retenciones/searchRetencion",
    retenciones_eliminarRetenciones: "retenciones/deleteRetenciones",
    retenciones_saveOrUpdateRetencion: "retenciones/saveOrUpdateRetencion",
    retenciones_buscarRetencionesAplicadas: "retenciones/searchRetencionesAplicadas",
    retenciones_buscarAplicacionesRetenciones: "retenciones/getAplicacionesRetenciones",

    /*Endpoints impreso 190 */

    impreso190_generar: "facturacionsjcs/impreso190generar",
    impreso190_searchImpresos: "facturacionsjcs/searchImpreso190",
    impreso190_descargar: "facturacionsjcs/impreso190descargar",
    impreso190_eliminar: "facturacionsjcs/deleteImpreso190",
    impreso190_searchConfImpreso190: "facturacionsjcs/searchConfImpreso190",
    impreso190_comboAnio: "facturacionsjcs/getComboAnioImpreso190",

    /*Endpoints BaremosGuardias*/
    baremosGuardia_buscar: "baremosGuardia/buscar",
    baremosGuardia_getTurnoForGuardia: "baremosGuardia/getTurnoForGuardia",
    baremosGuardia_getGuardiasByConf: "baremosGuardia/getGuardiasByConf",
    baremosGuardia_saveBaremo: "baremosGuardia/saveBaremo",
    baremosGuardia_getBaremo: "baremosGuardia/getBaremo",

    /* Endpoints Tarjeta genérica facturaciones */
    tarjGenFac_getFacturacionesPorAsuntoActuacionDesigna: "facturacionsjcs/getFacturacionesPorAsuntoActuacionDesigna",
    tarjGenFac_getFacturacionesPorAsuntoAsistencia: "facturacionsjcs/getFacturacionesPorAsuntoAsistencia",
    tarjGenFac_getFacturacionesPorAsuntoActuacionAsistencia: "facturacionsjcs/getFacturacionesPorAsuntoActuacionAsistencia",
    tarjGenFac_getFacturacionesPorGuardia: "facturacionsjcs/getFacturacionesPorGuardia",
    tarjGenFac_getFacturacionesPorEJG: "facturacionsjcs/getFacturacionesPorEJG",

    /* Endpoints Movimientos Varios*/
    movimientosVarios_busquedaMovimientosVarios: "movimientosVarios/busquedaMovimientosVarios",
    movimientosVarios_eliminarMovimiento: "movimientosVarios/deleteMovimientosVarios",
    movimientosVarios_saveClienteMovimientosVarios: "movimientosVarios/saveClienteMovimientosVarios",
    movimientosVarios_updateClienteMovimientosVarios: "movimientosVarios/updateClienteMovimientosVarios",
    movimientosVarios_recogerDatosCliente: "movimientosVarios/recogerDatosCliente",
    movimientosVarios_getListadoPagos: "movimientosVarios/getListadoPagos",
    movimientosVarios_saveMovimientosVarios: "movimientosVarios/saveMovimientosVarios",
    movimientosVarios_updateMovimientosVarios: "movimientosVarios/updateMovimientosVarios",
    // movimientosVarios_saveCriteriosMovimientosVarios: "movimientosVarios/saveCriteriosMovimientosVarios",
    // movimientosVarios_updateCriteriosMovimientosVarios: "movimientosVarios/updateCriteriosMovimientosVarios",
    movimientosVarios_getMovimientoVarioPorId: "movimientosVarios/getMovimientoVarioPorId",

    /* Endpoints Certificaciones */
    certificaciones_getComboEstadosCertificaciones: "certificaciones/getComboEstadosCertificaciones",
    certificaciones_buscarCertificaciones: "certificaciones/buscarCertificaciones",
    certificaciones_eliminarCertificaciones: "certificaciones/eliminarCertificaciones",
    certificaciones_getEstadosCertificacion: "certificaciones/getEstadosCertificacion",
    certificaciones_createOrUpdateCertificacion: "certificaciones/createOrUpdateCertificacion",
    certificaciones_reabrirCertificacion: "certificaciones/reabrirCertificacion",
    certificaciones_getFactCertificaciones: "certificaciones/buscarFactCertificaciones",
    certificaciones_delFactCertificacion: "certificaciones/delFactCertificacion",
    certificaciones_reabrirfacturacion: "certificaciones/reabrirfacturacion",
    certificaciones_getMvariosAsociadosCertificacion: "certificaciones/getMvariosAsociadosCertificacion",
    certificaciones_getMvariosAplicadosEnPagosEjecutadosPorPeriodo: "certificaciones/getMvariosAplicadosEnPagosEjecutadosPorPeriodo",
    certificaciones_saveFactCertificacion: "certificaciones/saveFactCertificacion",
    certificaciones_tramitarCertificacion: "certificaciones/tramitarCertificacion",
    certificaciones_descargarCertificacionesXunta: "certificaciones/descargarCertificacionesXunta",
    certificaciones_descargarLogReintegrosXunta: "certificaciones/descargarLogReintegrosXunta",
    certificaciones_descargarInformeIncidencias: "certificaciones/descargarInformeIncidencias",
    certificaciones_accionXuntaEnvios: "certificaciones/accionXuntaEnvios",
    certificaciones_subirFicheroCAM: "certificaciones/subirFicheroCAM",
    certificaciones_descargaInformeCAM: "certificaciones/descargaInformeCAM",
    certificaciones_perteneceInstitucionCAMoXunta: "certificaciones/perteneceInstitucionCAMoXunta",
}
