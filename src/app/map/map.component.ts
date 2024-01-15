
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
  [country: string]: { count: number; sum: number; mean?: number;name?:string};
}
interface CountryData {
  count: number;
  sum: number;
  mean?: number;
  name?:string
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
const getColorForHeat = (value: number): string => {
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
    'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 
    'Malawi', 'Mali', 'Mauritania',  'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome & Principe',
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
  waterIndexData: any=[];
  temperaturData: any=[];
  meansTemparatureByCountry: Result|undefined;
  means: any;
  polygonImgSeries: any;
  map: am5map.MapChart | undefined;
  mapheatLegend: any;
  meansByCountryMed: Result | undefined;
  meansDroughtByCountryMed: Result | undefined;
  meansCropYieldByCountryMed: Result | undefined;
  meansAgricultureByCountryMed: Result | undefined;
  meansTemparatureByCountryMed: Result |undefined;
  rcpMediumData: any;
  droughtMedData: any;
  cropYieldMedData: any;
  agricultureMedData: any;
  temperaturMedData: any;
  rcpHighData: any;
  droughtHighData: any;
  cropYieldHighData: any;
  agricultureHighData: any;
  temperaturHighData: any;
  meansDroughtByCountryHigh: Result |undefined;
  meansByCountryHigh: Result |undefined;
  meansCropYieldByCountryHigh: Result |undefined;
  meansTemparatureByCountryHigh: Result |undefined; 
  meansAgricultureByCountryHigh: Result |undefined;

  constructor(private http: HttpClient, private dataService: CsvService, public dialog: MatDialog, public mapService: DataService,
    private yearService: YearService, private previousEvntService: PreviousEvntService,
    private cdr: ChangeDetectorRef) {
    this.dataService.getCoordinate().subscribe((rcp) => {
      this.fetchData = this.rcpToJson(rcp);
    })
  }

  ngOnInit(): void {
    this.selectedYearSubscription = this.yearService.selectedYear$.subscribe(year => {
      this.selectedYear = year;
      this.loadData();
    });
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
              
              if (prop !== "Country" && prop === 'mean') {
                const renamedProp = `mean${i}`;
                mergedEntry[renamedProp] = source[countryName][prop];
              } if (prop !== "Country" && prop === 'name') {
                const renamedProp = `name${i}`;
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
        endColor: this.updateHeatLegendStartColor(this.selectedIndicators),
        startColor: this.updateHeatLegendEndColor(this.selectedIndicators),
        startText: this.updateHeatLegendStartText(this.selectedIndicators),
        endText: this.updateHeatLegendEndText(this.selectedIndicators),
        stepCount: 3,
        minHeight: 20, // Set the minimum height of the legend
        maxHeight: 500,
        startValue: 0,
        endValue: 3,
        pixelHeight: 30,
        // x:-10,
        y: 60
      }));
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
        this.polygonSeries?.mapPolygons?.each((polygon: any) => {
          const dataContext = polygon.dataItem?.dataContext;
          if (dataContext && typeof dataContext === 'object' && 'name' in dataContext) {
            const countryName = dataContext.name;
            const countryEntry = countryMeanPairs?.find(([country]) => country === countryName);
            if (countryEntry?.length && this.selectedIndicators?.length == 1 && (this.selectedIndicators[0] === 'Water index stress (Water)'
              || this.selectedIndicators[0] === 'Drought intensity change (Water)')) {
              polygon.set("fill", am5.color(getColorForValue(countryEntry[1])));

            } else if (countryEntry?.length && this.selectedIndicators?.length == 1 && (this.selectedIndicators[0] === 'Crop yield change (Land)' ||
              this.selectedIndicators[0] === 'Agriculture water Stress index (Land)')) {
              polygon.set("fill", am5.color(getColorForLand(countryEntry[1]))); 
            } 
            else if (countryEntry?.length && this.selectedIndicators?.length == 1 && (this.selectedIndicators[0] === 'Heat Index Event exposure (Energy)')) {
              polygon.set("fill", am5.color(getColorForHeat(countryEntry[1])));
            } 
          } else {
            console.error('Invalid or missing data structure for polygon:', polygon);
          }
        });
      }
    }
  }

  updateHeatLegendEndColor(selectedIndicators: string[]) {
    if (this.selectedIndicators[0] === 'Water index stress (Water)'
      || this.selectedIndicators[0] === 'Drought intensity change (Water)') {
      return am5.color(0xCFCD9D);
    }
    else if (this.selectedIndicators[0] === 'Crop yield change (Land)' ||
      this.selectedIndicators[0] === 'Agriculture water Stress index (Land)') {
      return am5.color(0xf0b7a1);
      }
      else if (this.selectedIndicators[0] === 'Heat Index Event exposure (Energy)') {
        return am5.color(0xf0b7a1);
      
    }
    return am5.color("#000000");;
  }

  updateHeatLegendStartColor(selectedIndicators: string[]) {
    if (this.selectedIndicators[0] === 'Water index stress (Water)'
      || this.selectedIndicators[0] === 'Drought intensity change (Water)') {
      return am5.color(0xB41404);
    }
    else if (this.selectedIndicators[0] === 'Crop yield change (Land)' || this.selectedIndicators[0] === 'Agriculture water Stress index (Land)') {
      return am5.color(0x752201);
    }
    else if (this.selectedIndicators[0] === 'Heat Index Event exposure (Energy)') {
      return am5.color(0x752201);
    }
    return am5.color("#000000");;;
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

  private calculateMeanByCountry(data: Entry[], property: string,name:string) {
    const result: Result = {};
    data?.forEach((entry: { [x: string]: any; Country: any; }) => {
      const country = entry.Country;
      const score = entry[property];
      if (!result[country]) {
        result[country] = { count: 0, sum: 0, mean: 0 ,name:''};
      }
      result[country].name=name;
      result[country].count++;
      result[country].sum += score * 100 / 100;
      result[country].mean = result[country].sum / result[country].count;
    });
    return result;
  }

  private loadData(): void {
    if (!this.selectedYear) {
      this.dataService?.getMigrantData()?.subscribe((csvData) => {
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
      })

    } else {
      this.dataService?.getAfricaimmigrationData()?.subscribe((csvData) => {
        this.jsonData = this.csvToJson<CsvData>(csvData);
        this.previousData = this.jsonData.find((country: { Country: any; }) => country.Country === this.previousEvent.dataContext.name);
        this.previousEvntService.setPreviousEvent(this.previousData);
        this.setDataBubble();
      })
    }
    forkJoin([
      this.dataService.getRCPData(),
      this.dataService.getDroughtData(),
      this.dataService.getCropYieldData(),
      this.dataService.getAgricultureData(),
      this.dataService.getTemperatureData()
    ]).subscribe(([rcpData, droughtData, cropYieldData, agricultureData, temperaturData]) => {
      const property = 'SSP1_1p5_Score';
      this.rcpData = this.rcpToJson(rcpData);
      this.droughtData = this.rcpToJson(droughtData);
      this.cropYieldData = this.rcpToJson(cropYieldData);
      this.agricultureData = this.rcpToJson(agricultureData);
      this.temperaturData = this.rcpToJson(temperaturData);

      this.meansByCountry = this.calculateMeanByCountry(this.rcpData, property, 'Water index stress (Water)');
      this.meansDroughtByCountry = this.calculateMeanByCountry(this.droughtData, property, 'Drought intensity change (Water)');
      this.meansCropYieldByCountry = this.calculateMeanByCountry(this.cropYieldData, property, 'Crop yield change (Land)');
      this.meansAgricultureByCountry = this.calculateMeanByCountry(this.agricultureData, property, 'Agriculture water Stress index (Land)');
      this.meansTemparatureByCountry = this.calculateMeanByCountry(this.temperaturData, property, 'Heat Index Event exposure (Energy)');
      setTimeout(() => {
        // console.log('Merged Data:', mergedData);
      }, 200);
    });
    // For RCP MEDIUM

    forkJoin([

      this.dataService.getMediumWaterIndex(),
      this.dataService.getMediumDroughtData(),
      this.dataService.getMediumCropYieldData(),
      this.dataService.getMediumAgricultureData(),
      this.dataService.getTemperatureData()]).subscribe(([rcpMediumData, droughtMedData, cropYieldMedData, agricultureMedData, temperaturMedData]) => {

        const property = 'SSP2_1p5_Score';

        this.rcpMediumData = this.rcpToJson(rcpMediumData);
        this.droughtMedData = this.rcpToJson(droughtMedData);
        this.cropYieldMedData = this.rcpToJson(cropYieldMedData);
        this.agricultureMedData = this.rcpToJson(agricultureMedData);
        this.temperaturMedData = this.rcpToJson(temperaturMedData);
        this.meansByCountryMed = this.calculateMeanByCountry(this.rcpMediumData, property, 'Water index stress (Water)');
        this.meansDroughtByCountryMed = this.calculateMeanByCountry(this.droughtMedData, property, 'Drought intensity change (Water)');
        this.meansCropYieldByCountryMed = this.calculateMeanByCountry(this.cropYieldMedData, property, 'Crop yield change (Land)');
        this.meansAgricultureByCountryMed = this.calculateMeanByCountry(this.agricultureMedData, property, 'Agriculture water Stress index (Land)');
        this.meansTemparatureByCountryMed = this.calculateMeanByCountry(this.temperaturMedData, property, 'Heat Index Event exposure (Energy)');

        setTimeout(() => {
          // console.log('Merged Data:', mergedData);

        }, 200);
      });

       // For RCP HIGH

    forkJoin([

      this.dataService.getHighWaterIndex(),
      this.dataService.getHighDroughtData(),
      this.dataService.getHighCropYieldData(),
      this.dataService.getHighAgricultureData(),
      this.dataService.getTemperatureData()]).subscribe(([rcpHighData, droughtHighData, cropYieldHighData, agricultureHighData, temperaturHighData]) => {

        const property = 'SSP3_1p5_Score';

        this.rcpHighData = this.rcpToJson(rcpHighData);
        this.droughtHighData = this.rcpToJson(droughtHighData);
        this.cropYieldHighData = this.rcpToJson(cropYieldHighData);
        this.agricultureHighData = this.rcpToJson(agricultureHighData);
        this.temperaturHighData = this.rcpToJson(temperaturHighData);
        this.meansByCountryHigh = this.calculateMeanByCountry(this.rcpHighData, property, 'Water index stress (Water)');
        this.meansDroughtByCountryHigh= this.calculateMeanByCountry(this.droughtHighData, property, 'Drought intensity change (Water)');
        this.meansCropYieldByCountryHigh = this.calculateMeanByCountry(this.cropYieldHighData, property, 'Crop yield change (Land)');
        this.meansAgricultureByCountryHigh= this.calculateMeanByCountry(this.agricultureHighData, property, 'Agriculture water Stress index (Land)');
        this.meansTemparatureByCountryHigh = this.calculateMeanByCountry(this.temperaturHighData, property, 'Heat Index Event exposure (Energy)');

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
    if (this.chart) {}
    if (this.root) {
    this.root.dispose();}
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
      })
    );
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
    if (!this.selectedIndicators.length || this.selectedIndicators.length === 1)
      this.bubbleSeries?.bullets.push((root, series, dataItem) => {
        const container = am5.Container.new(root, {});
        this.circle =
          container.children.push(
            am5.Circle.new(root, {
              radius: 4,
              fillOpacity: 0.7,
              fill: colorset.next(),
              tooltipText: '{name}: [bold]{value}[/]\nNumber of Irregular migrants: [bold]{Number_of_immigrants}[/] \nUK Irregular Migrants(%): [bold]{Proportion }[/]'
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
  public setupHeatLegendMap(data: any) {
    this.mapheatLegend =  this.map?.children.push(am5.HeatLegend.new(this.map?.root, {
      orientation: "vertical",
      endColor: this.updateHeatLegendStartColor(this.selectedIndicators),
      startColor: this.updateHeatLegendEndColor(this.selectedIndicators),
      startText: this.updateHeatLegendStartText(this.selectedIndicators),
      endText: this.updateHeatLegendEndText(this.selectedIndicators),
      stepCount: 3,
      minHeight: 20,
      maxHeight: 500,
      startValue: 0,
      endValue: 3,
      pixelHeight: 30,

        y: 60
    }));
    
    this.mapheatLegend?.startLabel.setAll({
      fontSize: 12,
      fill: this.mapheatLegend.get("startColor")
    });
    
    this.mapheatLegend?.endLabel.setAll({
      fontSize: 12,
      fill: this.mapheatLegend.get("endColor")
    });
    this.polygonImgSeries.set("heatRules", [{
      target: this.polygonSeries.mapPolygons.template,
      dataField: "value",
      min: am5.color(0xff621f),
      max: am5.color(0x661f00),
      key: "fill"
    }]);
    this.polygonImgSeries.mapPolygons.template.events.on("pointerover", this.onMapPolygonPointerOver.bind(this));
    
    
  }
  
  onMapPolygonPointerOver(ev: any) {
    let countryDetail = (ev.target.dataItem?.dataContext as { name: string }).name;
    let countryMeanPairs: any;
    let countryEntry;
    const data: { [key: string]: CountryData } | undefined = this.selectedIndicatorData();

    if (data) {
      countryMeanPairs = Object.entries(data).map(
        ([country, data]) => [country, data.mean || 0]
      );
    }
    if (countryMeanPairs?.length) {
      countryEntry = countryMeanPairs?.find(([country]: [string, number]) => country === countryDetail);
    }
   
    if (countryEntry !== undefined && countryEntry[1] && countryEntry[1]!== null){ 
      this.heatLegend?.showValue(countryEntry[1]);
      this.mapheatLegend?.showValue(countryEntry[1]);
    }
     
  }

  selectedIndicatorData(): any {
    if (this.selectedRcpValue === 'RCP 2.6(LOW)' && this.selectedIndicators[0] === 'Water index stress (Water)') {
      return this.meansByCountry;
    } else if (this.selectedRcpValue === 'RCP 2.6(LOW)'  && this.selectedIndicators[0] === 'Drought intensity change (Water)') {
      return this.meansDroughtByCountry;
    } else if (this.selectedRcpValue === 'RCP 2.6(LOW)' && this.selectedIndicators[0] === 'Crop yield change (Land)') {
      return this.meansCropYieldByCountry;
    } else if (this.selectedRcpValue === 'RCP 2.6(LOW)'  && this.selectedIndicators[0] === 'Agriculture water Stress index (Land)') {
      return this.meansAgricultureByCountry;
    }else if (this.selectedRcpValue === 'RCP 2.6(LOW)'  && this.selectedIndicators[0] === 'Heat Index Event exposure (Energy)') {
      return this.meansTemparatureByCountry;
    }
    else if (this.selectedRcpValue === 'RCP 4.5(MEDIUM)' && this.selectedIndicators[0] === 'Water index stress (Water)') {
      return this.meansByCountryMed;
    } else if (this.selectedRcpValue === 'RCP 4.5(MEDIUM)'  && this.selectedIndicators[0] === 'Drought intensity change (Water)') {
      return this.meansDroughtByCountryMed;
    } else if (this.selectedRcpValue === 'RCP 4.5(MEDIUM)' && this.selectedIndicators[0] === 'Crop yield change (Land)') {
      return this.meansCropYieldByCountryMed;
    } else if (this.selectedRcpValue === 'RCP 4.5(MEDIUM)'  && this.selectedIndicators[0] === 'Agriculture water Stress index (Land)') {
      return this.meansAgricultureByCountryMed;
    }else if (this.selectedRcpValue === 'RCP 4.5(MEDIUM)'  && this.selectedIndicators[0] === 'Heat Index Event exposure (Energy)') {
      return this.meansTemparatureByCountryMed;
    }
    else if (this.selectedRcpValue === 'RCP 8.5(HIGH)' && this.selectedIndicators[0] === 'Water index stress (Water)') {
      return this.meansByCountryHigh;
    } else if (this.selectedRcpValue === 'RCP 8.5(HIGH)'  && this.selectedIndicators[0] === 'Drought intensity change (Water)') {
      return this.meansDroughtByCountryHigh;
    } else if (this.selectedRcpValue === 'RCP 8.5(HIGH)' && this.selectedIndicators[0] === 'Crop yield change (Land)') {
      return this.meansCropYieldByCountryHigh;
    } else if (this.selectedRcpValue === 'RCP 8.5(HIGH)'  && this.selectedIndicators[0] === 'Agriculture water Stress index (Land)') {
      return this.meansAgricultureByCountryHigh;
    }else if (this.selectedRcpValue === 'RCP 8.5(HIGH)'  && this.selectedIndicators[0] === 'Heat Index Event exposure (Energy)') {
      return this.meansTemparatureByCountryHigh;
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
    this.selectedIndicators = [];
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
    if (this.selectedRcpValue === 'RCP 2.6(LOW)' && this.selectedIndicators?.length == 1 ) {
      // this.updateBubbleColor();
      this.showHeatLegend = true;
      this.showMap = true;
      this.cdr.detectChanges();
      this.initChart();
      setTimeout(() => this.updateBubbleColor(), 200)
    }
    else if (this.selectedRcpValue === 'RCP 2.6(LOW)' && this.selectedIndicators?.length > 1) {
      this.showMap = false;
      const property = 'SSP1_1p5_Score';
      //this.mergedJSON = this.mergeJsonSources([this.fetchData, this.calculateMeanByCountry(this.droughtData,property), this.calculateMeanByCountry(this.cropYieldData,property) ]);
      const selectedDataSources = [];
      for (const indicator of this.selectedIndicators) {
        switch (indicator) {
          case 'Drought intensity change (Water)':
            selectedDataSources.push(this.calculateMeanByCountry(this.droughtData, property,'Drought intensity change (Water)'));
            break;
          case 'Crop yield change (Land)':
            selectedDataSources.push(this.calculateMeanByCountry(this.cropYieldData, property,'Crop yield change (Land)'));
            break;
            case 'Water index stress (Water)':
              selectedDataSources.push(this.calculateMeanByCountry(this.rcpData, property,'Water index stress (Water)'));
              break;
              case 'Agriculture water Stress index (Land)':
                selectedDataSources.push(this.calculateMeanByCountry(this.agricultureData, property,'Agriculture water Stress index (Land)'));
                break;
                case 'Heat Index Event exposure (Energy)':
                  selectedDataSources.push(this.calculateMeanByCountry(this.temperaturData, property,'Heat Index Event exposure (Energy)'));
                  break;
          
        }
      }
      
      this.mergedJSON = this.mergeJsonSources([this.fetchData, ...selectedDataSources]);
      this.cdr.detectChanges();
      if(this.mergedJSON)
      this.initializeMap();
    // }
     // this.updateShowMap(true);
    
    }
  
    else if (this.selectedRcpValue === 'RCP 4.5(MEDIUM)' && this.selectedIndicators?.length == 1 ) {
      // this.updateBubbleColor();
      this.showHeatLegend = true;
      this.showMap = true;
      this.cdr.detectChanges();
      this.initChart();
      setTimeout(() => this.updateBubbleColor(), 200)
    }
    else if (this.selectedRcpValue === 'RCP 4.5(MEDIUM)' && this.selectedIndicators?.length > 1) {
      this.showMap = false;
      const property = 'SSP2_1p5_Score';
      //this.mergedJSON = this.mergeJsonSources([this.fetchData, this.calculateMeanByCountry(this.droughtData,property), this.calculateMeanByCountry(this.cropYieldData,property) ]);
      const selectedDataSources = [];
      for (const indicator of this.selectedIndicators) {
        switch (indicator) {
          case 'Drought intensity change (Water)':
            selectedDataSources.push(this.calculateMeanByCountry(this.droughtMedData, property,'Drought intensity change (Water)'));
            break;
          case 'Crop yield change (Land)':
            selectedDataSources.push(this.calculateMeanByCountry(this.cropYieldMedData, property,'Crop yield change (Land)'));
            break;
            case 'Water index stress (Water)':
              selectedDataSources.push(this.calculateMeanByCountry(this.rcpMediumData, property,'Water index stress (Water)'));
              break;
              case 'Agriculture water Stress index (Land)':
                selectedDataSources.push(this.calculateMeanByCountry(this.agricultureMedData, property,'Agriculture water Stress index (Land)'));
                break;
                case 'Heat Index Event exposure (Energy)':
                  selectedDataSources.push(this.calculateMeanByCountry(this.temperaturMedData, property,'Heat Index Event exposure (Energy)'));
                  break;
          
        }
      }
      
      this.mergedJSON = this.mergeJsonSources([this.fetchData, ...selectedDataSources]);
      this.cdr.detectChanges();
      if(this.mergedJSON)
      this.initializeMap();  
    }
    else if (this.selectedRcpValue === 'RCP 8.5(HIGH)' && this.selectedIndicators?.length == 1 ) {
      // this.updateBubbleColor();
      this.showHeatLegend = true;
      this.showMap = true;
      this.cdr.detectChanges();
      this.initChart();
      setTimeout(() => this.updateBubbleColor(), 200)
    }
    else if (this.selectedRcpValue === 'RCP 8.5(HIGH)' && this.selectedIndicators?.length > 1) {
      this.showMap = false;
      const property = 'SSP3_1p5_Score';
      //this.mergedJSON = this.mergeJsonSources([this.fetchData, this.calculateMeanByCountry(this.droughtData,property), this.calculateMeanByCountry(this.cropYieldData,property) ]);
      const selectedDataSources = [];
      for (const indicator of this.selectedIndicators) {
        switch (indicator) {
          case 'Drought intensity change (Water)':
            selectedDataSources.push(this.calculateMeanByCountry(this.droughtHighData, property,'Drought intensity change (Water)'));
            break;
          case 'Crop yield change (Land)':
            selectedDataSources.push(this.calculateMeanByCountry(this.cropYieldHighData, property,'Crop yield change (Land)'));
            break;
            case 'Water index stress (Water)':
              selectedDataSources.push(this.calculateMeanByCountry(this.rcpHighData, property,'Water index stress (Water)'));
              break;
              case 'Agriculture water Stress index (Land)':
                selectedDataSources.push(this.calculateMeanByCountry(this.agricultureHighData, property,'Agriculture water Stress index (Land)'));
                break;
                case 'Heat Index Event exposure (Energy)':
                  selectedDataSources.push(this.calculateMeanByCountry(this.temperaturHighData, property,'Heat Index Event exposure (Energy)'));
                  break;
          
        }
      }
      
      this.mergedJSON = this.mergeJsonSources([this.fetchData, ...selectedDataSources]);
      this.cdr.detectChanges();
      if(this.mergedJSON)
      this.initializeMap();  
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
          console.log('mapPolygonName i s',mapPolygon);
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
    this.summaryData = _dataItem;
    this.clicked = true;
    this.sendDataToMigrateComponent(this.summaryData)
  }

  sendDataToMigrateComponent(_dataVal: any) {
    this.mapService.setMapData(_dataVal);
  }

  updateHeatLegendStartText(selectedCategory: string[]): string {
    if (selectedCategory.length > 0) {
      if (selectedCategory[0] === 'Water index stress (Water)' || selectedCategory[0] === 'Agriculture water Stress index (Land)') {

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
      if (selectedCategory[0] === 'Water index stress (Water)' || selectedCategory[0] === 'Agriculture water Stress index (Land)') {
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
      this.map = this.root1.container.children.push(
        am5map.MapChart.new(this.root1, {
        })
      );
      this.polygonImgSeries = this.map?.series.push(
        am5map.MapPolygonSeries.new(this.root1, {
          geoJSON: am5geodata_worldLow,
          exclude: ['antarctica'],
          include: [
            'AO', 'BJ', 'BW', 'BF', 'BI', 'CM', 'CV', 'CF', 'TD', 'KM', 'CG', 'CD', 'CI', 'DJ', 'EG', 'GQ',
            'ER', 'ET', 'GA', 'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'ML', 'MW', 'MR', 'MU',
            'YT', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RE', 'RW', 'ST', 'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD',
            'SZ', 'TZ', 'TG', 'TN', 'UG', 'EH', 'ZM', 'ZW', 'DZ', 'CI'],
          valueField: 'value',
          calculateAggregates: true
        })
      );  
      
      setTimeout(() => {
        this.polygonImgSeries?.mapPolygons?.each((polygon: any) => {
          let countryMeanPairs: [string, number][] = [];
          const dataContext = polygon.dataItem?.dataContext;
          const data: { [key: string]: CountryData } | undefined = this.selectedIndicatorData();
          if (data) {
            countryMeanPairs = Object.entries(data).map(
              ([country, data]) => [country, data.mean || 0]
            );
            this.countryMeanIdPairs = Object.entries(data).map(
              ([country, data]) => ({ id: country, value: data.mean || 0 })
            );
          }
          if (dataContext && typeof dataContext === 'object' && 'name' in dataContext) {
            const countryName = dataContext.name;
            const countryEntry = countryMeanPairs?.find(([country]) => country === countryName);
        
            if (countryEntry?.length && (this.selectedIndicators[0] === 'Water index stress (Water)'
              || this.selectedIndicators[0] === 'Drought intensity change (Water)')) {
              polygon.set("fill", am5.color(getColorForValue(countryEntry[1])));
            }else if (countryEntry?.length && (this.selectedIndicators[0] === 'Crop yield change (Land)' ||
            this.selectedIndicators[0] === 'Agriculture water Stress index (Land)')) {
             polygon.set("fill", am5.color(getColorForLand(countryEntry[1]))); 
          } 
          else if (countryEntry?.length && (this.selectedIndicators[0] === 'Heat Index Event exposure (Energy)')) {
            polygon.set("fill", am5.color(getColorForHeat(countryEntry[1])));
          }
          }
        });
    }, 100);
   //   this.mapchart?.set("zoomLevel", 1);
      const pointSeries = this.map?.series.push(
        am5map.MapPointSeries.new(this.root1, {
          polygonIdField: "id"
        })
      );
      if (this.mergedJSON) {
        for (let i = 0; i < this.mergedJSON.length; i++) {
          const d = this.mergedJSON[i];
      
          // Assuming you have an array of mean values in the order you want
          const meanValues = [d.mean1, d.mean2, d.mean3,d.mean4,d.mean5];
          this.means= meanValues;
          const nameValues=[d.name1,d.name2,d.name3,d.name4,d.name5]
      
          const pointData:any = {
            geometry: { type: 'Point', coordinates: [d.longitude,d.latitude] },
            id: d.id,
            title: d.Country,
            value: d.Country,
          };
          for (let j = 0; j < meanValues.length; j++) {
            pointData[`mean${j + 1}`] = meanValues[j];
           
          }
          for (let j = 0; j < nameValues.length; j++) {
            
            pointData[`name${j + 1}`] = nameValues[j];
          }
      
          pointSeries?.data.push(pointData);
        }
      }
      const colorSet = am5.ColorSet.new(this.root1, { step: 2 });
 
  pointSeries?.bullets.push((root1: am5.Root, series: any, dataItem: any) => {
    const container = am5.Container.new(root1, {});
    let meanValue;
    for (let i = 1; i <= this.selectedIndicators.length-1; i++) {
      // Assuming the mean values are stored in dataItem object
      if(i==1)
      meanValue = dataItem?.dataContext?.[`mean${i}`];
      if (meanValue !== undefined) {
        let indicator = this.selectedIndicators[i];
        // let words = indicator?.split(' ');
        // let lastWord = words[words?.length - 1].replace('(','').replace(')', '');
        // let src = `/assets/images/${lastWord.toLowerCase()}.jpeg`;

        let src = `/assets/images/${indicator}.png`;
  
        let numberOfCircles = 1;
        if (meanValue > 2) {
          numberOfCircles = 3;
        } else if (meanValue > 1 && meanValue < 2) {
          numberOfCircles = 2;
        }
  
        for (let j = 0; j < numberOfCircles; j++) {
          const horizontalSpacing = 2; // Adjust this value as needed
          const verticalSpacing = 2; // Adjust this value as needed
        // let dx =10;
          let dx = 10 * (i - 1) + j * (10 + horizontalSpacing);
          let dy = 10 + j * verticalSpacing;
  
          // Additional adjustments for specific values of i
          if (i === 2) {
            dy += 15; // Adjust this value as needed
          }
          if (i === 3) {
            dy += 30; // Adjust this value as needed
          }
          if (i === 4) {
            dy += 45; // Adjust this value as needed
          }
          if (i === 5) {
            dy += 60; // Adjust this value as needed
          }
          const circle = am5.Picture.new(root1, {
            dx: dx,
            dy: dy,
            width: 15,
            height: 15,
            // centerX: am5.p50,
            // centerY: am5.p50,
            tooltipText: j === 0 ? `{name${i + 1}}-{mean${i + 1}}` : undefined,
            src: src
          });
  
          container.children.push(circle);
        }
      }
    }
  
    const label = am5.Label.new(root1, {
      centerX: am5.p50,
      centerY: am5.p50,
      text: "{title}",
      populateText: true,
      fontSize: 13,
      fontWeight: "bold",
      fontFamily: "segoe ui symbol"
    });
  
    container.set("interactive", true);
    container.children.push(label);
  
    return am5.Bullet.new(root1, {
      sprite: container
    });
  });
}
   this.setupHeatLegendMap(1);
//  this.setHeatLegendValue();
 

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
  setHeatLegendValue(){
      this.heatLegend = this.chart?.children.push(am5.HeatLegend.new(this.chart.root, {
        orientation: "vertical",
        endColor: this.updateHeatLegendStartColor(this.selectedIndicators),
        startColor: this.updateHeatLegendEndColor(this.selectedIndicators),
        startText: this.updateHeatLegendStartText(this.selectedIndicators),
        endText: this.updateHeatLegendEndText(this.selectedIndicators),
        stepCount: 3,
        minHeight: 20, // Set the minimum height of the legend
        maxHeight: 500,
        startValue: 0,
        endValue: 3,
        pixelHeight: 30,
        // x:-10,
        y: 60
      }));
      this.heatLegend?.startLabel.setAll({
        fontSize: 12,
        fill: this.heatLegend.get("startColor")
      });

      this.heatLegend?.endLabel.setAll({
        fontSize: 12,
        fill: this.heatLegend.get("endColor")
      });
    
}}