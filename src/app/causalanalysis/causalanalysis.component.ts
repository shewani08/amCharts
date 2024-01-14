// causalanalysis.component.ts

import { Component, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5hierarchy from '@amcharts/amcharts5/hierarchy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

// Define the types for selectedValues and dropdownOptions
type SelectedValues = { [key: string]: string };
type DropdownOptions = { [key: string]: string[] };
declare var vis: any; // Declare Vis.js library
@Component({
  selector: 'app-causalanalysis',
  templateUrl: './causalanalysis.component.html',
  styleUrls: ['./causalanalysis.component.css']
})
export class CausalAnalysisComponent implements OnInit {
constructor() { }
selectCountry(_t44: any) {
throw new Error('Method not implemented.');
}

  health: string | undefined;
  circles = [
    "Inflation",
    "Health",
    "Food & Water",
    "Economic",
    "Political",
    "Social",
    
  ];
  selectedValues: SelectedValues = {};
  dropdownOptions: DropdownOptions = {};
  //circleColors: string[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  selectedHealth: string ='';
  selectedInflation: string ='';
  selectedEconomic: string ='';
  selectedPolitical: string ='';
  selectedFoodwater:string = '';
  selectedSocial: string = '';
  selectedYear: string = '';
  
countryNames: any;
  ngOnInit(): void {
    //selectHealth(type:string){
     //this.health=type;
    // AmCharts code goes here
    let root = am5.Root.new("chartdiv1");

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    const nodes: any[] = [
      {
        id: 99,
        font: { multi: true },
        widthConstraint: 150,
        label:
          "<b>Internal Displacements due to Climate Change</b> \n\n text",
        x: -1300,
        y: -680,
      },
      {
        id: 101,
        font: { multi: true },
        widthConstraint: 150,
        label: "<b>Inflation</b> \n\n Text#",
        x: -1300,
        y: -600,
      },
      {
        id: 102,
        font: { multi: true },
        widthConstraint: 150,
        label: "<b>Economic</b> \n\n Text# ",
        x: -1300,
        y: -500,
      },
      {
        id: 103,
        font: { multi: true },
        widthConstraint: 150,
        label: "<b>Health</b> \n\n Text#",
        x: -1300,
        y: -400,
      },
      {
        id: 104,
        font: { multi: true },
        widthConstraint: 150,
        label: "<b>Social</b> \n\n Text#",
        x: -1300,
        y: -300,
      },
      
      {
        id: 105,
        font: { multi: true },
        widthConstraint: 150,
        label: "<b>Political</b> \n\n Text#",
        x: -1300,
        y: -200,
      },
      {
        id: 106,
        font: { multi: true },
        widthConstraint: 150,
        label: "<b>Food & Water</b> \n\n Text#",
        x: -1300,
        y: -100,
      },
      
      {
        id: 201,
        font: { multi: true },
        widthConstraint: { minimum: 120 },
        label: "<b>Central Mediterranean Route</b> \n\n Text#",
        x: -550,
        y: -600,
      },
      {
        id: 202,
        font: { multi: true },
        widthConstraint: { minimum: 120 },
        label: "<b>Western Mediterranean Route</b> \n\n Text#",
        x: -550,
        y: -500,
      },
      {
        id: 203,
        font: { multi: true },
        widthConstraint: { minimum: 120 },
        label: "<b>Western Africa Route</b> \n\n Text#",
        x: -550,
        y: -400,
      },
      {
        id: 204,
        font: { multi: true },
        widthConstraint: { minimum: 120 },
        label: "<b>Other Route</b> \n\n Text#",
        x: -550,
        y: -300,
      },
      {
        id: 220,
        font: { multi: true },
        widthConstraint: { maximum: 170 },
        label:
          "<b>Total Irregular Migrants</b> \n\ntext",
        x: -900,
        y: -500,
      },

      {
        id: 301,
        font: { multi: true },
        widthConstraint: { minimum: 400 },
        label: "<b>Total Irregular Migrants in Europe Via Nothern African Routes</b> \n\n\n Text",
        x: -100,
        y: -500,
      },

      {
        id: 302,
        font: { multi: true },
        widthConstraint: { minimum: 400 },
        label: "<b>Total Irregular Migrants in UK from Nothern African Routes</b> \n\n\n Text",
        x: -10,
        y: -680,
      },
      
      
      // },
      // ... (same as in the provided JS code)
    ];

    const edges: any[] = [
      { from: 100, to: 210, label: " " },
  { from: 99, to: 220,arrows: "to", label: " " },
  { from: 100, to: 220,arrows: "to", label: " " },
  { from: 101, to: 220,arrows: "to", label: " " },
  { from: 102, to: 220,arrows: "to", label: " " },
  { from: 103, to: 220,arrows: "to", label: " " },
  { from: 104, to: 220,arrows: "to", label: " " },
  { from: 105, to: 220,arrows: "to", label: " " },
  { from: 106, to: 220,arrows: "to", label: " " },
  { from: 220, to: 201,arrows: "to", label: " " },
  { from: 220, to: 202,arrows: "to", label: " " },
  { from: 220, to: 203,arrows: "to", label: " " },
  { from: 220, to: 204,arrows: "to", label: " " },
  { from: 220, to: 205,arrows: "to", label: " " },
  { from: 201, to: 301,arrows: "to", label: " " },
  { from: 202, to: 301,arrows: "to", label: " " },
  { from: 203, to: 301,arrows: "to", label: " " },
  { from: 301, to: 302,arrows: "to", label: " " },
  {
    from: 401,
    to: 402,
    widthConstraint: { maximum: 150 },
    label: "middle valign to bottom valign",
  },
      // ... (same as in the provided JS code)
    ];
    const container = document.getElementById("chartdiv1");
    const data = {
      nodes: nodes,
      edges: edges,
    };

    const options = {
      edges: {
        font: {
          size: 12,
        },
        widthConstraint: {
          maximum: 90,
        },
      },
      nodes: {
        shape: "box",
        margin: 10,
        widthConstraint: {
          maximum: 300,
        },
      },
      physics: {
        enabled: false,
      },
    };

    const network = new vis.Network(container, data, options);
  }

    selectHealth(val:string) {
    this.selectedHealth=val;
  }
  selectInflation(val:string){
  this.selectedInflation= val;
}
selectEconomic(val:string){
  this.selectedEconomic=val;
}

selectPolitical(val:string){
  this.selectedPolitical =val;
}

selectFoodwater(val:string){
  this.selectedFoodwater=val;
}

selectSocial(val:string){
  this.selectedSocial=val;
}
selectYear(val:string){
  this.selectedYear=val;
}

}

