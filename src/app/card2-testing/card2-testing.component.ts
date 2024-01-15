import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import { Component } from "@angular/core";
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
interface ChartData {
  title: string;
  latitude: number;
  longitude: number;
  width: number;
  height: number;
  pieData: { category: string; value: number }[];
}
interface RegionData {
  x: number;
  y: string;
  Country: string;
  region_name: string;
  SSP1_1p5_Score: number;
  SSP1_2p0_Score: number;
  SSP1_3p0_Score: number
}
@Component({
  selector: 'app-card2-testing',
  templateUrl: './card2-testing.component.html',
  styleUrls: ['./card2-testing.component.css']
})

export class Card2TestingComponent {
 ngOnInit(){
  var root = am5.Root.new("chartdivtesting");
var chart = root.container.children.push(
  am5map.MapChart.new(root, {})
);
let polygonSeries = chart.series.push(
  am5map.MapPolygonSeries.new(root, {
    geoJSON: am5geodata_worldLow
  })
);
polygonSeries.mapPolygons.template.setAll({
  tooltipText: "{name}",
  interactive: true
});
polygonSeries.mapPolygons.template.states.create("hover", {
  fill: am5.color(0x677935)
});
// Create point series
// Create line series for trajectory lines
// https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/
// this will be invisible line (note strokeOpacity = 0) along which invisible points will animate
var lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
lineSeries.mapLines.template.setAll({
  stroke: root.interfaceColors.get("alternativeBackground"),
  strokeOpacity:1.0
});
// this will be visible line. Lines will connectg animating points so they will look like animated
var animatedLineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
animatedLineSeries.mapLines.template.setAll({
  stroke: root.interfaceColors.get("alternativeBackground"),
  strokeOpacity: 1.0});


  let originSeries = chart.series.push(
    am5map.MapPointSeries.new(root, { idField: "id" })
  );
  
  originSeries.bullets.push(function () {
    let circle = am5.Circle.new(root, {
      radius: 7,
      tooltipText: "{title} (Click me!)",
      cursorOverStyle: "pointer",
      tooltipY: 0,
      fill: am5.color(0xffba00),
      stroke: root.interfaceColors.get("background"),
      strokeWidth: 2
    });
  
   
    return am5.Bullet.new(root, {
      sprite: circle
    });
  });

  let destinationSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
destinationSeries.bullets.push(function () {
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
// destination series
let  citySeries = chart.series.push(
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
let originCities = [
  {
    id: "london",
    title: "London",
    destinations: [
      "vilnius",
      "reykjavik",
      "lisbon",
      "moscow",
      "belgrade",
      "ljublana",
      "madrid",
      "stockholm",
      "bern",
      "kiev",
      "new york"
    ],
    geometry: { type: "Point", coordinates: [-0.1262, 51.5002] },
    zoomLevel: 2.74,
    zoomPoint: { longitude: -20.1341, latitude: 49.1712 }
  },
  {
    id: "vilnius",
    title: "Vilnius",
    destinations: [
      "london",
      "brussels",
      "prague",
      "athens",
      "dublin",
      "oslo",
      "moscow",
      "bratislava",
      "belgrade",
      "madrid"
    ],
    geometry: { type: "Point", coordinates: [25.2799, 54.6896] },
    zoomLevel: 4.92,
    zoomPoint: { longitude: 15.4492, latitude: 50.2631 }
  }
];
let destinationCities = [
  {
    id: "brussels",
    title: "Brussels",
    geometry: { type: "Point", coordinates: [4.3676, 50.8371] }
  },
  {
    id: "prague",
    title: "Prague",
    geometry: { type: "Point", coordinates: [14.4205, 50.0878] }
  },
  {
    id: "athens",
    title: "Athens",
    geometry: { type: "Point", coordinates: [23.7166, 37.9792] }
  },
  {
    id: "reykjavik",
    title: "Reykjavik",
    geometry: { type: "Point", coordinates: [-21.8952, 64.1353] }
  },
  {
    id: "dublin",
    title: "Dublin",
    geometry: { type: "Point", coordinates: [-6.2675, 53.3441] }
  },
  {
    id: "oslo",
    title: "Oslo",
    geometry: { type: "Point", coordinates: [10.7387, 59.9138] }
  },
  {
    id: "lisbon",
    title: "Lisbon",
    geometry: { type: "Point", coordinates: [-9.1355, 38.7072] }
  },
  {
    id: "moscow",
    title: "Moscow",
    geometry: { type: "Point", coordinates: [37.6176, 55.7558] }
  },
  {
    id: "belgrade",
    title: "Belgrade",
    geometry: { type: "Point", coordinates: [20.4781, 44.8048] }
  },
  {
    id: "bratislava",
    title: "Bratislava",
    geometry: { type: "Point", coordinates: [17.1547, 48.2116] }
  },
  {
    id: "ljublana",
    title: "Ljubljana",
    geometry: { type: "Point", coordinates: [14.506, 46.0514] }
  },
  {
    id: "madrid",
    title: "Madrid",
    geometry: { type: "Point", coordinates: [-3.7033, 40.4167] }
  },
  {
    id: "stockholm",
    title: "Stockholm",
    geometry: { type: "Point", coordinates: [18.0645, 59.3328] }
  },
  {
    id: "bern",
    title: "Bern",
    geometry: { type: "Point", coordinates: [7.4481, 46.948] }
  },
  {
    id: "kiev",
    title: "Kiev",
    geometry: { type: "Point", coordinates: [30.5367, 50.4422] }
  },
  {
    id: "paris",
    title: "Paris",
    geometry: { type: "Point", coordinates: [2.351, 48.8567] }
  },
  {
    id: "new york",
    title: "New York",
    geometry: { type: "Point", coordinates: [-74, 40.43] }
  }
];
originSeries.data.setAll(originCities);
destinationSeries.data.setAll(destinationCities);
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
// Prepare line series data
var origins = [
  {
    id: "nigeria",
    destinations: ["niger"]
  },
  {
    id: "nigeria",
    destinations: ["westsharan"]
  },
  {
    id: "niger",
    destinations: ["algeria"]
  },
  {
    id: "niger",
    destinations: ["libya"]
  },
  {
    id: "niger",
    destinations: ["morocco"]
  },
  {
    id: "libya",
    destinations: ["unitedKingdom"]
  },{
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
am5.array.each(origins, function(originData) {
  var originDataItem = citySeries.getDataItemById(originData.id);
  am5.array.each(originData.destinations, function(destId) {
    var destinationDataItem;
    if (destId === "unitedKingdom") {
      destinationDataItem = citySeries.getDataItemById(destId);
    } else {
      destinationDataItem = citySeries.getDataItemById(destId);
    }
    var lineDataItem = lineSeries.pushDataItem({});
    if(originDataItem && destinationDataItem)
    lineDataItem.set("pointsToConnect", [originDataItem, destinationDataItem])
    var startDataItem = animatedBulletSeries.pushDataItem({});
    startDataItem.setAll({
      lineDataItem: lineDataItem,
      positionOnLine: 0
    });
    var endDataItem = animatedBulletSeries.pushDataItem({});
    endDataItem.setAll({
      lineDataItem: lineDataItem,
      positionOnLine: 1
    });
    var animatedLineDataItem = animatedLineSeries.pushDataItem({});
    animatedLineDataItem.set("pointsToConnect", [startDataItem, endDataItem])
    var lon0 = originDataItem?.get("longitude");
    var lat0 = originDataItem?.get("latitude");
    var lon1 = destinationDataItem?.get("longitude");
    var lat1 = destinationDataItem?.get("latitude");
    if(lon0 && lon1 && lat0 && lat1){
    var distance = Math.hypot(lon1 - lon0, lat1 - lat0);
    var duration = distance * 100;
  
    animateStart(startDataItem, endDataItem, duration);
  }
  });
});
function animateStart(startDataItem: am5.DataItem<am5map.IMapPointSeriesDataItem>, endDataItem: am5.DataItem<am5map.IMapPointSeriesDataItem>, duration: number) {
  var startAnimation = startDataItem.animate({
    key: "positionOnLine",
    from: 0,
    to: 1,
    duration: duration
  });
  startAnimation.events.on("stopped", function() {
    //animateEnd(startDataItem, endDataItem, duration);
  });
}
function animateEnd(startDataItem: { set: (arg0: string, arg1: number) => void; }, endDataItem: { animate: (arg0: { key: string; from: number; to: number; duration: any; }) => any; }, duration: any) {
  startDataItem.set("positionOnLine", 0)
  var endAnimation = endDataItem.animate({
    key: "positionOnLine",
    from: 0,
    to: 1,
    duration: duration
  })
  endAnimation.events.on("stopped", function() {
    //return animateStart(startDataItem, endDataItem, duration);
  });
 }
 polygonSeries.events.on("datavalidated", function() {
  chart.zoomToGeoPoint({
    longitude: -0.1262,
    latitude: 51.5002
  }, 3);
});
function selectOrigin(id:any) {
//   currentId = id;
//   let dataItem = originSeries.getDataItemById(id);
//   let dataContext = dataItem?.dataContext!;
//    let destinations = dataContext.destinations;
//   let lineSeriesData: unknown[] = [];
//   let originLongitude = dataItem?.get("longitude");
//   let originLatitude = dataItem?.get("latitude");
//   am5.array.each(destinations, function (did) {
//     let destinationDataItem = destinationSeries.getDataItemById(did);
//     if (!destinationDataItem) {
//       destinationDataItem = originSeries.getDataItemById(did);
//     }
//     lineSeriesData.push({
//       geometry: {
//         type: "LineString",
//         coordinates: [
//           [originLongitude, originLatitude],
//           [
//             destinationDataItem?.get("longitude"),
//             destinationDataItem?.get("latitude")
//           ]
//         ]
//       }
//     });
//   });
//   lineSeries.data.setAll(lineSeriesData);
// }
// let currentId = "london";
// destinationSeries.events.on("datavalidated", function () {
//   selectOrigin(currentId);
 }
// Make stuff animate on load
chart.appear(1000, 100);
}
}
