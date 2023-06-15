import { TestBed, inject } from '@angular/core/testing';

import { SigaStorageService } from './siga-storage.service';

describe('SigaStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SigaStorageService]
    });
  });

  it('should be created', inject([SigaStorageService], (service: SigaStorageService) => {
    expect(service).toBeTruthy();
  }));
});
