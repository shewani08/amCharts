import { Component } from '@angular/core';

interface SvgElement {
  nodeName:string,
  rectInnerFillColor:string,
  rectStrokeColor: string;
  rectX: number;
  rectY: number;
  rectFillColor: string;

  outerRectStrokeColor: string;
  outerRectX: number;
  outerRectY: number;
  outerRectWidth: number;
  outerRectHeight: number;

  innerRectStrokeColor: string;
  innerRectX: number;
  innerRectY: number;
  innerRectFillColor: string;
  innerRectWidth: number;
  innerRectHeight: number;

  clipPathId: string;
  clipPathRectX: number;
  clipPathRectY: number;
  clipPathRectWidth: number;
  clipPathRectHeight: number;

  textX: number;
  textY: number;
  queryValue: string;
}

@Component({
  selector: 'app-svg-list',
  templateUrl: './linerep.component.html',
})
export class SvgListComponent {


  svgGraph=[{
    prt:5,
    textX : 373,
    value:'low',
    textY : 50.82896236022239,
    percentage:2.3,
    clipPathX:373,
    clipPathY:51,
    clipPathWidth:25,
    clipPathHeight:25
  },
    {textX : 393, 
      prt:10,
      value:'med',
      percentage:10.3,
      textY : 50.82896236022239,
      clipPathX:373,
      clipPathY:51,
      clipPathWidth:25,
      clipPathHeight:25},
      {textX : 393, 
        prt:40,
        value:'high',
        percentage:7.3,
        textY : 50.82896236022239,
        clipPathX:373,
        clipPathY:51,
        clipPathWidth:25,
        clipPathHeight:25}]
  svgElements: SvgElement[] = [
    // Define your data for each SVG element here

    { 
      nodeName:'climatePressure',
      rectInnerFillColor: 'rgb(50, 30, 30)',
      rectStrokeColor : 'white',
    rectX :313,
    rectY : 36.69550340501212,
    rectFillColor : 'rgb(51, 50, 50)',
    outerRectStrokeColor : '#D3D3D3',
    outerRectX : 361.1625,
    outerRectY : 62.69550340501212,
    outerRectWidth : 25.299999999999955,
    outerRectHeight : 43,
  
    innerRectStrokeColor :'white',
    innerRectX : 361.1625,
    innerRectY : 10,
    innerRectFillColor : 'rgb(79, 121, 167)',
    innerRectWidth : 25,
    innerRectHeight : 10,
  
    clipPathId :'2',
    clipPathRectY : 93.82896236022239,
    clipPathRectHeight : 20,
  
    textX : 373,
    textY : 50.82896236022239,
    queryValue :'3.8%',
  
    clipPathRectX :313,
  
    clipPathRectWidth : 191.5,},
    {
      nodeName:'deathDueToClimatePressure',
      rectInnerFillColor: 'rgb(50, 30, 30)',
      rectStrokeColor : 'white',
      rectX :600,
      rectY : 92.69550340501212,
      rectFillColor : 'rgb(51, 50, 50)',
      outerRectStrokeColor : '#D3D3D3',
      outerRectX : 650.1625,
      outerRectY : 62.69550340501212,
      outerRectWidth : 25.299999999999955,
      outerRectHeight : 43,
    
      innerRectStrokeColor :'white',
      innerRectX : 361.1625,
      innerRectY : 104.32896236022239,
      innerRectFillColor : 'rgb(79, 121, 167)',
      innerRectWidth : 25.299999999999955,
      innerRectHeight : 1.3665410447897273,
    
      clipPathId :'1',
      clipPathRectY : 93.82896236022239,
      clipPathRectHeight : 10.5,
    
      textX : 660,
      textY : 93,
      queryValue :'2.8%',
    
      clipPathRectX :313,
    
      clipPathRectWidth : 191.5,
    },
    {
      nodeName:'conflictMortality',
      rectInnerFillColor: 'rgb(50, 30, 30)',
      rectStrokeColor : 'white',
      rectX :90,
      rectY : 42,
      rectFillColor : 'rgb(51, 50, 50)',
      outerRectStrokeColor : '#D3D3D3',
      outerRectX : 361.1625,
      outerRectY : 62.69550340501212,
      outerRectWidth : 25.299999999999955,
      outerRectHeight : 43,
    
      innerRectStrokeColor :'white',
      innerRectX : 361.1625,
      innerRectY : 104.32896236022239,
      innerRectFillColor : 'rgb(79, 121, 167)',
      innerRectWidth : 25.299999999999955,
      innerRectHeight : 1.3665410447897273,
    
      clipPathId :'1',
      clipPathRectY : 93.82896236022239,
      clipPathRectHeight : 10.5,
    
      textX : 150,
      textY : 50.82896236022239,
      queryValue :'9.8%',
    
      clipPathRectX :313,
    
      clipPathRectWidth : 191.5,
    },
    {
      nodeName:'conflictMortality',
      rectInnerFillColor: 'rgb(50, 30, 30)',
      rectStrokeColor : 'white',
      rectX :90,
      rectY : 42,
      rectFillColor : 'rgb(51, 50, 50)',
      outerRectStrokeColor : '#D3D3D3',
      outerRectX : 361.1625,
      outerRectY : 62.69550340501212,
      outerRectWidth : 25.299999999999955,
      outerRectHeight : 43,
    
      innerRectStrokeColor :'white',
      innerRectX : 361.1625,
      innerRectY : 104.32896236022239,
      innerRectFillColor : 'rgb(79, 121, 167)',
      innerRectWidth : 25.299999999999955,
      innerRectHeight : 1.3665410447897273,
    
      clipPathId :'1',
      clipPathRectY : 93.82896236022239,
      clipPathRectHeight : 10.5,
    
      textX : 150,
      textY : 50.82896236022239,
      queryValue :'9.8%',
    
      clipPathRectX :313,
    
      clipPathRectWidth : 191.5,
    },
    {
      nodeName:'populationLoss',
      rectInnerFillColor: 'rgb(50, 30, 30)',
      rectStrokeColor : 'white',
      rectX :690,
      rectY : 342,
      rectFillColor : 'rgb(51, 50, 50)',
      outerRectStrokeColor : '#D3D3D3',
      outerRectX : 361.1625,
      outerRectY : 62.69550340501212,
      outerRectWidth : 25.299999999999955,
      outerRectHeight : 43,
    
      innerRectStrokeColor :'white',
      innerRectX : 361.1625,
      innerRectY : 104.32896236022239,
      innerRectFillColor : 'rgb(79, 121, 167)',
      innerRectWidth : 25.299999999999955,
      innerRectHeight : 1.3665410447897273,
    
      clipPathId :'1',
      clipPathRectY : 93.82896236022239,
      clipPathRectHeight : 10.5,
    
      textX : 750,
      textY : 350.82896236022239,
      queryValue :'9.8%',
    
      clipPathRectX :313,
    
      clipPathRectWidth : 191.5,
    },
    {
      nodeName:'socialStability',
      rectInnerFillColor: 'rgb(50, 30, 30)',
      rectStrokeColor : 'white',
      rectX :150,
      rectY : 222,
      rectFillColor : 'rgb(51, 50, 50)',
      outerRectStrokeColor : '#D3D3D3',
      outerRectX : 361.1625,
      outerRectY : 62.69550340501212,
      outerRectWidth : 25.299999999999955,
      outerRectHeight : 43,
    
      innerRectStrokeColor :'white',
      innerRectX : 361.1625,
      innerRectY : 104.32896236022239,
      innerRectFillColor : 'rgb(79, 121, 167)',
      innerRectWidth : 25.299999999999955,
      innerRectHeight : 1.3665410447897273,
    
      clipPathId :'1',
      clipPathRectY : 93.82896236022239,
      clipPathRectHeight : 10.5,
    
      textX : 190,
      textY : 240.82896236022239,
      queryValue :'9.8%',
    
      clipPathRectX :313,
    
      clipPathRectWidth : 191.5,
    }
    // Add more elements as needed
  ];
}


