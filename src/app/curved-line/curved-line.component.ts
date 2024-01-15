import { Component } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';
import * as am5percent from "@amcharts/amcharts5/percent";
import { CsvService } from '../service/CsvService';
interface CsvData {
  id?: string;
  Continent?: string;
  Country: string;
  value: string;
  Number_of_immigrants: string;
  Proportion: string;
}
@Component({
  selector: 'app-curved-line',
  templateUrl: './curved-line.component.html',
  styleUrls: ['./curved-line.component.css']
})
export class CurvedLineComponent {
  fetchData =[];
  data: any=[];
  constructor( private dataService: CsvService){
    this.dataService.getCoordinate().subscribe((rcp: any) => {

      this.fetchData = this.rcpToJson(rcp);
      this.loadData();
    
      
    }
    )
  
   
    
  }
  loadData() {
    if (this.fetchData) {
      this.data = this.fetchData.map((coord: any) => ({
        id: coord.Country,
        title: coord.Country,
        name: coord.Country,
        Country: coord.Country,
        Destination1 :coord.Destination1,
        Destination2 :coord.Destination2,
        Destination3 :coord.Destination3,
        Central: coord.Central,
        Western: coord.WesternMedi1,
        WesternMedi: coord.WesternMedi2,
        WesternAfrica:coord.WesternAfrica,
        Final:coord.Final,
       geometry: {
          type: "Point",
          coordinates: [parseFloat(coord.longitude),parseFloat(coord.latitude)]
        }
      }));
      this.data.push({
        Country:"United Kingdom",
        id: "United Kingdom",
        title: "United Kingdom",
        geometry: { type: "Point", coordinates: [-0.1262, 51.5002] }
        
      });
      console.log('this.data', this.data); // Check if data is correct here

      this.initializeChart();
    }
  }
  private rcpToJson<T>(data: string): T[] {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const result: T[] = [];
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');
      const obj: any = {};
      for (let j = 0; j < headers.length; j++) {
                const key = headers[j].trim() as keyof CsvData;
        const value = currentLine[j] ? currentLine[j].trim() : '';
        obj[key] = value;
      }
      result.push(obj as T);
    }
    return result;

  }
  initializeChart(){
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
  'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ','UK'],
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

// destinations series
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

 
const visibleCountries = ["Nigeria", "Niger", "Algeria", "Libya", "Morocco", "West Sharan", "United Kingdom"];

// Create point series for visible countries
let visibleCitySeries = chart.series.push(
  am5map.MapPointSeries.new(root, {
   
  })
  
);
visibleCitySeries.data.setAll(["Nigeria", "Niger", "Algeria", "Libya", "Morocco", "West Sharan", "United Kingdom"]);

visibleCitySeries.bullets.push(function() {
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
    id: "United Kingdom",
    title: "United Kingdom",
    geometry: { type: "Point", coordinates: [-0.1262, 51.5002] }
    
  }];
  console.log('this.data',cities);
  if(this.data)
citySeries.data.setAll(this.data);

// prepare line series data
let destinations = ["reykjavik", "lisbon", "moscow", "belgrade", "ljublana", "madrid", "stockholm", "bern", "kiev", "new york"];
// London coordinates
let originLongitude = 26.820553;
let originLatitude = 30.802498;

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
 var originsVal = this.getOrigin();
var origins = [
  {
    id: "Algeria",
    destinations: ["Congo", "Libya"]
  },
  
    {    id: "Congo",
    destinations: ["Zimbabwe"]
  },
  {
    id: "Libya",
    destinations: ["Zimbabwe"]
  }];
  let lineSeriesData: unknown[] =[];
am5.array.each(originsVal, function (originData) {
  var originDataItem = citySeries.getDataItemById(originData.id);

  am5.array.each(originData.destinations, function (destId) {
    // console.log('destId',destId);
    var destinationDataItem = citySeries.getDataItemById(String(destId));
    var originLongitude = originDataItem?.get("longitude");
    var originLatitude = originDataItem?.get("latitude");
    var destLongitude = destinationDataItem?.get("longitude");
    var destLatitude = destinationDataItem?.get("latitude");

  
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
    
     
  //   if (originLongitude !== undefined && originLatitude !== undefined &&
  //     destLongitude !== undefined && destLatitude !== undefined) {
  //   let arrowLineDataItem = lineSeries.pushDataItem({
  //     geometry: {
  //       type: "LineString",
  //       coordinates: [
  //         [originLongitude,originLatitude],
  //         [destLongitude, destLatitude]
  //       ]
  //     }
  //   });
  
  //   arrowSeries.pushDataItem({
  //     lineDataItem: arrowLineDataItem,
  //     positionOnLine: 0.5,
  //     autoRotate: true
  //   });
  
  // }
  });

});
// Set the line series data
lineSeries.data.setAll(lineSeriesData);
  
// polygonSeries.events.on("datavalidated", function () {
//   chart.zoomToGeoPoint({ longitude: -0.1262, latitude: 51.5002 }, 3);
// })


// Make stuff animate on load
chart.appear(1000, 100);

  }
  getOrigin() {
    const transitions: { id: any; destinations: any; }[] = [];
    const location :any= {
      Central: "Libya",
      Country: "Nigeria",
      Destination1: "Niger",
      Destination2: undefined,
      Destination3: undefined,
      Final: "United Kingdom",
      Western: "Algeria",
      WesternAfrica: "",
      WesternMedi: "Morocco",
      geometry: { type: 'Point', coordinates: [] },
      id: "Nigeria",
      name: "Nigeria",
      title: "Nigeria"
    };
    let lastDestination = location.Country;
    
    const order = ["Destination1", "Destination2", "Destination3", "Central", "Western", "WesternMedi", "WesternAfrica", "Final"];
    
    for (let i = 0; i < order.length; i++) {
      const currentKey = order[i];
    
      if (location && location[currentKey]) {
        transitions.push({ id: lastDestination, destinations: [location[currentKey]] });
        lastDestination = location[currentKey];
      } else {
        break; // Break if the current destinations is not available
      }
    }
    if ( location.Destination3) {
      transitions.push({ id: location.Destination3, destinations:[ location.Central ]});
      transitions.push({ id: location.Destination3, destinations: [location.Western] });
      transitions.push({ id: location.Destination3, destinations: [location.WesternMedi] });
      transitions.push({ id: location.Destination3, destinations: [location.WesternAfrica] });
    }
    if ( location.Destination2) {
      transitions.push({ id: location.Destination2, destinations: [location.Central ]});
      transitions.push({ id: location.Destination2, destinations: [location.Western] });
      transitions.push({ id: location.Destination2, destinations: [location.WesternMedi] });
      transitions.push({ id: location.Destination2, destinations: [location.WesternAfrica] });
    }
    if ( location.Destination1) {
      transitions.push({ id: location.Destination1, destinations: [location.Central] });
      transitions.push({ id: location.Destination1, destinations: [location.Western ]});
      transitions.push({ id: location.Destination1, destinations: [location.WesternMedi] });
      transitions.push({ id: location.Destination1, destinations: [location.WesternAfrica] });
    }
    // Add the final destinations (if available)
    if (location.Central  ) {
      transitions.push({ id: location.Central, destinations: [location.Final] });
    }
    if (location.Western  ) {
      transitions.push({ id: location.Western, destinations: [location.Final] });
    }
    if (location.WesternMedi  ) {
      transitions.push({ id: location.WesternMedi, destinations:[ location.Final] });
    }
    if (location.WesternAfrica  ) {
      transitions.push({ id: location.WesternAfrica, destinations: [location.Final] });
    }
    // If Destination3 is present, connect it to Central, Western, WesternMedi, and WesternAfrica
    

// Add the final destinations (if available)
if (location.Final) {
 // transitions.push({ id: lastDestination, destinations: location.Final });
}
return transitions;
console.log(transitions)
  }

}
