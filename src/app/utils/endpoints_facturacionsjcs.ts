export let endpoints_facturacionsjcs: any = {

    combo_comboFactEstados: "combo/comboFactEstados",
    combo_comboPagoEstados: "combo/comboPagoEstados",
    combo_partidasPresupuestarias: "combo/partidasPresupuestarias",
    combo_grupoFacturacion: "combo/grupoFacturacion",
    combo_comboFactConceptos: "combo/comboFactConceptos",
    combo_comboFactColegio: "combo/comboFactColegio",
    combo_comboPagosColegio: "combo/comboPagosColegio",
    combo_comboFacturaciones: "combo/comboFacturaciones",
    combo_comboFactMovimientos: "/combo/comboFactMovimientos",
    combo_AplicadoEnPago: "/combo/comboAplicadoEnPago",
    combo_comboAgrupacionEnTurnos: "/combo/comboAgrupacionEnTurnos",
    combo_comboTiposMovVarios: "/combo/comboTiposMovimientos",
    combo_comboColegios: "combo/getComboColegios",
    combo_grupoFacturacionByColegio: "combo/grupoFacturacionByColegio",

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

    /*Endpoins impreso 190 */

    impreso190_generar: "facturacionsjcs/impreso190generar",

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
    movimientosVarios_saveDatosGenMovimientosVarios: "movimientosVarios/saveDatosGenMovimientosVarios",
    movimientosVarios_updateDatosGenMovimientosVarios: "movimientosVarios/updateDatosGenMovimientosVarios",
    movimientosVarios_saveCriteriosMovimientosVarios: "movimientosVarios/saveCriteriosMovimientosVarios",
    movimientosVarios_updateCriteriosMovimientosVarios: "movimientosVarios/updateCriteriosMovimientosVarios",

}