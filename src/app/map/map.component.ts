
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CsvService } from '../service/CsvService';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { IComponentDataItem } from '@amcharts/amcharts5/.internal/core/render/Component';
import { element } from 'angular';
import data from '../data/graph';
import { text } from 'd3';
import { DataService } from '../service/dataService';
import { Subscription } from 'rxjs';
import { YearService } from '../service/yearService';
import { PreviousEvntService } from '../service/previousEvent';


interface CsvData {
  id: string;
  Continent: string;
  Country: string;
  value: string;
  Number_of_immigrants: string;
  Proportion: string;

}
interface Entry {
  Country: string;
  [key: string]: number | string; 
}

interface Result {
  [country: string]: { count: number; sum: number; mean?: number };
}

interface CountryData {
  count: number;
  sum: number;
  mean?: number;
}

const getColorForValue = (value: number): string => {
  if (value >= 0 && value < 1) {
    return "#ff621f";
  } else if (value >= 1 && value < 2) {
    return "#d65016";
  } else {
    return "#842c06";
  }
  
};
const getColorForLand = (value: number): string => {
  if (value >= 0 && value < 1) {
    return "#f0b7a1";
  } else if (value >= 1 && value < 2) {
    return "#c7856b";
  } else {
    return "#9e5336";
  }
};
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {

  @ViewChild('dropdown')
  dropdown!: ElementRef;
  private chart: am5map.MapChart | undefined;
  private bubbleSeries: am5map.MapPointSeries | undefined;
  private jsonData: any;

  public selectedContinent: string = 'Factor 1'; // Default selection
  public continents: string[] = ['Factor 1', 'Irregular migrants', 'Economic Score'];

  clicked: boolean = false;
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
  indicators = [{ id: 'Drought intensity change (Water)', name: 'Drought intensity change (Water)' },
  { id: 'Water index stress (Water)', name: 'Water index stress (Water)' },
  { id: 'Heat Index Event exposure (Energy)', name: 'Heat Index Event exposure (Energy)' },
  { id: 'Agriculture water Stress index(Land)', name: 'Agriculture water Stress index(Land)' },
  { id: 'Crop yield change (Land)', name: 'Crop yield change (Land)' }];
  indicatorName: string[] = [];
  summaryData: any;
  rcpData: any;
  meansByCountry: Result | undefined;
  countryMeanIdPairs: { id: string; value: number; }[] = [];
  meanData: any;
  showHeatLegend: boolean = false;
  chartdiv: HTMLElement | null | undefined;
  heatLegend: any;
  polygonSeries: any;
  countryEntry: any;
  selectedRcpValues: string[] = [];
  selectedIndicators: string[] = [];
  private root: any;
  selectedYear: string = '2030';
  private selectedYearSubscription: Subscription | undefined;
  circle: any;
  previousEvent: any;
  previousData: any;
  droughtData: any;
  meansDroughtByCountry: Result | undefined;
  cropYieldData: any;
  meansCropYieldByCountry: Result | undefined;
  agricultureData: any;
  meansAgricultureByCountry: Result | undefined;
  constructor(private http: HttpClient, private dataService: CsvService, public dialog: MatDialog, public mapService: DataService,
    private yearService: YearService, private previousEvntService: PreviousEvntService) { }

  ngOnInit(): void {
    this.selectedYear = '2030';
    this.selectedYearSubscription = this.yearService.selectedYear$.subscribe(year => {
      this.selectedYear = year;
      this.loadData();

    });


  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  private updateBubbleColor(): void {
    let countryMeanPairs: [string, number][];
    // const data: { [key: string]: CountryData } | undefined = this.meansByCountry;
    //const data: { [key: string]: CountryData } | undefined = this.meansDroughtByCountry;
    const data: { [key: string]: CountryData } | undefined =this.selectedIndicatorData();
    if (data) {
      countryMeanPairs = Object.entries(data).map(
        ([country, data]) => [country, data.mean || 0]

      );
      this.countryMeanIdPairs = Object.entries(data).map(
        ([country, data]) => ({ id: country, value: data.mean || 0 })
      );
    } else {
      console.error('Means by country is undefined.');
    }
    if (this.chart && this.chart.series.length > 0) {
      this.heatLegend = this.chart?.children.push(am5.HeatLegend.new(this.chart.root, {

        orientation: "vertical",
        // endColor: am5.color(0x842c06), 
        // startColor: am5.color(0xff621f), 
        endColor: this.updateHeatLegendStartColor(this.selectedIndicators),
        startColor: this.updateHeatLegendEndColor(this.selectedIndicators),
        startText: this.updateHeatLegendStartText(this.selectedIndicators),
        endText: this.updateHeatLegendEndText(this.selectedIndicators),
        // startText: this.selectedIndicators[0] === 'Water index stress (Water)'?'Least reduction in available water':'',
        // endText: this.selectedIndicators[0] === 'Water index stress (Water)'?'Most reduction in available water':'',
        stepCount: 3,
        minHeight: 20, // Set the minimum height of the legend
        maxHeight: 500,
        startValue: 0,
        endValue: 3
      }));
      // console.log('heatLegend', this.heatLegend);

      this.heatLegend?.startLabel.setAll({
        fontSize: 12,
        fill: this.heatLegend.get("startColor")
      });

      this.heatLegend?.endLabel.setAll({
        fontSize: 12,
        fill: this.heatLegend.get("endColor")
      });
      this.polygonSeries.mapPolygons.template.set("interactive", true);
      if (this.polygonSeries) {
        this.setupHeatLegend(1);
        this.polygonSeries.mapPolygons.each((polygon:any) => {
          const dataContext = polygon.dataItem?.dataContext;
          if (dataContext && typeof dataContext === 'object' && 'name' in dataContext) {
            const countryName = dataContext.name;
            const countryEntry = countryMeanPairs?.find(([country]) => country === countryName);
            if (countryEntry?.length && this.selectedIndicators?.length == 1 && (this.selectedIndicators[0] === 'Water index stress (Water)'
              || this.selectedIndicators[0] === 'Drought intensity change (Water)')) {
              polygon.set("fill", am5.color(getColorForValue(countryEntry[1])));

            } else if (countryEntry?.length && this.selectedIndicators?.length == 1 && (this.selectedIndicators[0] === 'Crop yield change (Land)' ||
              this.selectedIndicators[0] === 'Agriculture water Stress index(Land)')) {
              polygon.set("fill", am5.color(getColorForLand(countryEntry[1])));

            }else if (this.selectedIndicators?.length == 2){
              const gradient = am5.LinearGradient?.new(this.root, {
                stops: [
                  { color: am5.color(0xFF621F) },
                  { color: am5.color(0x946B49) }
                ]
              });

              polygon['fill'] = gradient;
            }
          } else {
            console.error('Invalid or missing data structure for polygon:', polygon);
          }
        });
      }
    }
   // this.initChart1();

  }
  callGradient() {
   let gradient = am5.LinearGradient.new(this.root, {
      stops: [{
        color: am5.color(0xFF621F)
      }, {
        color: am5.color(0x946B49)
      }]
    });
    return gradient;
  }
  updateHeatLegendEndColor(selectedIndicators: string[]) {
    if (this.selectedIndicators[0] === 'Water index stress (Water)'
      || this.selectedIndicators[0] === 'Drought intensity change (Water)') {
        return am5.color(0xff621f);
    }
    else if (this.selectedIndicators[0] === 'Crop yield change (Land)' ||
      this.selectedIndicators[0] === 'Agriculture water Stress index(Land)') {
      return am5.color(0xf0b7a1);

    }
    return null;
  }
  updateHeatLegendStartColor(selectedIndicators: string[]) {
    if (this.selectedIndicators[0] === 'Water index stress (Water)'
      || this.selectedIndicators[0] === 'Drought intensity change (Water)') {
    
      return am5.color(0x842c06);

    }
    else if (this.selectedIndicators[0] === 'Crop yield change (Land)' || this.selectedIndicators[0] === 'Agriculture water Stress index(Land)') {
      return am5.color(0x752201);
    }
    return null;
  }
  private updateDefaultColor(): void {
    if (this.chart && this.chart.series.length > 0) {
      this.heatLegend?.hide();
      const polygonSeries = this.chart.series.getIndex(0) as am5map.MapPolygonSeries;
      if (polygonSeries) {
        polygonSeries.mapPolygons.each((polygon) => {
          polygon.set("fill", am5.color(0x6794dc));
        });
      }
    }

  }

  private updateGradientColor(): void {
    if (this.chart && this.chart.series.length > 0) {
      this.heatLegend?.hide();
      const polygonSeries = this.chart.series.getIndex(0) as am5map.MapPolygonSeries;
      if (polygonSeries) {
        this.polygonSeries.mapPolygons.each((polygon:any) => {
          const gradient = am5.LinearGradient.new(this.root, {
            stops: [
              { color: am5.color(0xFF621F) },
              { color: am5.color(0x946B49) }
            ]
          });
          
          polygon.color = gradient;
        });
      }
    }

  }

  private calculateMeanByCountry(data: Entry[], property: string) {
    const result: Result = {};
    data.forEach((entry: { [x: string]: any; Country: any; }) => {
      const country = entry.Country;
      const score = entry[property];
      if (!result[country]) {
        result[country] = { count: 0, sum: 0, mean: 0 };
      }
      result[country].count++;
      result[country].sum += score * 100 / 100;
      result[country].mean = result[country].sum / result[country].count;
    });
    return result;
  }

  private loadData(): void {
    if (!this.selectedYear) {
      this.dataService?.getCsvData()?.subscribe((csvData) => {
        this.jsonData = this.csvToJson<CsvData>(csvData);
        this.initChart();
        setInterval(() => this.updateData(), 2000);
      });
    } else if (this.selectedYear === '2050') {
      this.dataService?.getimmigrationData()?.subscribe((csvData) => {
        this.jsonData = this.csvToJson<CsvData>(csvData);

        this.previousData = this.jsonData.find((country: { Country: any; }) => country.Country === this.previousEvent.dataContext.name);
        this.previousEvntService.setPreviousEvent(this.previousData);
        this.setDataBubble();
        // this.openDialog(this.previousData);
      })

    } else {
      this.dataService?.getCsvData()?.subscribe((csvData) => {
        this.jsonData = this.csvToJson<CsvData>(csvData);
        this.previousData = this.jsonData.find((country: { Country: any; }) => country.Country === this.previousEvent.dataContext.name);
        this.previousEvntService.setPreviousEvent(this.previousData);
        this.setDataBubble();
      })
    }

    this.dataService.getRCPData().subscribe((rcp) => {
      this.rcpData = this.rcpToJson(rcp);
      const property = 'SSP1_1p5_Score';
      this.meansByCountry = this.calculateMeanByCountry(this.rcpData, property);
    })
    this.dataService.getDroughtData().subscribe((rcp) => {
      this.droughtData = this.rcpToJson(rcp);
      const property = 'SSP1_1p5_Score';
      this.meansDroughtByCountry = this.calculateMeanByCountry(this.droughtData, property);
    })
    this.dataService.getCropYieldData().subscribe((rcp) => {
      this.cropYieldData = this.rcpToJson(rcp);
      const property = 'SSP1_1p5_Score';
      this.meansCropYieldByCountry = this.calculateMeanByCountry(this.cropYieldData, property);
    })
    this.dataService.getAgricultureData().subscribe((rcp) => {
      this.agricultureData = this.rcpToJson(rcp);
      const property = 'SSP1_1p5_Score';
      this.meansAgricultureByCountry = this.calculateMeanByCountry(this.agricultureData, property);
    })


  }

  private initChart(): void {
    this.chartdiv = document.getElementById('chartdiv');
    if (!this.chartdiv) {
      console.error('Chart container element not found!');
      return;
    }
    if (this.chart) {
      this.chart.dispose();
    }
    const root = am5.Root.new(this.chartdiv);
    root.setThemes([am5themes_Animated.new(root)]);
    this.chart = root.container.children.push(am5map.MapChart.new(root, {}));
    this.polygonSeries = this.chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        include: [
          'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
          'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'ML', 'MW', 'MR', 'MU',
          'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
          'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ'
        ],
        geoJSON: am5geodata_worldLow,
        valueField: "value",
        calculateAggregates: true,
        interactive: true
        // fill: am5.color(0xffa500)
      })
    );
    this.chart.set("zoomLevel", 0.9);
    this.bubbleSeries = this.chart.series.push(
      am5map.MapPointSeries.new(root, {
        valueField: 'value',
        calculateAggregates: true,
        polygonIdField: 'id'
      })
    );
   // this.initChart1();

    const circleTemplate = am5.Template.new({});
    let colorset = am5.ColorSet.new(root, {});
    console.log('this.selectIndicator', this.selectedIndicators);
    if (!this.selectedIndicators.length || this.selectedIndicators.length === 1)
      this.bubbleSeries.bullets.push((root, series, dataItem) => {
        const container = am5.Container.new(root, {});
        this.circle = container.children.push(
          am5.Circle.new(root, {
            radius: 3,
            strokeOpacity: 0,
            fillOpacity: 0.7,
            fill: colorset.next(),
            cursorOverStyle: 'pointer',
            tooltipText: '{name}: [bold]{value}[/]\nNumber of Irregular migrants: [bold]{Number_of_immigrants}[/]\nProportion: [bold]{Proportion}[/]'
          }, circleTemplate as any)
        );

        const countryLabel = container.children.push(
          am5.Label.new(root, {
            text: '{name}',
            paddingLeft: 5,
            populateText: true,
            fontSize: 10,
            centerY: am5.p50
          })
        );

        const valueLabel = document.createElement('div');
        valueLabel.style.fontSize = '12px';
        valueLabel.style.position = 'absolute';
        valueLabel.style.top = '10px'; // Adjust the position as needed
        document.body.appendChild(valueLabel);
        this.circle.on('radius', (radius: any) => {
          countryLabel.set('x', radius);
          this.updateValueLabel(valueLabel, radius);

        });
        this.dataClickedEvent();
        // this.circle.events.on("click", (event:any) => {
        //   this.openDialog(event.target.dataItem);
        // });
        return am5.Bullet.new(root, {
          sprite: container,
          //  sprite:am5.Picture.new(root, {
          //   width: 32,
          //   height: 32,
          //   x: am5.percent(30),
          //   y: am5.percent(50),
          //   centerX: am5.percent(50),
          //   centerY: am5.percent(50),
          //   src: "/images/icon_btc.svg"
          // }),
          dynamic: true
        });
      });

    // this.bubbleSeries.bullets.push((root, series, dataItem) => {
    //   return am5.Bullet.new(root, {
    //     sprite: am5.Label.new(root, {
    //       // text: '{value.formatNumber(\'#\')}',
    //       fill: am5.color(0xffffff),
    //       populateText: true,
    //       centerX: am5.p50,
    //       centerY: am5.p50,
    //       textAlign: 'center',
    //       //   dx:-290,
    //       // dy:-10
    //     }),
    //     dynamic: true
    //   });
    // });
    this.bubbleSeries.set('heatRules', [
      {
        target: circleTemplate,
        dataField: 'value',
        min: 10,
        max: 30,
        minValue: 0,
        maxValue: 0,
        key: 'radius'
      }
    ]);
    this.setDataBubble()

  }


  private initChart1(): void {
    const circleTemplate = am5.Template.new({});
   let colorset = am5.ColorSet.new(this.root, {});
    if (!this.selectedIndicators.length || this.selectedIndicators.length === 1){
      this.bubbleSeries?.bullets.push((root, series, dataItem) => {
        const container = am5.Container.new(root, {});
        this.circle = container.children.push(
          am5.Circle.new(root, {
            radius: 3,
            strokeOpacity: 0,
            fillOpacity: 0.7,
           // fill:0xfff,
            fill: colorset.next(),
            cursorOverStyle: 'pointer',
            tooltipText: '{name}: [bold]{value}[/]\nNumber of Irregular migrants: [bold]{Number_of_immigrants}[/]\nProportion: [bold]{Proportion}[/]'
          }, circleTemplate as any)
        );

        const countryLabel = container.children.push(
          am5.Label.new(root, {
            text: '{name}',
            paddingLeft: 5,
            populateText: true,
            fontSize: 10,
            centerY: am5.p50
          })
        );

        const valueLabel = document.createElement('div');
        valueLabel.style.fontSize = '12px';
        valueLabel.style.position = 'absolute';
        valueLabel.style.top = '10px'; // Adjust the position as needed
        document.body.appendChild(valueLabel);
        this.circle.on('radius', (radius: any) => {
          countryLabel.set('x', radius);
          this.updateValueLabel(valueLabel, radius);

        });
        this.dataClickedEvent();
        return am5.Bullet.new(root, {
          sprite: container,
          dynamic: true
        });
      });

    this.bubbleSeries?.set('heatRules', [
      {
        target: circleTemplate,
        dataField: 'value',
        min: 10,
        max: 30,
        minValue: 0,
        maxValue: 0,
        key: 'radius'
      }
    ]);
  }else{
    if (this.bubbleSeries) {
      this.bubbleSeries.dispose();
    }  this.bubbleSeries?.bullets.push((root, series, dataItem) => {
    const container = am5.Container.new(root, {});
    this.circle = container.children.push(
      am5.Circle.new(root, {
        radius: 3,
        strokeOpacity: 0,
        fillOpacity: 0.7,
        fill:0xff621f,
        //fill: colorset.next(),
        cursorOverStyle: 'pointer',
        tooltipText: '{name}: [bold]{value}[/]\nNumber of Irregular migrants: [bold]{Number_of_immigrants}[/]\nProportion: [bold]{Proportion}[/]'
      }, circleTemplate as any)
    );

    const countryLabel = container.children.push(
      am5.Label.new(root, {
        text: '{name}',
        paddingLeft: 5,
        populateText: true,
        fontSize: 10,
        centerY: am5.p50
      })
    );

    const valueLabel = document.createElement('div');
    valueLabel.style.fontSize = '12px';
    valueLabel.style.position = 'absolute';
    valueLabel.style.top = '10px'; // Adjust the position as needed
    document.body.appendChild(valueLabel);
    this.circle.on('radius', (radius: any) => {
      countryLabel.set('x', radius);
      this.updateValueLabel(valueLabel, radius);

    });
    this.dataClickedEvent();
    return am5.Bullet.new(root, {
      sprite: container,
      dynamic: true
    });
  });

this.bubbleSeries?.set('heatRules', [
  {
    target: circleTemplate,
    dataField: 'value',
    min: 10,
    max: 30,
    minValue: 0,
    maxValue: 0,
    key: 'radius'
  }
]);
  }
    this.setDataBubble();
}
  dataClickedEvent() {
    this.circle.events.on("click", (event: any) => {
      this.previousEvent = event.target.dataItem;
      this.openDialog(event.target.dataItem);
    });

  }
  setDataBubble() {
    this.bubbleSeries?.data?.setAll(this.jsonData);
    this.setupHeatLegend(0);

  }
  public setupHeatLegend(data: any) {
    this.polygonSeries.set("heatRules", [{
      target: this.polygonSeries.mapPolygons.template,
      dataField: "value",
      min: am5.color(0xff621f),
      max: am5.color(0x661f00),
      key: "fill"
    }]);
    this.polygonSeries.mapPolygons.template.events.on("pointerover", this.onMapPolygonPointerOver.bind(this));
  }

  onMapPolygonPointerOver(ev: any) {
    let countryDetail = (ev.target.dataItem?.dataContext as { name: string }).name;
    let countryMeanPairs: any;
    let countryEntry;
    //const data: { [key: string]: CountryData } | undefined = this.meansByCountry;
    // const data: { [key: string]: CountryData } | undefined = this.meansDroughtByCountry;
    const data: { [key: string]: CountryData } | undefined = this.selectedIndicatorData();

    if (data) {
      countryMeanPairs = Object.entries(data).map(
        ([country, data]) => [country, data.mean || 0]
      );
    }
    if (countryMeanPairs?.length) {
      countryEntry = countryMeanPairs?.find(([country]: [string, number]) => country === countryDetail);
    }
    if (countryEntry !== undefined && countryEntry[1])
      this.heatLegend?.showValue(countryEntry[1]);
  }

  selectedIndicatorData(): any {
    if (this.selectedRcpValue === 'RCP 2.6(LOW)' && this.selectedIndicators?.length === 1 && this.selectedIndicators[0] === 'Water index stress (Water)') {
      return this.meansByCountry;
    } else if (this.selectedRcpValue === 'RCP 2.6(LOW)' && this.selectedIndicators?.length === 1 && this.selectedIndicators[0] === 'Drought intensity change (Water)') {
      return this.meansDroughtByCountry;
    } else if (this.selectedRcpValue === 'RCP 2.6(LOW)' && this.selectedIndicators?.length === 1 && this.selectedIndicators[0] === 'Crop yield change (Land)') {
      return this.meansCropYieldByCountry;
    } else if (this.selectedRcpValue === 'RCP 2.6(LOW)' && this.selectedIndicators?.length === 1 && this.selectedIndicators[0] === 'Agriculture water Stress index(Land)') {
      return this.meansAgricultureByCountry;
    }

    // Add a default return statement (could be null, an empty object, or another appropriate value)
    return null;
  }
  private updateValueLabel(valueLabel: any, radius: number) {
    valueLabel.textContent = `Radius: ${radius.toFixed(2)}`; // Adjust formatting as needed
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
  private csvToJson<T>(csvData: string): T[] {
    const lines = csvData.split('\n');
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

  private updateData(): void {
    if (this.bubbleSeries && this.jsonData) {
      const data = this.jsonData;
      for (let i = 0; i < this.bubbleSeries.dataItems.length; i++) {
        const newDataItem = {
          value: data[i].value,
          id: data[i].id,
          name: data[i].Country,
          Number_of_immigrants: data[i].Number_of_immigrants,
          Proportion: data[i].Proportion
        };
        this.bubbleSeries.data.setIndex(i, newDataItem);
      }
    }
  }
  selectedRcpValue: string | null = null;
  selectedIndicatorValue: string | null = null;
  selectedNameValue: string = '';
  selectedCountryValue: string | null = null;

  selectRcp(value: string): void {
    this.selectedRcpValue = value;
  }

  selectIndicator(value: string): void {
    const index = this.selectedIndicators.indexOf(value);
    if (index === -1) {
      this.selectedIndicators.push(value);
    } else {
      this.selectedIndicators.splice(index, 1);
    } this.updateIndicatorName();
  }

  updateIndicatorName(): void {
    if (this.selectedRcpValue === 'RCP 2.6(LOW)' && this.selectedIndicators?.length == 1 && (this.selectedIndicators[0] === 'Water index stress (Water)'
      || this.selectedIndicators[0] === 'Drought intensity change (Water)' || this.selectedIndicators[0] === 'Crop yield change (Land)')
      || this.selectedIndicators[0] === 'Agriculture water Stress index(Land)') {
      this.showHeatLegend = true;
      this.updateBubbleColor();
    }
    else if(this.selectedRcpValue === 'RCP 2.6(LOW)' && this.selectedIndicators?.length == 2){
      this.updateGradientColor();
    }
    else {
      this.showHeatLegend = false;
      this.updateDefaultColor();
    }
  }

  selectCountry(country: string): void {
    this.selectedCountryValue = country;
  }

  openDialog(_dataItem: any): void {
    this.summaryData = _dataItem;
    this.clicked = true;
    this.sendDataToMigrateComponent(this.summaryData)
  }

  sendDataToMigrateComponent(_dataVal: any) {
    this.mapService.setMapData(_dataVal);
  }

  updateHeatLegendStartText(selectedCategory: string[]): string {
    if (selectedCategory.length > 0) {
      if (selectedCategory[0] === 'Water index stress (Water)' || selectedCategory[0] === 'Agriculture water Stress index(Land)') {

        return 'Least reduction in \n available water';
      } else if (selectedCategory[0] === 'Crop yield change (Land)') {
        return 'Least reduction in \n crops';
      } else if (selectedCategory[0] === 'Heat Index Event exposure (Energy)') {
        return 'Least increase in heat stress';
      } else {
        return 'Default start text';
      }
    }
    return '';
  }

  updateHeatLegendEndText(selectedCategory: string[]): string {
    if (selectedCategory.length > 0) {
      if (selectedCategory[0] === 'Water index stress (Water)' || selectedCategory[0] === 'Agriculture water Stress index(Land)') {
        return 'Most reduction in \n available water';
      } else if (selectedCategory[0] === 'Crop yield change (Land)') {
        return 'Most reduction in \n crops';
      } else if (selectedCategory[0] === 'Heat Index Event exposure (Energy)') {
        return 'Most increase in heat stress';
      } else {
        return 'Default end text';
      }
    }
    return '';
  }
  showBullets(){
    
  }
}
