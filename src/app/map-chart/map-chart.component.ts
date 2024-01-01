import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';

@Component({
  selector: 'app-map-chart',
  templateUrl: './map-chart.component.html',
  styleUrls: ['./map-chart.component.css']
})
export class MapChartComponent implements OnInit, AfterViewInit {
  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.run(() => {
      this.initializeMapChart();
    });
  }
 ngOnInit(): void {
   
 }
  initializeMapChart(): void {
    // Declare GeoJSON variable before usage
    const am5geodata_worldLow1: GeoJSON.FeatureCollection = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {
            "id": "london",
            "name": "London"
          },
          "geometry": {
            "type": "Point",
            "coordinates": [-0.1262, 51.5002]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "brussels",
            "name": "Brussels"
          },
          "geometry": {
            "type": "Point",
            "coordinates": [4.3676, 50.8371]
          }
        },
        {
          "type": "Feature",
          "properties": {
            "id": "prague",
            "name": "Prague"
          },
          "geometry": {
            "type": "Point",
            "coordinates": [14.4205, 50.0878]
          }
        },
        // Add more countries as needed
      ]
    };

    let root = am5.Root.new('map-chart');

    let chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: 'translateX',
      panY: 'translateY',
      projection: am5map.geoMercator()
    }));
console.log('coming here');
    let polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
      geoJSON: am5geodata_worldLow,
      valueField: "value",
        calculateAggregates: true,
        interactive: true
    }));

    let graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
    graticuleSeries.mapLines.template.setAll({
      stroke: root.interfaceColors.get('alternativeBackground'),
      strokeOpacity: 0.08
    });

    let lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
    lineSeries.mapLines.template.setAll({
      stroke: root.interfaceColors.get('alternativeBackground'),
      strokeOpacity: 0.6
    });

    let citySeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

   // citySeries.data.setAll(am5geodata_worldLow.features);

    citySeries.bullets.push(function () {
      let circle = am5.Circle.new(root, {
        radius: 5,
        tooltipText: '{name}',
        tooltipY: 0,
        fill: am5.color(0xffba00),
        stroke: root.interfaceColors.get('background'),
        strokeWidth: 2
      });

      return am5.Bullet.new(root, {
        sprite: circle
      });
    });
  }
}
