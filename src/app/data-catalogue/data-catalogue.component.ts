// table-basic-example.component.ts

import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

export interface PeriodicElement {
  
  name: string;
  position: number;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Dataset 1', weight: 'text here', symbol: 'B1' },
  { position: 2, name: 'Dataset 2', weight: 'text here', symbol: 'B1' },
  { position: 3, name: 'Dataset 3', weight: 'text here', symbol: 'B1' },
  { position: 4, name: 'Dataset 4', weight: 'text here', symbol: 'B1' },
  { position: 5, name: 'Dataset 5', weight: 'text here', symbol: 'B1' },
  // ... (add other data)
];

@Component({
  selector: 'app-data-catalogue',
  templateUrl: './data-catalogue.component.html',
  styleUrls: ['./data-catalogue.component.css']
  

})
export class DataCatalogueComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  displayedColumns: string[] = ['position', 'name', 'weight','symbol'];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<PeriodicElement>();
}

