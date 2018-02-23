import { TestBed, inject } from '@angular/core/testing';

import { WorldcupService } from './worldcup.service';

describe('WorldcupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorldcupService]
    });
  });

  it('should be created', inject([WorldcupService], (service: WorldcupService) => {
    expect(service).toBeTruthy();
  }));
});
