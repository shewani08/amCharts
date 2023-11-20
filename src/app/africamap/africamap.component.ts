import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { select, selectAll } from 'd3-selection';
import { zoom } from 'd3-zoom';
import * as d3 from 'd3';

@Component({
  selector: 'app-africamap',
  template: `
    <div #mapContainer class="map-container"></div>
    <div *ngIf="showTestMessage" class="test-message">Network graph</div>
  `,
  styles: [`
    .map-container { width: 100%; height: 500px; overflow: hidden; }
    .test-message { margin-top: 10px; font-weight: bold; }
  `]
})
export class AfricamapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  showTestMessage = false;
  zoomBehavior: any; // Define zoomBehavior variable

  ngOnInit(): void {
    // ngOnInit might be called before the view is initialized
    // Avoid heavy DOM manipulations here
  }

  ngAfterViewInit(): void {
    // ngAfterViewInit is called after the view is initialized
    // Perform heavy DOM manipulations here
    this.createAfricamap();
  }

  private createAfricamap(): void {
    if (!this.mapContainer || !this.mapContainer.nativeElement) {
      console.error('Map container not found');
      return;
    }

    const width = 960;
    const height = 600;

    const svg = select(this.mapContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Set up a projection
    const projection = d3.geoMercator().scale(150).translate([width / 2, height / 1.5]);

    // Create a path generator
    const path = d3.geoPath().projection(projection);

    // Create a zoom behavior
    this.zoomBehavior = zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => this.zoomed(event));

    svg.call(this.zoomBehavior);

    // Load GeoJSON data
    d3.json('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson').then((world: any) => {
      // Handle different GeoJSON structures
      const geojsonFeatures = world.features || world.geometries || [world];

      // Draw the map
      const countries = svg.selectAll('path')
        .data(geojsonFeatures)
        .enter().append('path')
        .attr('d', (datum: any) => path(datum) as string)
       .style('fill', '#69b3a2') // Set the initial fill color
        .text(function(d) {
          return 'hello'
        })
        .on('click', (event: any, datum: any) => this.handleCountryClick(event, datum))
        .on('mouseover', (event: any, datum: any) => this.handleCountryHover(event, datum, true))
        .on('mouseout', (event: any, datum: any) => this.handleCountryHover(event, datum, false));

      // Add tooltip
      countries.append('title')
        .text((datum: any) => datum.properties.ADMIN);
    });
  }

  private handleCountryClick(event: any, datum: any): void {
    console.log('datum',datum);
    // Implement your logic to show a popup or perform an action when a country is clicked
    alert(`Clicked on ${datum.properties.ADMIN}`);

    // Set the variable to show the test message
    this.showTestMessage = true;

    // You can set a timeout to hide the message after a certain period
    setTimeout(() => {
      this.showTestMessage = false;
    }, 3000); // Set the timeout duration in milliseconds (e.g., 3000 ms = 3 seconds)
  }

  private handleCountryHover(event: any, datum: any, isHovered: boolean): void {
   // alert(`Hover on ${datum.properties.ADMIN}`);
   d3.select('#tooltip')
   .transition()
   .duration(200)
   .style('opacity', 0.9)
   //.text(datum.properties.ADMIN);
    const hoveredColor = '#ffcc00'; // Change this to your desired hover color
    select(event.target).style('fill', isHovered ? datum.geometry.coordinates[0][0][0][0]>=0 ?
     datum.geometry.coordinates[0][0][0][0]>=17? 'blue':'red':'green':'#69b3a2');
       
  } 
  private zoomed(event: any): void {
    const { transform } = event;
    select(this.mapContainer.nativeElement)
      .select('svg')
      .attr('transform', transform);
  }
}
