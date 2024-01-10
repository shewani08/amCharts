
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
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
import { Subscription, forkJoin } from 'rxjs';
import { YearService } from '../service/yearService';
import { PreviousEvntService } from '../service/previousEvent';

interface CsvData {
  id?: string;
  Continent?: string;
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
    return "#CFCD9D";
  } else if (value >= 1 && value < 2) {
    return "#CA9485";
  } else {
    return "#B41404";
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
  private mapchart: am5map.MapChart | undefined;
  private bubbleSeries: am5map.MapPointSeries | undefined;
  private jsonData: any;
  public selectedContinent: string = 'Factor 1'; // Default selection
  public continents: string[] = ['Factor 1', 'Irregular migrants', 'Economic Score'];
  clicked: boolean = false;
  countryNames = [
    'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon', 'Central African Republic',
    'Chad', 'Comoros', 'Congo', 'Côte d\'Ivoire', 'Djibouti', 'DR Congo', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini',
    'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar',
    'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome & Principe',
    'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda',
    'Zambia', 'Zimbabwe'
  ];
  indicators = [{ id: 'Drought intensity change (Water)', name: 'Drought intensity change (Water)' },
  { id: 'Water index stress (Water)', name: 'Water index stress (Water)' },
  { id: 'Heat Index Event exposure (Energy)', name: 'Heat Index Event exposure (Energy)' },
  { id: 'Agriculture water Stress index (Land)', name: 'Agriculture water Stress index (Land)' },
  { id: 'Crop yield change (Land)', name: 'Crop yield change (Land)' }];
  mergedJSON: any;
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
  selectedYear: string = '';
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
  tempjsonData: any;
  fetchData: any;
  droughtData1: any;
  meansDroughtByCountry1: any;
  agricultureData1: any;
  meansAgricultureByCountry1: any;
  mergedDroughtJSON: any;
  mpdiv: HTMLElement | null | undefined;
  showMap: boolean = true;
  root1: any;
  constructor(private http: HttpClient, private dataService: CsvService, public dialog: MatDialog, public mapService: DataService,
    private yearService: YearService, private previousEvntService: PreviousEvntService,
    private cdr: ChangeDetectorRef) {
      this.dataService.getCoordinate().subscribe((rcp) => {
        this.fetchData = this.rcpToJson(rcp);
       
      })
    this.dataService.getDroughtData().subscribe((rcp) => {
      this.droughtData1 = this.rcpToJson(rcp);
      const property = 'SSP1_1p5_Score';
      this.meansDroughtByCountry1 = this.calculateMeanByCountry(this.droughtData1, property);
     // this.mergedDroughtJSON = this.mergeTwoJson(this.fetchData, this.meansDroughtByCountry1, 'mean1');
    })
    this.dataService.getAgricultureData().subscribe((rcp) => {
      this.agricultureData1 = this.rcpToJson(rcp);
      const property = 'SSP1_1p5_Score';
      this.meansAgricultureByCountry1 = this.calculateMeanByCountry(this.agricultureData1, property);
      if (this.mergedDroughtJSON && this.meansAgricultureByCountry1){}
      //  this.mergedJSON = this.mergeTwoJson(this.mergedDroughtJSON, this.meansAgricultureByCountry1, 'mean2');
      // setTimeout(()=>this.initializeMap(),2000);
    })
  }

  ngOnInit(): void {
    this.selectedYearSubscription = this.yearService.selectedYear$.subscribe(year => {
      this.selectedYear = year;
      this.loadData();
    });
   
  }
  mergeTwoJson(src1: any, src2: { [x: string]: any; }, meanType: string) {
    const mergedData = [];
    if (src1 && src2)
      for (const entry of src1) {
        const countryName = entry.Country;
        if (src2[countryName]) {
          const mergedEntry = { ...src2[countryName], ...entry };
          for (const prop in src2[countryName]) {
            if (mergedEntry.hasOwnProperty(prop) && prop !== "Country") {
              const renamedProp = meanType;
              mergedEntry[renamedProp] = src2[countryName][prop];
              delete mergedEntry[prop];
            }
          }
          mergedData.push(mergedEntry);
        }
      }
    return mergedData;
  }

  mergeJsonSources(sources: any[]) {
    const mergedData = [];
    if (sources.every(src => src)) {
      for (const entry of sources[0]) {
        const countryName = entry.Country;
        const mergedEntry: any = { ...entry };
        for (let i = 1; i < sources.length; i++) {
          const source = sources[i];
          if (source[countryName]) {
            for (const prop in source[countryName]) {
              if (prop !== "Country") {
                const renamedProp = `mean${i}`;
                mergedEntry[renamedProp] = source[countryName][prop];
              }
            }
            Object.assign(mergedEntry, source[countryName]);
          }
        }
        mergedData.push(mergedEntry);
      }
    }
    return mergedData;
  }
  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  private updateBubbleColor(): void {
    let countryMeanPairs: [string, number][];
    const data: { [key: string]: CountryData } | undefined = this.selectedIndicatorData();
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
        endValue: 3,
        pixelHeight: 30,
        // x:-10,
        y: 60
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
     // console.log('this.polygonSeries', this.polygonSeries);
      if (this.polygonSeries) {
        this.setupHeatLegend(1);
        this.polygonSeries?.mapPolygons?.each((polygon: any) => {
         // console.log('polygon is', polygon);
          const dataContext = polygon.dataItem?.dataContext;
         // console.log('dataContext', dataContext);
          if (dataContext && typeof dataContext === 'object' && 'name' in dataContext) {
            const countryName = dataContext.name;
            const countryEntry = countryMeanPairs?.find(([country]) => country === countryName);
           // console.log('countryEntry', countryEntry);
           // console.log('selectedIndicators', this.selectedIndicators);
            if (countryEntry?.length && this.selectedIndicators?.length == 1 && (this.selectedIndicators[0] === 'Water index stress (Water)'
              || this.selectedIndicators[0] === 'Drought intensity change (Water)')) {
              polygon.set("fill", am5.color(getColorForValue(countryEntry[1])));

            } else if (countryEntry?.length && this.selectedIndicators?.length == 1 && (this.selectedIndicators[0] === 'Crop yield change (Land)' ||
              this.selectedIndicators[0] === 'Agriculture water Stress index(Land)')) {
              polygon.set("fill", am5.color(getColorForLand(countryEntry[1])));

            } else if (this.selectedIndicators?.length == 2) {
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
      return am5.color(0xCFCD9D);
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

      return am5.color(0xB41404);

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
        this.polygonSeries.mapPolygons.each((polygon: any) => {
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
    data?.forEach((entry: { [x: string]: any; Country: any; }) => {
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
      // this.dataService?.getCsvData()?.subscribe((csvData) => {
      //   this.jsonData = this.csvToJson<CsvData>(csvData);
      //   this.initChart();
      //   setInterval(() => this.updateData(), 2000);
      // });
      this.dataService?.getMigrantData()?.subscribe((csvData) => {
        this.jsonData = this.csvToJson<CsvData>(csvData);
        // console.log('default',this.jsonData);
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
      this.dataService?.getAfricaimmigrationData()?.subscribe((csvData) => {
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
    if (this.fetchData && this.meansDroughtByCountry1 && this.meansAgricultureByCountry1 && this.meansCropYieldByCountry) {
      this.mergedJSON = this.mergeJsonSources([this.fetchData, this.meansDroughtByCountry1, this.meansAgricultureByCountry1]);
      setTimeout(() => {
        console.log('Merged Data:', this.mergedJSON);
      }, 200);
    }
    forkJoin([
      this.dataService.getRCPData(),
      this.dataService.getDroughtData(),
      this.dataService.getCropYieldData(),
      this.dataService.getAgricultureData()
    ]).subscribe(([rcpData, droughtData, cropYieldData, agricultureData]) => {
      const property = 'SSP1_1p5_Score';
      this.rcpData = this.rcpToJson(rcpData);
      this.droughtData = this.rcpToJson(droughtData);
      this.cropYieldData = this.rcpToJson(cropYieldData);
      this.agricultureData = this.rcpToJson(agricultureData);
    
      // Now, you can merge the data
      this.mergedJSON = this.mergeJsonSources([this.fetchData, this.calculateMeanByCountry(this.droughtData,property), this.calculateMeanByCountry(this.cropYieldData,property) ]);
    
      setTimeout(() => {
       // console.log('Merged Data:', mergedData);
      }, 200);
    });
  }

  initChart(): void {

    this.chartdiv = document.getElementById('chartdiv');

    if (!this.chartdiv) {
      console.error('Chart container element not found!');
      return;
    }

    if (this.chart) {
      // Dispose of the existing chart and root
      //   this.chart.dispose();
    }

    // Dispose of the existing root associated with 'chartdiv'
    if (this.root) {
      // Dispose of the existing root
      this.root.dispose();
    }

    // Create a new am5.Root
    this.root = am5.Root.new(this.chartdiv);
    this.root.setThemes([am5themes_Animated.new(this.root)]);
    this.chart = this.root.container.children.push(am5map.MapChart.new(this.root, {}));
    this.polygonSeries = this.chart?.series.push(
      am5map.MapPolygonSeries.new(this.root, {
        include: [
          'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
          'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'ML', 'MW', 'MR', 'MU',
          'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
          'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ', 'CI'
        ],
        geoJSON: am5geodata_worldLow,
        valueField: "value",
        calculateAggregates: true,
        interactive: true
        // fill: am5.color(0xffa500)
      })
    );
    //console.log(' this.polygonSeries', this.polygonSeries);
    this.chart?.set("zoomLevel", 1.0);
    this.bubbleSeries = this.chart?.series.push(
      am5map.MapPointSeries.new(this.root, {
        valueField: 'value',
        calculateAggregates: true,
        polygonIdField: 'id'
      })
    );

    const circleTemplate = am5.Template.new({});
    let colorset = am5.ColorSet.new(this.root, {});
    // console.log('this.selectIndicator', this.selectedIndicators);
    if (!this.selectedIndicators.length || this.selectedIndicators.length === 1)
      this.bubbleSeries?.bullets.push((root, series, dataItem) => {
        const container = am5.Container.new(root, {});
        this.circle =
          container.children.push(
            am5.Circle.new(root, {
              radius: 4,
              // strokeOpacity: 0,
              fillOpacity: 0.7,
              fill: colorset.next(),
              // cursorOverStyle: 'pointer',
              //  tooltipText:'{{Country}}',
              tooltipText: '{name}: [bold]{value}[/]\nNumber of Irregular migrants: [bold]{Number_of_immigrants}[/]\nProportion: [bold]{Proportion}[/]'
            }, circleTemplate as any)
          );

        const countryLabel = container.children.push(
          am5.Label.new(root, {
            text: '{name}',
            centerX: am5.p100,
            paddingLeft: 5,
            populateText: true,
            fontSize: 13,
            fontWeight: "bold",
            //centerY: am5.p50,
            fontFamily: "segoe ui symbol"
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
    this.setDataBubble();
    //this.updateBubbleColor();


  }
  updateShowMap(val: boolean) {
    // this.initChart();
    this.showMap = val;
    this.cdr.detectChanges();
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
    //this.updateBubbleColor();

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
          Number_of_immigrants: data[i].Number_of_immigrants ? data[i].Number_of_immigrants : data[i].total_irregular_migrants,
          Proportion: data[i].Proportion ? data[i].Proportion : data[i].PercentOverall
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
    this.mapService.setRCPData(value);
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
    //console.log('selectedIndicators',this.selectedIndicators);
    if (this.selectedRcpValue === 'RCP 2.6(LOW)' && this.selectedIndicators?.length == 1 && (this.selectedIndicators[0] === 'Water index stress (Water)'
      || this.selectedIndicators[0] === 'Drought intensity change (Water)' || this.selectedIndicators[0] === 'Crop yield change (Land)')
      || this.selectedIndicators[0] === 'Agriculture water Stress index(Land)') {
      // this.updateBubbleColor();
      this.showHeatLegend = true;
      this.showMap = true;
      this.cdr.detectChanges();
      this.initChart();
      setTimeout(() => this.updateBubbleColor(), 200)
    }
    else if (this.selectedRcpValue === 'RCP 2.6(LOW)' && this.selectedIndicators?.length == 2) {
     if((this.selectedIndicators[0] === 'Drought intensity change (Water)'  && this.selectedIndicators[1] === 'Agriculture water Stress index (Land)') ||
    (this.selectedIndicators[1] === 'Drought intensity change (Water)'  && this.selectedIndicators[0] === 'Agriculture water Stress index (Land)')||
     (this.selectedIndicators[0] === 'Drought intensity change (Water)'  && this.selectedIndicators[1] === 'Heat Index Event exposure (Energy)') ||
    ( this.selectedIndicators[1] === 'Drought intensity change (Water)'  && this.selectedIndicators[0] === 'Heat Index Event exposure (Energy)')){
      this.showMap = false;
      
      // this.updateShowMap(false);
      this.cdr.detectChanges();
      this.initializeMap();
     }
     // this.updateShowMap(true);
    
    }
    else if (this.selectedRcpValue === 'RCP 2.6(LOW)' && this.selectedIndicators?.length === 3) {
      const expectedIndicators = [
        'Drought intensity change (Water)',
        'Agriculture water Stress index (Land)',
        'Heat Index Event exposure (Energy)'
      ];
      
      // Sort both arrays and compare
      const sortedSelectedIndicators = this.selectedIndicators.slice().sort();
      const sortedExpectedIndicators = expectedIndicators.slice().sort();
      const indicatorsMatch = JSON.stringify(sortedSelectedIndicators) === JSON.stringify(sortedExpectedIndicators);
      
      if (indicatorsMatch) {
      this.showMap = false;
      this.cdr.detectChanges();
      this.initializeMap();

      }

    }
    else {
      this.showMap = true;
      this.showHeatLegend = false;
      this.updateDefaultColor();
    }
  }


  selectCountry(country: string): void {
    this.selectedCountryValue = country;
    this.chart?.series.each((series) => {
      if (series instanceof am5map.MapPolygonSeries) {
        series.mapPolygons.each((mapPolygon) => {
          // Assuming the data has a property like `name` that represents the country name
          const mapPolygonName = (mapPolygon.dataItem?.dataContext as { name?: string })?.name;
          // console.log('mapPolygonName',mapPolygonName);

          if (mapPolygonName === country) {

            this.openDialog(mapPolygon);
          } else {
            // Deselect other map polygons
            if ('isActive' in mapPolygon) {
              mapPolygon.isActive = false;
            }
          }
        });
      }
    });
  }

  openDialog(_dataItem: any): void {
    // console.log('dataItem is',_dataItem);
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
      } else if (selectedCategory[0] === 'Drought intensity change (Water)') {
        return 'Least increase drought intensity';
      }
      else {
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
      } else if (selectedCategory[0] === 'Drought intensity change (Water)') {
        return 'Most increase drought intensity';
      } else {
        return 'Default end text';
      }
    }
    return '';
  }
 
  initializeMap() {
  
    const mapchart = document.getElementById('mapchart');
    if (mapchart) {
      const styles = window.getComputedStyle(mapchart);
      if (this.root1) {
        // Dispose of the existing root
        this.root1.dispose();
      }
      this.root1 = am5.Root.new(mapchart);
      this.root1.setThemes([
        am5themes_Animated.new(this.root1)
      ]);
      am5map.MapPointSeries.new(this.root, {
        valueField: 'value',
        calculateAggregates: true,
        polygonIdField: 'id'
      })
      const map = this.root1.container.children.push(
        am5map.MapChart.new(this.root1, {
        })
      );
      const polygonSeries = map.series.push(
        am5map.MapPolygonSeries.new(this.root1, {
          geoJSON: am5geodata_worldLow,
          exclude: ['antarctica'],
          include: [
            'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
            'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'ML', 'MW', 'MR', 'MU',
            'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
            'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ', 'CI'
          ],
          valueField: 'value',
          calculateAggregates: true
        })
      );    
   //   this.mapchart?.set("zoomLevel", 1);
      const pointSeries = map.series.push(
        am5map.MapPointSeries.new(this.root1, {
        
          polygonIdField: "id"
        })
      );
      const colorSet = am5.ColorSet.new(this.root1, { step: 2 });
      pointSeries.bullets.push( (root1: am5.Root, series: any, dataItem: any) => {
        const mean = dataItem.dataContext.mean || 0;
        const mean1 = dataItem.dataContext.mean1 || 0;
        const mean2 = dataItem.dataContext.mean2 || 0;
        const maxMean = Math.max(mean, mean1, mean2);
        const container = am5.Container.new(root1, {
        //  polygonIdField: "id"
        });
        const color = colorSet.next();
        const baseRadius = 5;
      
      
        for (let i = 1; i <= this.selectedIndicators.length; i++) {
          let radius = i * 5;
          let indicator = this.selectedIndicators[i-1];
          console.log('indicator valu eis',indicator);
          let words = indicator.split(' ');
          let lastWord = words[words.length - 1].replace('(','').replace(')', '');
        
         console.log('lastWord',lastWord);
         let src =`/assets/images/${lastWord.toLowerCase()}.jpeg`;
         const circle = am5.Picture.new(root1, {
            dx: 10 * i,
            width: 15,
            height: 15,
            centerX: am5.p50,
            centerY: am5.p50,
            tooltipText: i == 1 ? 'Drought-{mean1}' : i == 2 ? 'Water-{mean2}' : 'Agriculture-{mean1}',
            src:src
          //  src: i == 1 ? "/assets/images/img1.jpeg" : i == 2 ? "/assets/images/img2.jpeg" : "/assets/images/img3.jpeg"
          });
          const label =am5.Label.new(root1, {
            centerX: am5.p50,
            centerY: am5.p50,
            text: "{title}",
            populateText: true
          })
          container.set("interactive", true);
          container.children.push(circle);
          container.children.push(label);
        }
        return am5.Bullet.new(root1, {
          sprite: container
        });
      });
      console.log('this.mergedJSON',this.mergedJSON);
      // for (let i = 0; i < this.mergedJSON?.length; i++) {
         
      //   if (this.mergedJSON) {
      //     const d = this.mergedJSON[i];
      //     pointSeries.data.push({
      //       geometry: { type: 'Point', coordinates: [d.latitude, d.longitude] },
      //       id:d.id,
      //       title: d.Country,
      //       value: d.Country,
      //       mean: d.mean3,
      //       mean1: d.mean1,
      //       mean2: d.mean2
      //     });
      //   }
      // }
      if (this.mergedJSON) {
        for (let i = 0; i < this.mergedJSON.length; i++) {
          const d = this.mergedJSON[i];
      
          // Assuming you have an array of mean values in the order you want
          const meanValues = [d.mean1, d.mean2, d.mean3];
      
          const pointData:any = {
            geometry: { type: 'Point', coordinates: [d.latitude, d.longitude] },
            id: d.id,
            title: d.Country,
            value: d.Country,
          };
      
          // Set mean values iteratively
          for (let j = 0; j < meanValues.length; j++) {
            pointData[`mean${j + 1}`] = meanValues[j];
          }
      
          pointSeries.data.push(pointData);
        }
      }
    }
     
  }
  getData() {
    let uniqueCountries: any;
    const t = this.removeDuplicates(this.droughtData1, 'Country');
    return t;
  }

  removeDuplicates(array: any[], property: string | number) {
    return array?.filter((obj, index, self) =>
      index === self.findIndex((el) => el[property] === obj[property])
    );
  }
}

