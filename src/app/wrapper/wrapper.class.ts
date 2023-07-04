import { USUARIO_VAL_MSG, MATRIX_REL } from './../properties/val-properties';
import { VAL_MESSAGES } from './../properties/message-properties';
import {
  FormGroup,
  FormControl,
  FormGroupDirective,
  NgForm
} from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
// import { TranslateService } from 'ng2-translate';
import { Injectable } from '@angular/core';
import _ from 'lodash';
import { USUARIO_VALIDATIONS } from '../properties/val-properties';

export class SigaWrapper {
  formErrors: Map<string, any[]>;

  formGroup: FormGroup;
  formControlsMap: Map<string, any[]>;

  languageChangedSubscription: Subscription;
  // private translateService1: TranslateService;
  constructor(validations: Map<string, any[]>) {
    this.formControlsMap = validations;
    const formGroupParams = {};

    this.formControlsMap.forEach((value: any[], key: string) => {
      formGroupParams[key] = new FormControl('', value);
    });

    this.formGroup = new FormGroup(formGroupParams);
  }

  hasErrors(field: string) {
    return (
      !this.formGroup.get(field).pristine && !this.formGroup.get(field).valid
    );
  }

  getErrorMessage(field: string) {
    const msg = MATRIX_REL.get(this.formControlsMap).get(field);
    const errors: string[] = [];
    msg.forEach((value: string, key: string) => {
      if (this.formGroup.get(field).errors[key] !== undefined) {
        errors.push(msg.get(key));
      }
    });

    let translatedErrors: any;
    let concatenatedErrors: string = '';
    if (errors.length > 0) {
      // translatedErrors = this.translateService1.instant(errors);
      let i: number = 0;
      for (i = 0; i < errors.length; i++) {
        concatenatedErrors += errors[i] + '. ';
      }
    }

    return concatenatedErrors;
  }

  // setServices(
  // translateService: TranslateService
  // ) {
  // this.translateService1 = translateService;

  // // Subscribe to detect language changes.
  // this.languageChangedSubscription = this.streamControlService1.languageAnnounce$.subscribe(
  //   language => {
  //     if (language !== '') {
  //       this.translateService1.use(language);
  //     }
  //   }
  // );
  // }

  createInstanceFromObject<T>(objType: { new(): T }, input: any) {
    const newObj = new objType();

    for (const prop in input) {
      if (input.hasOwnProperty(prop)) {
        if (newObj[prop] == null) {
          newObj[prop] = input[prop];
        } else {
          newObj[prop] = this.createInstanceFromObject(
            newObj[prop],
            input[prop]
          );
        }
      }
    }
    return newObj;
  }
  // }
  // export class CustomErrorStateMatcher implements ErrorStateMatcher {
  //   isErrorState(
  //     control: FormControl | null,
  //     form: FormGroupDirective | NgForm | null
  //   ): boolean {
  //     const isSubmitted = form && form.submitted;
  //     return !!(
  //       control &&
  //       control.invalid &&
  //       (control.dirty || control.touched || isSubmitted)
  //     );
  //   }
}
