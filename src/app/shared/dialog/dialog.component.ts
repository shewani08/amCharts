import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldChinaHigh';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  chart: any;
  displayedColumns: string[] = ['name', 'value', 'id'];
  dataSource = [
    {name: this.data.data.name, value: this.data.data.value, id: this.data.data.id}];
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    
  }
  ngOnInit(){
    const chartdiv = document.getElementById('dialog');
    if (!chartdiv) {
      console.error('Chart container element not found!');
      return;
    }
    
  const root = am5.Root.new(chartdiv);
  root.setThemes([am5themes_Animated.new(root)]);
  this.chart = root.container.children.push(am5map.MapChart.new(root, {}));
  // this.chart.geoPoint().latitude=500;
  // this.chart.geoPoint().longitude=500;
  //this.chart.set("zoomLevel",0.8);
  console.log('this.data',this.data.data.id);
  const polygonSeries = this.chart.series.push(
    am5map.MapPolygonSeries.new(root, {
    

      include:[
        this.data.data.id
      ],
      geoJSON: am5geodata_worldLow,
    }))
  }

}
