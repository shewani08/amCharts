import { Component } from '@angular/core';

interface SvgElement {
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
  template: `
    <svg width="100%" height="100%">
      <g *ngFor="let element of svgElements;let i = index">
        <rect
          class="prevent-touch-start"
          style="touch-action: none;"
          [attr.stroke]="element.rectStrokeColor"
          stroke-width="0.4"
          cursor="default"
          [attr.x]="element.rectX"
          [attr.y]="element.rectY"
          [attr.fill]="element.rectFillColor"
          width="201.5"
          height="105"
          fill-opacity="1.0"
        ></rect>

        <g >
          <defs>
            <clipPath [attr.id]="'innerClipPath' + i">
              <rect [attr.x]="element.clipPathRectX" [attr.y]="element.clipPathRectY" [attr.width]="element.clipPathRectWidth" [attr.height]="element.clipPathRectHeight"></rect>
            </clipPath>
          </defs>

          <text
            opacity="1"
            [attr.x]="element.textX"
            fill="white"
            dominant-baseline="hanging"
            [attr.y]="element.textY"
            font-size="11px"
            font-weight="600"
            text-anchor="start"
            [attr.clip-path]="'url(i)'"
          >
            VentTube
          </text>
        </g>

        <g style="touch-action: none;" data-test-id="EvidenceNodeVisualAction-VentTube-Low"><title>State: Low
        Query value: 2.8%</title><!--!-->
            <!--!--><!--!--><rect class="prevent-touch-start" style="touch-action: none;" stroke="#D3D3D3" stroke-width="0.3" cursor="default" x="361.1625" y="62.69550340501212" fill="transparent" width="25.299999999999955" height="43" fill-opacity="1.0"></rect><!--!--><rect class="prevent-touch-start" style="touch-action: none;" stroke="white" stroke-width="0.5" cursor="default" x="361.1625" y="104.32896236022239" fill="rgb(79, 121, 167)" width="25.299999999999955" height="1.3665410447897273" fill-opacity="1.0"></rect><!--!--><g><!--!--><defs><clipPath id="8e1165eb-f65f-4ed9-af62-eb7c07212345"><rect x="361.1625" y="93.82896236022239" width="25.299999999999955" height="10.5"></rect></clipPath></defs><!--!-->
        
        
            <svg:text opacity="1" x="373.8125" fill="white" dominant-baseline="hanging" y="93.82896236022239" font-size="8.5px" font-weight="normal" text-anchor="middle" clip-path="url(#8e1165eb-f65f-4ed9-af62-eb7c07212345)">2.8%</svg:text></g></g>
      </g>
      <g style="touch-action: none;" data-test-id="EvidenceNodeVisualAction-VentTube-Zero"><title>State: Zero
Query value: 6.7%</title><!--!-->
		<!--!--><!--!--><rect class="prevent-touch-start" style="touch-action: none;" stroke="#D3D3D3" stroke-width="0.3" cursor="default" x="392.7875" y="62.69550340501212" fill="transparent" width="25.299999999999955" height="43" fill-opacity="1.0"></rect><!--!--><rect class="prevent-touch-start" style="touch-action: none;" stroke="white" stroke-width="0.5" cursor="default" x="392.7875" y="102.40504324952312" fill="rgb(79, 121, 167)" width="25.299999999999955" height="3.2904601554890007" fill-opacity="1.0"></rect><!--!--><g><!--!--><defs><clipPath id="605841f5-c3b5-4616-bfa5-9f0bc189d161"><rect x="392.7875" y="91.90504324952312" width="25.299999999999955" height="10.5"></rect></clipPath></defs><!--!-->


    <svg:text opacity="1" x="405.4375" fill="white" dominant-baseline="hanging" y="91.90504324952312" font-size="8.5px" font-weight="normal" text-anchor="middle" clip-path="url(#605841f5-c3b5-4616-bfa5-9f0bc189d161)">6.7%</svg:text></g></g>
    <g style="touch-action: none;" data-test-id="EvidenceNodeVisualAction-VentTube-Normal"><title>State: Normal
Query value: 87.7%</title><!--!-->
		<!--!--><!--!--><rect class="prevent-touch-start" style="touch-action: none;" stroke="#D3D3D3" stroke-width="0.3" cursor="default" x="424.4125" y="62.69550340501212" fill="transparent" width="25.299999999999955" height="43" fill-opacity="1.0"></rect><!--!--><rect class="prevent-touch-start" style="touch-action: none;" stroke="white" stroke-width="0.5" cursor="default" x="424.4125" y="62.69550340501212" fill="rgb(79, 121, 167)" width="25.299999999999955" height="43" fill-opacity="1.0"></rect><!--!--><g><!--!--><defs><clipPath id="b0dd9f55-6a99-4036-9dfb-04d0161cea6c"><rect x="424.4125" y="52.19550340501212" width="25.299999999999955" height="10.5"></rect></clipPath></defs><!--!-->


    <svg:text opacity="1" x="437.0625" fill="white" dominant-baseline="hanging" y="52.19550340501212" font-size="8.5px" font-weight="normal" text-anchor="middle" clip-path="url(#b0dd9f55-6a99-4036-9dfb-04d0161cea6c)">87.7%</svg:text></g></g>
    </svg>
  `,
})
export class SvgListComponent {
  svgElements: SvgElement[] = [
    // Define your data for each SVG element here

    { rectStrokeColor : 'white',
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
  
    textX : 373.8125,
    textY : 50.82896236022239,
    queryValue :'3.8%',
  
    clipPathRectX :313,
  
    clipPathRectWidth : 191.5,},
    {
      rectStrokeColor : 'white',
      rectX :461,
      rectY : 72.69550340501212,
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
    
      textX : 910.8125,
      textY : 50.82896236022239,
      queryValue :'2.8%',
    
      clipPathRectX :313,
    
      clipPathRectWidth : 191.5,
    },
    // Add more elements as needed
  ];
}
