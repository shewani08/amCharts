import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { FeatureCollection, Geometry, Point } from 'geojson';

@Component({
  selector: 'app-heatmap',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit {
  @ViewChild('heatmap', { static: true }) heatmapRef!: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.drawMap();
  }

  drawMap() {
    const width = 700;
    const height = 600;

    const svg = d3.select(this.heatmapRef.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Load your GeoJSON data for countries
    // Replace 'assets/custom.json' with the actual path to your GeoJSON file
    d3.json('assets/custom.json').then((data: unknown) => {
      const geoJSONData = data as FeatureCollection<Geometry, { [name: string]: any }>;

      // Extract the maximum value from the data (you can replace this with your own data)
      const maxDataValue = d3.max(geoJSONData.features, (d: any) => d.properties.value);

      // Create a color scale
      const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, maxDataValue || 1]);

      // Create a projection
      const projection = d3.geoMercator()
        .fitSize([width, height], geoJSONData as any)
        .center([20, 0]);

      const path = d3.geoPath().projection(projection);

      // Draw the map with heatmap colors
      const countries = svg.selectAll('path')
        .data(geoJSONData.features)
        .enter()
        .append('path')
        .attr('d', d => path(d) as string)
        .attr('fill', d => colorScale((d.properties as { [key: string]: any })['value'] || 0))
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
        .on('click', function (event, d) {
          const message = 'Test Window';
          const newWindow = window.open('', '_blank', 'width=400,height=200');

          if (newWindow) {
            newWindow.document.write(`<html><head><title>Popup Window</title></head><body>${message}</body></html>`);
          } else {
            console.error('Popup window blocked by the browser. Please allow pop-ups for this site.');
          }
        })
        .on('mouseover', function (event, d) {
          d3.select(this).attr('fill', 'orange'); // Change color on hover
          showTooltip(event, d);
        })
        .on('mouseout', function (event, d) {
          const originalColor = colorScale((d.properties as { [key: string]: any })['value'] || 0);
          d3.select(this).attr('fill', originalColor); // Restore original color on mouseout
          hideTooltip();
        });

      // Add labels
      svg.selectAll('text')
        .data(geoJSONData.features)
        .enter()
        .append('text')
        .text(d => (d.properties as { [key: string]: any })['name'] || '')
        .attr('x', d => {
          const coordinates = (d.geometry as Point).coordinates as [number, number] | null;
          return coordinates ? (projection(coordinates) || [])[0] || 0 : 0;
        })
        .attr('y', d => {
          const coordinates = (d.geometry as Point).coordinates as [number, number] | null;
          return coordinates ? (projection(coordinates) || [])[1] || 0 : 0;
        })
        .attr('dy', -10)
        .attr('text-anchor', 'middle');

      // Function to show tooltip
      function showTooltip(event: any, d: any) {
        const tooltip = d3.select('body').append('div')
          .attr('class', 'tooltip')
          .style('position', 'absolute')
          .style('opacity', 0);

        tooltip.transition()
          .duration(200)
          .style('opacity', .9);

        tooltip.html((d.properties as { [key: string]: any })['name'] || '')
          .style('left', (event.pageX || 0) + 'px')
          .style('top', (event.pageY ? event.pageY - 28 : 0) + 'px');
      }

      // Function to hide tooltip
      function hideTooltip() {
        d3.select('.tooltip')
          .transition()
          .duration(500)
          .style('opacity', 0)
          .remove();
      }
    });
  }
}
