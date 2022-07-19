import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, tap } from 'rxjs/operators';
import { SiteTitleService } from '@red-probeaufgabe/core';
import { FhirSearchFn, IFhirPatient, IFhirPractitioner, IFhirSearchResponse, IPreparedIFhirPatient, IPreparedIFhirPractitioner } from '@red-probeaufgabe/types';
import { IOutputValues, IUnicornTableColumn } from '@red-probeaufgabe/ui';
import { AbstractSearchFacadeService, FhirUtilService } from '@red-probeaufgabe/search';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DetailComponent } from './detail/detail.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  // Init unicorn columns to display
  columns: Set<IUnicornTableColumn> = new Set<IUnicornTableColumn>([
    'number',
    'resourceType',
    'name',
    'gender',
    'birthDate',
  ]);
  isLoading = true;

  /*
   * Implement search on keyword or fhirSearchFn change
   **/
  search$: Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>>;

  entries$: Observable<Array<IFhirPatient | IFhirPractitioner>>;

  totalLength$: Observable<number>;
  constructor(private siteTitleService: SiteTitleService, private searchFacade: AbstractSearchFacadeService, private fhirUtilService: FhirUtilService, private daliogService: MatDialog) {
    this.siteTitleService.setSiteTitle('Dashboard');
    this.search$ = this.createSearchObservable(FhirSearchFn.SearchAll, '');
    this.entries$ = this.search$.pipe(
      map((data) => !!data && data.entry),
      startWith([]),
    );
    this.totalLength$ = this.search$.pipe(
      map((data) => !!data && data.total),
      startWith(0),
    );
  }

  /**
   * Function to call if the filters changed.  
   * @param values The filter values
   */
  public filterChanged(values: IOutputValues) {
    this.search$ = this.createSearchObservable(values.category, values.name);
    this.entries$ = this.search$.pipe(
      map((data) => !!data && data.entry),
      startWith([]),
    );
    this.totalLength$ = this.search$.pipe(
      map((data) => !!data && data.total),
      startWith(0),
    );
    
  }

  /**
   * Function to call if a row is clicked.
   * @param entity The entity.
   */
  public openDetail(entity: IFhirPatient | IFhirPractitioner): void {
   const transformedEntitiy: IPreparedIFhirPatient | IPreparedIFhirPractitioner = this.fhirUtilService.prepareData(entity);
   const ref = this.daliogService.open(DetailComponent, {
    width: '60vw',
    data: {entity: transformedEntitiy},
   });
  }

  /**
   * Helper function to create the search pipe.
   * 
   * @param type The type to look for.
   * @param search The search string to look for.
   */
  private createSearchObservable(type: FhirSearchFn, search: string): Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> {
    return this.searchFacade.search(type, search)
    .pipe(
      catchError(this.handleError),
      tap((data) => {
        this.isLoading = false;
      }),
      shareReplay(),
    );
  }

  private handleError(): Observable<IFhirSearchResponse<IFhirPatient | IFhirPractitioner>> {
    return of({ entry: [], total: 0 });
  }
}
