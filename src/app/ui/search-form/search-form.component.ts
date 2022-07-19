import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FhirSearchFn } from '@red-probeaufgabe/types';

/**
 * Interface for the options.
 */
interface IOption {
  /**
   * Displayed label.
   */
  label: string;

  /**
   * Value of the option.
   */
  value: FhirSearchFn;
}

/**
 * The output values.
 */
export interface IOutputValues {
  /**
   * The name.
   */
  name: string;

  /**
   * The category.
   */
  category: FhirSearchFn;
}

@Component({
  selector: 'app-search',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent {

  /**
   * The form group for the search.
   */
  public searchForm: FormGroup;

  /**
   * The options for the dropdown.
   */
  public selOptions: IOption[] = [
    {
      label: 'Patients and Practitioners',
      value: FhirSearchFn.SearchAll
    },
    {
      label: 'Patients',
      value: FhirSearchFn.SearchPatients
    },
    {
      label: 'Practitioners',
      value: FhirSearchFn.SearchPractitioners
    }
  ];

  @Output() public onFilterChanged: EventEmitter<IOutputValues>;

  /**
   * Ctor.
   */
  constructor(
    private readonly fb: FormBuilder
  ){
    this.searchForm = this.fb.group({
      name:  ['', [
        Validators.pattern('^[a-zA-Z0-9]*$')
      ]],
      category: [FhirSearchFn.SearchAll]
    });
    this.onFilterChanged = new EventEmitter();

    this.searchForm.valueChanges.subscribe((values) => {
      if (this.searchForm.valid) {
        this.onFilterChanged.emit(values as IOutputValues);
      }
    })
  }
}
