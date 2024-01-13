import { Component } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';


@Component({
  selector: 'app-card2-testing',
  templateUrl: './card2-testing.component.html',
  styleUrls: ['./card2-testing.component.css']
})
export class Card2TestingComponent {
ngOnInit(){

var root = am5.Root.new("chartdivtesting");


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);

const chart = root.container.children.push(am5map.MapChart.new(root, {}));

var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
  geoJSON: am5geodata_worldLow,
  include: [
    'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
    'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'ML', 'MW', 'MR', 'MU',
    'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
    'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ', 'CI'
  ],
 
}));
var graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
graticuleSeries.mapLines.template.setAll({
  stroke: root.interfaceColors.get("alternativeBackground"),
  strokeOpacity: 0.08
});

// Create line series for trajectory lines
// https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/

// this will be invisible line (note strokeOpacity = 0) along which invisible points will animate
var lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
lineSeries.mapLines.template.setAll({
  stroke: root.interfaceColors.get("alternativeBackground"),
  strokeOpacity: 0
});

// this will be visible line. Lines will connectg animating points so they will look like animated
var animatedLineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
animatedLineSeries.mapLines.template.setAll({
  stroke: root.interfaceColors.get("alternativeBackground"),
  strokeOpacity: 1.0});


// destination series
var citySeries = chart.series.push(
  am5map.MapPointSeries.new(root, {})
);
// visible city circles
citySeries.bullets.push(function() {
  var circle = am5.Circle.new(root, {
    radius: 5,
    tooltipText: "{title}",
    tooltipY: 0,
    fill: am5.color(0xffba00),
    stroke: root.interfaceColors.get("background"),
    strokeWidth: 2
  });

  return am5.Bullet.new(root, {
    sprite: circle
  });
});

// invisible series which will animate along invisible lines
var animatedBulletSeries = chart.series.push(
  am5map.MapPointSeries.new(root, {})
);

animatedBulletSeries.bullets.push(function() {
  var circle = am5.Circle.new(root, {
    radius: 0
  });

  return am5.Bullet.new(root, {
    sprite: circle
  });
});
chart.appear(1000, 100);
}
}
