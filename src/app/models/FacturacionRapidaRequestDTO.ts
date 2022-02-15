export class FacturacionRapidaRequestDTO {
    idInstitucion: string;
    idPeticion: string; // Se rellena solo cuando vengamos de una compra
    idSolicitudCertificado: string; // Se rellena solo cuando vengamos de un certificado
    idSerieFacturacion: string;
}