// table-basic-example.component.ts

import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

export interface PeriodicElement {
  
  name: string;
  position: number;
  weight: string;
  symbol: string;
  website?: string; // 
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'OpenDataForAfrica', weight: 'Deep Dive', symbol: 'Section 1 - Resilience of Govt. - Inflation', website: 'https://dataportal.opendataforafrica.org/cgbflkc/prices/' },
  { position: 2, name: 'ND-GAIN - Health Vulnerability', weight: 'Deep Dive', symbol: 'Section 1 - Resilience of Govt. - Health', website: 'https://gain.nd.edu/our-work/country-index/download-data/' },
  { position: 3, name: 'TheWorldBank - Voice and Accountability', weight: 'Deep Dive', symbol: 'Section 1 - Resilience of Govt. - Social', website: 'https://www.worldbank.org/en/publication/worldwide-governance-indicators/' },
  { position: 4, name: 'TheWorldBank - Rule of Law', weight: 'Deep Dive', symbol: 'Section 1 - Resilience of Govt. - Social', website: 'https://www.worldbank.org/en/publication/worldwide-governance-indicators' },
  { position: 5, name: 'ND-GAIN - Social Readiness', weight: 'Deep Dive', symbol: 'Section 1 - Resilience of Govt. - Social', website: 'https://gain.nd.edu/our-work/country-index/download-data/' },
  { position: 6, name: 'ND-GAIN - Economic Readiness', weight: 'Deep Dive', symbol: 'Section 1 - Resilience of Govt. - Economic', website: 'https://gain.nd.edu/our-work/country-index/download-data/' },
  { position: 7, name: 'ND-GAIN - Governance Readiness', weight: 'Deep Dive', symbol: 'Section 1 - Resilience of Govt. - Economic', website: 'https://gain.nd.edu/our-work/country-index/download-data/' },
  { position: 8, name: 'TheWorldBank - Political Stability No Violence', weight: 'Deep Dive', symbol: 'Section 1 - Resilience of Govt. - Political', website: 'https://www.worldbank.org/en/publication/worldwide-governance-indicators/' },
  { position: 9, name: 'TheWorldBank - Government Effectiveness', weight: 'Deep Dive', symbol: 'Section 1 - Resilience of Govt. - Political', website: 'https://www.worldbank.org/en/publication/worldwide-governance-indicators/' },
  { position: 10, name: 'TheWorldBank - Control of Corruption', weight: 'Deep Dive', symbol: 'Section 1 - Resilience of Govt. - Political', website: 'https://www.worldbank.org/en/publication/worldwide-governance-indicators/' },
  { position: 11, name: 'TheWorldBank - Regulatory Quality', weight: 'Deep Dive', symbol: 'Section 1 - Resilience of Govt. - Political', website: 'https://www.worldbank.org/en/publication/worldwide-governance-indicators/'},
  { position: 12, name: 'JMP - Water Access', weight: 'Deep Dive', symbol: 'Section 1 - Resilience of Govt. - Food & Water', website: 'https://washdata.org/data/household#!/'},
  { position: 13, name: 'ND-GAIN - Water Vulnerability', weight: 'Deep Dive', symbol: 'Section 1 - Resilience of Govt. - Food & Water', website: 'https://ourworldindata.org/hunger-and-undernourishment/'},
  { position: 14, name: 'ND-GAIN - Food Vulnerability', weight: 'Deep Dive', symbol: 'Section 1 - Resilience of Govt. - Food & Water', website: 'https://ourworldindata.org/hunger-and-undernourishment/'},
  { position: 15, name: 'OurWorldInData - Hunger and Undernourishment', weight: 'Deep Dive', symbol: 'Section 1 - Resilience of Govt. - Food & Water', website: 'https://ourworldindata.org/hunger-and-undernourishment/'},
  { position: 16, name: 'Frontex - Irregular Migrants', weight: 'Deep Dive', symbol: 'Number of Irregular Migrants', website: 'https://www.frontex.europa.eu/what-we-do/monitoring-and-risk-analysis/migratory-map/'},
  { position: 17, name: 'IDMC - Internal Displacements', weight: 'Deep Dive', symbol: 'Internal Displacements due to Climate Change', website: 'https://www.internal-displacement.org/database/displacement-data'},
  { position: 18, name: 'GOV.UK - Irregular Migrants in UK', weight: 'Deep Dive', symbol: 'Irregular Migrants (UK)', website: 'https://www.gov.uk/government/statistical-data-sets/irregular-migration-detailed-dataset-and-summary-tables#most-recent-summary-tables'}
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

