import { NgModule } from '@angular/core';
import { PractitionerSearchService } from './services/practitioner-search.service';
import { SearchFacadeService } from './services/search-facade.service';
import { PatientSearchService } from './services/patient-search.service';
import { AbstractSearchFacadeService } from './services/abstract-search-facade.service';

@NgModule({
  providers: [
    PractitionerSearchService,
    PatientSearchService,
    //Abstract Service needs to be provided with a default class implementation. Which was missing beforehand.
    // Therefore the Search provider do not need to be provided since it is the default imp0lementation of the abstract service.
    {
      provide: AbstractSearchFacadeService,
      useClass: SearchFacadeService
    }
  ],
  bootstrap: [],
})
export class SearchModule {}
