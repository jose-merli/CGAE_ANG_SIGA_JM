import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service'
import { SigaServices } from '../../_services/siga.service';
import { Router } from '@angular/router'



export class LoginCombo {


    private value: string;

    geValue(): string {
        return this.value;
    }

    setValue(newValue: string) {
        this.value = newValue;
    }


}