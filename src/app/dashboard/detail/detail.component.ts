import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPreparedIFhirPatient, IPreparedIFhirPractitioner } from '@red-probeaufgabe/types';

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  public entity: IPreparedIFhirPatient | IPreparedIFhirPractitioner;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {entity: IPreparedIFhirPatient | IPreparedIFhirPractitioner}
  ) { 
    console.log(this.data.entity);
    
   this.entity = data.entity;
  }

  ngOnInit(): void {
  }

}
