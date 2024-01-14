import { Component } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';
import * as am5percent from "@amcharts/amcharts5/percent";

@Component({
  selector: 'app-curved-line',
  templateUrl: './curved-line.component.html',
  styleUrls: ['./curved-line.component.css']
})
export class CurvedLineComponent {
  ngOnInit(){
    let root = am5.Root.new("chartcurveddiv");


// Set themes
// https://www.amcharts.com/docs/v5/concepts/themes/
root.setThemes([
  am5themes_Animated.new(root)
]);


// Create the map chart
// https://www.amcharts.com/docs/v5/charts/map-chart/
let chart = root.container.children.push(am5map.MapChart.new(root, {
  panX: "translateX",
  panY: "translateY",
  projection: am5map.geoMercator()
}));

let cont = chart.children.push(am5.Container.new(root, {
  layout: root.horizontalLayout,
  x: 20,
  y: 40
}));


// Add labels and controls
cont.children.push(am5.Label.new(root, {
  centerY: am5.p50,
  text: "Map"
}));

let switchButton = cont.children.push(am5.Button.new(root, {
  themeTags: ["switch"],
  centerY: am5.p50,
  icon: am5.Circle.new(root, {
    themeTags: ["icon"]
  })
}));

switchButton.on("active", function() {
  if (!switchButton.get("active")) {
    chart.set("projection", am5map.geoMercator());
    chart.set("panX", "translateX");
    chart.set("panY", "translateY");
  }
  else {
    chart.set("projection", am5map.geoOrthographic());
    chart.set("panX", "rotateX");
    chart.set("panY", "rotateY");
  }
});

cont.children.push(am5.Label.new(root, {
  centerY: am5.p50,
  text: "Globe"
}));

// Create main polygon series for countries
// https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/
let polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
  geoJSON: am5geodata_worldLow,
  include: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU',
  "MT", 'NL', "PL", "PT", "RO", "SK", "SI", "ES", "SE", "GB", 'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
  'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU',
  'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
  'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ'],
}));

let graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
graticuleSeries.mapLines.template.setAll({
  stroke: root.interfaceColors.get("alternativeBackground"),
  strokeOpacity: 0.08
});
chart?.set("zoomLevel", 1);

// Create line series for trajectory lines
// https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/
let lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
lineSeries.mapLines.template.setAll({
  stroke: root.interfaceColors.get("alternativeBackground"),
  strokeOpacity: 0.6
});

// destination series
let citySeries = chart.series.push(
  am5map.MapPointSeries.new(root, {})
);

citySeries.bullets.push(function() {
  let circle = am5.Circle.new(root, {
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

// arrow series
let arrowSeries = chart.series.push(
  am5map.MapPointSeries.new(root, {})
);

arrowSeries.bullets.push(function() {
  let arrow = am5.Graphics.new(root, {
    fill: am5.color(0x000000),
    stroke: am5.color(0x000000),
    draw: function (display) {
      display.moveTo(0, -3);
      display.lineTo(8, 0);
      display.lineTo(0, 3);
      display.lineTo(0, -3);
    }
  });

  return am5.Bullet.new(root, {
    sprite: arrow
  });
});

var cities = [
  {
    id: "nigeria",
    title: "Nigeria",
    geometry: { type: "Point", coordinates: [8.675277, 9.081999] },
  },
  {
    id: "niger",
    title: "Niger",
    geometry: { type: "Point", coordinates: [8.081666, 17.607789] }
  }, 
  {
    id: "algeria",
    title: "Algeria",
    geometry: { type: "Point", coordinates: [1.659626, 28.033886] }
  }, 
  {
    id: "libya",
    title: "Libya(central Med. Route)",
    geometry: { type: "Point", coordinates: [17.228331, 26.3351] }
  }, 
  {
    id: "morocco",
    title: "Morocco(Western Med. Route)",
    geometry: { type: "Point", coordinates: [-7.09262, 31.791702] }
  }, 
    {
    id: "westsharan",
    title: "West Sharan(Western Africa Route)",
    geometry: { type: "Point", coordinates: [ -12.8858, 24.2155] }
  }, 
   
  {
    id: "unitedKingdom",
    title: "United Kingdom",
    geometry: { type: "Point", coordinates: [-0.1262, 51.5002] }
    
  }];
citySeries.data.setAll(cities);

// prepare line series data
let destinations = ["reykjavik", "lisbon", "moscow", "belgrade", "ljublana", "madrid", "stockholm", "bern", "kiev", "new york"];
// London coordinates
let originLongitude = -0.1262;
let originLatitude = 51.5002;

// am5.array.each(destinations, function (did) {
  
//   let destinationDataItem = citySeries.getDataItemById(did);
//   if (destinationDataItem) {
//   let lineDataItem = lineSeries.pushDataItem({ geometry: { type: "LineString", coordinates: [[originLongitude, originLatitude], 
//   [destinationDataItem.get("longitude")?? 0, destinationDataItem.get("latitude")?? 0]] } });

//   arrowSeries.pushDataItem({
//     lineDataItem: lineDataItem,
//     positionOnLine: 0.5,
//     autoRotate: true
//   });
// }
// })

var origins = [
  {
    id: "nigeria",
    destinations: ["niger", "westsharan"]
  },
  {
    id: "niger",
    destinations: ["algeria", "libya", "morocco"]
  },
  {
    id: "libya",
    destinations: ["unitedKingdom"]
  },
  {
    id: "algeria",
    destinations: ["unitedKingdom"]
  },
  {
    id: "westsharan",
    destinations: ["unitedKingdom"]
  },
  {
    id: "morocco",
    destinations: ["unitedKingdom"]
  }];
  let lineSeriesData: unknown[] =[];
am5.array.each(origins, function (originData) {
  var originDataItem = citySeries.getDataItemById(originData.id);

  am5.array.each(originData.destinations, function (destId) {
    var destinationDataItem = citySeries.getDataItemById(destId);

    // Create line series data
    var lineData = {
      geometry: {
        type: "LineString",
        coordinates: [
          [originDataItem?.get("longitude"), originDataItem?.get("latitude")],
          [destinationDataItem?.get("longitude"), destinationDataItem?.get("latitude")]
        ]
      },
      animationPosition: 0
    };

    // Add the line data to the line series
    lineSeriesData.push(lineData);
  });
});

// Set the line series data
lineSeries.data.setAll(lineSeriesData);

// polygonSeries.events.on("datavalidated", function () {
//   chart.zoomToGeoPoint({ longitude: -0.1262, latitude: 51.5002 }, 3);
// })
am5.array.each(lineSeries.dataItems, function (lineDataItem) {
  lineDataItem.animate({
    key: "line",
    from: 0,
    to: 1,
    duration: 1000
  }as any);
});

// Make stuff animate on load
chart.appear(1000, 100);

  }

}
