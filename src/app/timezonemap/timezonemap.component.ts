import { Component } from '@angular/core';


import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';

@Component({
  selector: 'app-timezonemap',
  templateUrl: './timezonemap.component.html',
  styleUrls: ['./timezonemap.component.css']
})
export class TimezonemapComponent {
  countryNames = [
    'Algeria',
    'Angola',
    'Benin',
    'Botswana',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cameroon',
    'Central African Republic',
    'Chad',
    'Comoros',
    'Congo',
    'Côte d\'Ivoire',
    'Djibouti',
    'DR Congo',
    'Egypt',
    'Equatorial Guinea',
    'Eritrea',
    'Eswatini',
    'Ethiopia',
    'Gabon',
    'Gambia',
    'Ghana',
    'Guinea',
    'Guinea-Bissau',
    'Kenya',
    'Lesotho',
    'Liberia',
    'Libya',
    'Madagascar',
    'Malawi',
    'Mali',
    'Mauritania',
    'Mauritius',
    'Morocco',
    'Mozambique',
    'Namibia',
    'Niger',
    'Nigeria',
    'Rwanda',
    'Sao Tome & Principe',
    'Senegal',
    'Seychelles',
    'Sierra Leone',
    'Somalia',
    'South Africa',
    'South Sudan',
    'Sudan',
    'Tanzania',
    'Togo',
    'Tunisia',
    'Uganda',
    'Zambia',
    'Zimbabwe'
  ];
  indicatorName = [
    'drought intensity change',
    'non renewable groundwater stress',
    'water stress index',

    'agricultural water stress index',
    'crop yield change',
    'habitat degradation',

    'Consecutive dry days',
    'Heavy precipitation days (Precipitation > 10mm)',
    'Very heavy precipitation days (Precipitation > 20mm)',
    'Wet days (Annual total precipitation when PR > historical 95th percentile)',
    'Very wet days (Annual total precipitation when PR > historical 99th percentile)',
    'Precipitation intensity index (Annual total precipitation / no. of wet days)'
  ]

  ngOnInit(){
    this.loadMap();
  }
  loadMap() {
    let root = am5.Root.new("timemap");

// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);

// Create the map chart
// https://www.amcharts.com/docs/v5/charts/map-chart/
let chart = root.container.children.push(
  am5map.MapChart.new(root, {
    panX: "translateX",
    panY: "translateY",
    projection: am5map.geoMercator()
  })
);

let colorSet = am5.ColorSet.new(root, {});

// Create main polygon series for time zone areas
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
let areaSeries = chart.series.push(
  am5map.MapPolygonSeries.new(root, {
    include: [
      'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
      'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU',
      'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
      'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ'
    ],
    geoJSON: am5geodata_worldLow
  })
);

let areaPolygonTemplate = areaSeries.mapPolygons.template;
areaPolygonTemplate.setAll({ fillOpacity: 0.6 });
areaPolygonTemplate.adapters.add("fill", function (fill, target) {
  return am5.Color.saturate(
    colorSet.getIndex(areaSeries.mapPolygons.indexOf(target)),
    0.5
  );
});

areaPolygonTemplate.states.create("hover", { fillOpacity: 0.8 });

// Create main polygon series for time zones
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
let zoneSeries = chart.series.push(
  am5map.MapPolygonSeries.new(root, {
    include: [
      'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
      'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU',
      'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
      'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ'
    ],
    geoJSON:am5geodata_worldLow
  })
);

zoneSeries.mapPolygons.template.setAll({
  fill: am5.color(0x000000),
  fillOpacity: 0.08
});

let zonePolygonTemplate = zoneSeries.mapPolygons.template;
zonePolygonTemplate.setAll({ interactive: true, tooltipText: "{id}" });
zonePolygonTemplate.states.create("hover", { fillOpacity: 0.3 });

// labels
let labelSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
labelSeries.bullets.push(() => {
  return am5.Bullet.new(root, {
    sprite: am5.Label.new(root, {
      text: "{id}",
      populateText: true,
      centerX: am5.p50,
      centerY: am5.p50,
      fontSize: "0.7em"
    })
  });
});

// create labels for each zone
// zoneSeries.events.on("datavalidated", () => {
//   am5.array.each(zoneSeries.dataItems, (dataItem) => {
//     let centroid = dataItem.get("mapPolygon").visualCentroid();
//     labelSeries.pushDataItem({
//       id: dataItem.get("id"),
//       geometry: {
//         type: "Point",
//         coordinates: [centroid.longitude, centroid.latitude]
//       }
//     });
//   });
// });

// Add zoom control
// https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Zoom_control
chart.set("zoomControl", am5map.ZoomControl.new(root, {}));

// Add labels and controls
// let cont = chart.children.push(
//   am5.Container.new(root, {
//     layout: root.horizontalLayout,
//     x: 20,
//     y: 40
//   })
// );

// cont.children.push(
//   am5.Label.new(root, {
//     centerY: am5.p50,
//     text: "Map"
//   })
// );

// let switchButton = cont.children.push(
//   am5.Button.new(root, {
//     themeTags: ["switch"],
//     centerY: am5.p50,
//     icon: am5.Circle.new(root, {
//       themeTags: ["icon"]
//     })
//   })
// );

// switchButton.on("active", function () {
//   if (!switchButton.get("active")) {
//     chart.set("projection", am5map.geoMercator());
//     chart.set("panX", "translateX");
//     chart.set("panY", "translateY");
//   } else {
//     chart.set("projection", am5map.geoOrthographic());
//     chart.set("panX", "rotateX");
//     chart.set("panY", "rotateY");
//   }
// });

// cont.children.push(
//   am5.Label.new(root, {
//     centerY: am5.p50,
//     text: "Globe"
//   })
// );
// Make stuff animate on load
chart.appear(1000, 100);
  }
  selectedRcpValue: string | null = null;
  selectedIndicatorValue: string | null = null;
  selectedNameValue: string | null = null;
  selectedCountryValue: string | null = null;

  selectRcp(value: string): void {
    this.selectedRcpValue = value;
  }

  selectIndicator(value: string): void {
    this.selectedIndicatorValue = value;
  }
  selectCountry(country: string): void {
    this.selectedCountryValue = country;

  }
  selectName(value: string): void {
    this.selectedNameValue = value;
  }

}
