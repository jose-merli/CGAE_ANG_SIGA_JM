import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service'
import { Router } from '@angular/router'


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    form: FormGroup;

    instituciones = [
        { "value": "2037", "name": "A CORUÑA" },
        { "value": "2001", "name": "ALAVA" },
        { "value": "2002", "name": "ALBACETE (En producción: 23/09/14)" },
        { "value": "2003", "name": "ALCALÁ DE HENARES (En producción: 11/09/07)" },
        { "value": "2004", "name": "ALCOY (En producción: 05/07/10)" },
        { "value": "2005", "name": "ALICANTE (En producción: 30/06/08)" },
        { "value": "2006", "name": "ALMERÍA (En producción: 20/09/10)" },
        { "value": "2007", "name": "ALZIRA" },
        { "value": "2008", "name": "ANTEQUERA (En producción: 08/02/08)" },
        { "value": "2009", "name": "AVILA (En producción: 22/05/13)" },
        { "value": "2010", "name": "BADAJOZ (En producción: 29/08/08)" },
        { "value": "2011", "name": "BALEARES (En producción: 11/04/07)" },
        { "value": "2012", "name": "BARCELONA" },
        { "value": "2013", "name": "BURGOS (En producción: 13/07/09)" },
        { "value": "3003", "name": "C.ANDALUZ (En producción: 06/08/07)" },
        { "value": "3010", "name": "C.ARAGÓN" },
        { "value": "3009", "name": "C.CANARIO" },
        { "value": "3007", "name": "C.CASTILLA LA MANCHA" },
        { "value": "3006", "name": "C.CASTILLA Y LEÓN" },
        { "value": "3001", "name": "C.CATALUNYA (En producción: 20/03/13)" },
        { "value": "3005", "name": "C.GALEGA" },
        { "value": "3008", "name": "C.MADRID" },
        { "value": "3004", "name": "C.VALENCI (En producción: 02/08/07)" },
        { "value": "2014", "name": "CÁCERES (En producción: 01/07/08)" },
        { "value": "2015", "name": "CÁDIZ" },
        { "value": "2016", "name": "CANTABRIA (En producción: 29/01/08)" },
        { "value": "2017", "name": "CARTAGENA (En producción: 13/06/12)" },
        { "value": "2018", "name": "CASTELLÓN (En producción: 22/07/09)" },
        { "value": "2019", "name": "CEUTA (En producción: 14/09/10)" },
        { "value": "2020", "name": "CIUDAD REAL (En producción: 27/11/09)" },
        { "value": "2500", "name": "COMISION ASTURIANA (En producción: 07/04/14)" },
        { "value": "2501", "name": "COMISION MURCIANA (En producción: 06/05/16)" },
        { "value": "2502", "name": "Comisión Toledo (En producción: 14/11/16)" },
        { "value": "2021", "name": "CÓRDOBA (En producción: 01/12/09)" },
        { "value": "2022", "name": "CUENCA" },
        { "value": "2023", "name": "ELCHE (En producción: 23/06/10)" },
        { "value": "2024", "name": "ESTELLA (En producción: 01/04/08)" },
        { "value": "3002", "name": "EUSKAL K." },
        { "value": "2025", "name": "FERROL (En producción: 28/05/12)" },
        { "value": "2026", "name": "FIGUERES (En producción: 22/04/08)" },
        { "value": "2000", "name": "GENERAL (En producción: 11/05/07)" },
        { "value": "2027", "name": "GIJÓN (En producción: 02/09/08)" },
        { "value": "2032", "name": "GIPUZKOA (En producción: 12/09/11)" },
        { "value": "2028", "name": "GIRONA" },
        { "value": "2029", "name": "GRANADA" },
        { "value": "2030", "name": "GRANOLLERS (En producción: 28/02/08)" },
        { "value": "2031", "name": "GUADALAJARA (En producción: 02/07/10)" },
        { "value": "2033", "name": "HUELVA" },
        { "value": "2034", "name": "HUESCA (En producción: 22/11/11)" },
        { "value": "3500", "name": "IT-CGAE (En producción: 07/08/07)" },
        { "value": "2035", "name": "JAÉN (En producción: 12/03/08)" },
        { "value": "2036", "name": "JEREZ DE LA FRONTERA (En producción: 09/10/08)" },
        { "value": "2058", "name": "LA RIOJA (En producción: 06/02/12)" },
        { "value": "2038", "name": "LANZAROTE (En producción: 01/04/08)" },
        { "value": "2039", "name": "LAS PALMAS" },
        { "value": "2040", "name": "LEÓN (En producción: 06/06/08)" },
        { "value": "2041", "name": "LLEIDA (En producción: 07/05/08)" },
        { "value": "2042", "name": "LORCA" },
        { "value": "2043", "name": "LUCENA (En producción: 19/02/08)" },
        { "value": "2044", "name": "LUGO (En producción: 26/04/12)" },
        { "value": "2045", "name": "MADRID" },
        { "value": "2046", "name": "MÁLAGA" },
        { "value": "2047", "name": "MANRESA (En producción: 20/11/07)" },
        { "value": "2048", "name": "MATARÓ (En producción: 06/03/08)" },
        { "value": "2049", "name": "MELILLA (En producción: 11/04/07)" },
        { "value": "2050", "name": "MURCIA (En producción: 21/05/09)" },
        { "value": "2051", "name": "ORIHUELA (En producción: 10/06/08)" },
        { "value": "2052", "name": "OURENSE" },
        { "value": "2053", "name": "OVIEDO (En producción: 10/05/12)" },
        { "value": "2054", "name": "PALENCIA (En producción: 28/02/08)" },
        { "value": "2055", "name": "PAMPLONA (En producción: 09/03/09)" },
        { "value": "2056", "name": "PONTEVEDRA" },
        { "value": "2057", "name": "REUS (En producción: 28/01/08)" },
        { "value": "2059", "name": "SABADELL (En producción: 13/02/08)" },
        { "value": "2060", "name": "SALAMANCA (En producción: 19/12/11)" },
        { "value": "2061", "name": "SANT FELIU (En producción: 28/01/08)" },
        { "value": "2062", "name": "SANTA CRUZ DE LA PALMA (En producción: 01/04/08)" },
        { "value": "2063", "name": "SANTA CRUZ DE TENERIFE (En producción: 06/04/09)" },
        { "value": "2064", "name": "SANTIAGO (En producción: 02/07/10)" },
        { "value": "2065", "name": "SEGOVIA (En producción: 31/05/10)" },
        { "value": "2066", "name": "SEVILLA" },
        { "value": "2067", "name": "SORIA" },
        { "value": "2068", "name": "SUECA (En producción: 28/05/14)" },
        { "value": "2069", "name": "TAFALLA (En producción: 30/01/08)" },
        { "value": "2070", "name": "TALAVERA DE LA REINA" },
        { "value": "2071", "name": "TARRAGONA" },
        { "value": "2072", "name": "TERRASSA (En producción: 03/12/08)" },
        { "value": "2073", "name": "TERUEL" },
        { "value": "2074", "name": "TOLEDO (En producción: 25/08/16)" },
        { "value": "2075", "name": "TORTOSA (En producción: 19/02/08)" },
        { "value": "2077", "name": "TUDELA (En producción: 22/02/08)" },
        { "value": "2076", "name": "VALENCIA" },
        { "value": "2078", "name": "VALLADOLID (En producción: 20/06/08)" },
        { "value": "2079", "name": "VIC (En producción: 16/04/08)" },
        { "value": "2080", "name": "VIGO" },
        { "value": "2081", "name": "VIZCAYA" },
        { "value": "2082", "name": "ZAMORA" },
        { "value": "2083", "name": "ZARAGOZA (En producción: 13/03/09)" }
    ];



    constructor(private fb: FormBuilder, private service: AuthenticationService, private router: Router) { }



    onSubmit() { }

    ngOnInit() {
        this.form = this.fb.group({
            tmpLoginInstitucion: new FormControl("2000"),
            tmpLoginPerfil: new FormControl("ADG"),
            sLetrado: new FormControl("N"),

            user: new FormControl(),
            letrado: new FormControl("N"),
            location: new FormControl("2000"),
            profile: new FormControl("ADG"),

            posMenu: new FormControl(0),

        });

        this.form.controls['tmpLoginInstitucion'].valueChanges.subscribe(newValue => {
            this.form.controls['location'].setValue(newValue);
        });

        this.form.controls.tmpLoginPerfil.valueChanges.subscribe(n => {
            this.form.controls['profile'].setValue(n);
        });

        this.form.controls.sLetrado.valueChanges.subscribe(n => {
            this.form.controls['letrado'].setValue(n);
        })


        // this.form.setValue({'location': this.form.value.tmpLoginInstitucion});
    }


    submit() {
        this.service.autenticate(this.form.value).subscribe(response => {
            if (response) {
                this.router.navigate(['/home'])
            } else {
                this.router.navigate(['/landpage'])
            }
        })
    }




}