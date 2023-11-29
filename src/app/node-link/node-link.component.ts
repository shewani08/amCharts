// Import necessary modules
import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';
import jsonData from '../data/graph';
import svgGraph from '../data/bar';
import { CsvService } from '../service/CsvService';


interface Node {
  id: string;
  x?: number;
  y?: number;
  color?: string;
  tooltip?: string;
}

interface Link {
  source: string | Node;
  target: string | Node;
}

interface GraphData {
  nodes: Node[];
  links: Link[];
}


//let percentage = 12.5;

// Convert percentage to two-digit rounded number
// let roundedNumber = Math.round(percentage * 100);

// // Convert percentage to two-digit truncated number
// let truncatedNumber = (percentage * 100) % 100;
@Component({
  selector: 'app-node-link',
  template: '<div #graphContainer1><i class="fa fa-arrow-left back-icon" (click)="navigateBack()" aria-hidden="true"></i></div>',
  styleUrls: ['./node-link.component.css']
})

export class NodeLinkComponent implements OnInit {
  @ViewChild('graphContainer1', { static: true })
  graphContainer!: ElementRef;
  @Output() goBack = new EventEmitter<boolean>();
  private node_list = jsonData;
  private svgGraph = [{
    prt: 5,
    textX: 373,
    value: 'low',
    textY: 50.82896236022239,
    percentage: '2.3%',
    clipPathX: 373,
    clipPathY: 51,
    clipPathWidth: 25,
    clipPathHeight: 25
  },
  {
    textX: 393,
    prt: 10,
    value: 'med',
    percentage: '7.3%',
    textY: 50.82896236022239,
    clipPathX: 373,
    clipPathY: 51,
    clipPathWidth: 25,
    clipPathHeight: 25
  },
  {
    textX: 393,
    prt: 40,
    value: 'high',
    percentage: '10.3%',
    textY: 50.82896236022239,
    clipPathX: 373,
    clipPathY: 51,
    clipPathWidth: 25,
    clipPathHeight: 25
  }]


  private svgGraph1 = [{
    prt: 10,
    textX: 373,
    value: 'low',
    textY: 50.82896236022239,
    percentage: '5.3%',
    clipPathX: 373,
    clipPathY: 51,
    clipPathWidth: 25,
    clipPathHeight: 25
  },
  {
    textX: 393,
    prt: 15,
    value: 'med',
    percentage: '6.3%',
    textY: 50.82896236022239,
    clipPathX: 373,
    clipPathY: 51,
    clipPathWidth: 25,
    clipPathHeight: 25
  },
  {
    textX: 393,
    prt: 48,
    value: 'high',
    percentage: '12.3%',
    textY: 50.82896236022239,
    clipPathX: 373,
    clipPathY: 51,
    clipPathWidth: 25,
    clipPathHeight: 25
  }]
  constructor(private csvService: CsvService) {}
  ngOnInit(): void {
  
    this.createGraph('all');
  }
  navigateBack(){
    this.goBack.emit(true);
 }
  private createGraph(d:string): void {
    // Your provided node_list and edge_list
    // Create node_list and edge_list
   
    

    const edge_list: [string, string, {}][] = [
      ["climatePressure", "deathDueToClimatePressure", {}],
      ["climatePressure", "socialStability", {}],
      ["conflictMortality", "populationLoss", {}],
      ["climatePressure", "conflictMortality", {}],
      ["deathDueToClimatePressure", "populationLoss", {}],
      ["populationLoss", "socialVulnerability", {}],
      ["socialStability", "institutionalStability", {}],
      ["politicalStability", "institutionalStability", {}],
      ["economicStability", "institutionalStability", {}],
      ["institutionalStability", "prevalenceOfSOC", {}],
      ["mineOwnership", "prevalenceOfSOC", {}],
      ["typeOfMining", "prevalenceOfSOC", {}],
      ["limitedWorkOpprtunities", "prevalenceOfSOC", {}],
      ["controlOfCorruption", "abideByInternationalStandards", {}],
      ["ruleOfLaw", "abideByInternationalStandards", {}],
      ["abideByInternationalStandards", "prevalenceOfSOC", {}],
      ["controlOfCorruption", "socActors", {}],
      ["regulatoryQuality", "socActors", {}],
      ["socActors", "prevalenceOfSOC", {}],
      ["mineralProduction", "prevalenceOfSOC", {}],
      ["marketCost", "prevalenceOfSOC", {}],


      // Add more edges as needed

    ];


    

    type NodeType = {
      id: string;
      pos: number[];
      color: string;
      tooltip: string;
    }
    // Transform node_list and edge_list to the format expected by D3.js
    const data: GraphData = {
      nodes: this.node_list.map(([id, properties]) => ({ id, ...properties })),
      links: edge_list.map(([source, target, properties]) => ({ source, target, ...properties })),
    };
    const margin = 10;
    
    const width = window.outerWidth - margin;
    const height = window.outerHeight -margin;

    // Create a force simulation with increased link distance
    // const simulation = d3.forceSimulation<Node, Link>(data.nodes)
    //   .force('link', d3.forceLink<Node, Link>(data.links).id((d) => (d as Node).id).distance(700))
    //   .force('charge', d3.forceManyBody())
    //   .force('center', d3.forceCenter(width / 2, height / 2));

    // Create a force simulation with increased link distance
    const simulation = d3.forceSimulation<Node, Link>(data.nodes)
      .force('link', d3.forceLink<Node, Link>(data.links).id((d) => (d as Node).id).distance(400))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width/3, height/3 ))
      .force('collide', d3.forceCollide(100)); // Adjust the radius as needed


    const svg = d3.select(this.graphContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Create arrowhead marker definition
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 25) // Arrowhead position
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5'); // Arrowhead path

    // Create reversed arrowhead marker definition
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead-reversed')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', -25) // Arrowhead position
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L -10,0 L 0,5'); // Arrowhead path (reversed)

    // Create links with arrowheads and black color
    const link = svg.selectAll('.link')
      .data(data.links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('marker-end', (d: Link) => {
        if ((d.source as Node).id === 'climatePressure' && (d.target as Node).id === 'deathDueToClimatePressure') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'climatePressure' && (d.target as Node).id === 'socialStability') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'conflictMortality' && (d.target as Node).id === 'populationLoss') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'climatePressure' && (d.target as Node).id === 'conflictMortality') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'deathDueToClimatePressure' && (d.target as Node).id === 'populationLoss') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'populationLoss' && (d.target as Node).id === 'socialVulnerability') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'institutionalStability' && (d.target as Node).id === 'prevalenceOfSOC') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'mineOwnership' && (d.target as Node).id === 'prevalenceOfSOC') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'socialStability' && (d.target as Node).id === 'institutionalStability') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'politicalStability' && (d.target as Node).id === 'institutionalStability') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'economicStability' && (d.target as Node).id === 'prevalenceOfSOC') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'institutionalStability' && (d.target as Node).id === 'prevalenceOfSOC') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'typeOfMining' && (d.target as Node).id === 'prevalenceOfSOC') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'limitedWorkOpprtunities' && (d.target as Node).id === 'prevalenceOfSOC') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'controlOfCorruption' && (d.target as Node).id === 'abideByInternationalStandards') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'ruleOfLaw' && (d.target as Node).id === 'abideByInternationalStandards') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'abideByInternationalStandards' && (d.target as Node).id === 'prevalenceOfSOC') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'controlOfCorruption' && (d.target as Node).id === 'socActors') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'regulatoryQuality' && (d.target as Node).id === 'socActors') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'socActors' && (d.target as Node).id === 'prevalenceOfSOC') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'mineralProduction' && (d.target as Node).id === 'prevalenceOfSOC') {
          return 'url(#arrowhead)';
        } else if ((d.source as Node).id === 'marketCost' && (d.target as Node).id === 'prevalenceOfSOC') {
          return 'url(#arrowhead)';
        }

        else {
          return '';
        }
      })
      .attr('stroke', 'black'); // Set stroke color to black

    // Create nodes with different colors and tooltips
    const node = svg.selectAll('.node')
      .data(data.nodes)
      .enter().append('g')  // Create a group for each node
      .attr('class', 'node')
      .call(d3.drag<SVGGElement, Node, SVGElement>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      ); -

  
    node.append('rect')
      .attr('width', 100) // Set the width of the rectangle
      .attr('height', 100) // Set the height of the rectangle
      //.attr('fill', (d: Node) => d.color || 'black')
      .attr('fill', 'black')

      node.append('text').text((d: Node) => d.tooltip || '').attr('font-weight','bold').attr('font-size','11px').
      attr('text-anchor', 'right') 
       // Initially hide the tooltip
    //console.log('node',node);
    // .attr('transform', (d: Node, i: number) => {
    //   const col = i % columns;
    //   const row = Math.floor(i / columns);
    //   const x = col * horizontalSpacing;
    //   const y = row * verticalSpacing;
    //   return `translate(${x},${y})`;
    // });;
    // Append an SVG element to each group for the bar graph
    const barGraph = node.append('svg')
      .attr('width', 100) // Set the width of the SVG element
      .attr('height', 100); // Set the height of the SVG element

    // Append a rect element for the bar inside each SVG element
    
    let nodeGroup = barGraph.append('g');
    this.createBars(nodeGroup,d);
    
    //console.log('Here we show detail about graph',d.id);

    // Append a text element for the tooltip to each group
    const tooltip = node.append('text')
      .text((d: Node) => d.tooltip || '')
      .attr('dy', -20)  // Adjust the vertical position of the text
      .attr('text-anchor', 'middle') // Center the text
      .style('visibility', 'hidden'); // Initially hide the tooltip

    // Add tooltip text using title attribute
    node.append('title').text((d: Node) => d.tooltip || '');


    // Add tick function for simulation
    simulation.on('tick', () => {
      link
        .attr('x1', (d: Link) => (d.source as Node).x || 0)
        .attr('y1', (d: Link) => (d.source as Node).y || 0)
        .attr('x2', (d: Link) => (d.target as Node).x || 0)
        .attr('y2', (d: Link) => (d.target as Node).y || 0);

      node
        .attr('transform', (d: Node) => `translate(${d.x || 0 - 50},${d.y || 0 - 50})`);
    });

   

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }
  recreateGraph(id: string,_nodeGroup: any) {
    _nodeGroup.selectAll('rect').remove();
    _nodeGroup.selectAll('text').remove();
    this.createBars(_nodeGroup,id);
   // throw new Error('Method not implemented.');
  }
 createBars (nodeGroup:any,d:string){
  const numBars = 3; // Set the number of bars you want
    const barWidth = 20; // Set the width of each bar
    const barHeight = 20; // Set the height of each bar
    const barSpacing = 5; // Set the spacing between bars
    const t = d == 'all' ? this.svgGraph : this.svgGraph1
    console.log('value of t is',t);
    for (let i = 0; i < t.length; i++) {
     
    nodeGroup.append('rect')
        .attr('x', 10 + i * (barWidth + barSpacing)) // Calculate the x-coordinate based on index
        .attr('y', 70) // Set the y-coordinate of the bar
        .attr('width', barWidth) // Set the width of the bar
        .attr('height', 70) // Set the height of the bar
        .attr('fill', 'transparent'); // Set the fill color of the bar
        nodeGroup.append('text')
        .text(t[i].percentage) // Set the text content
        .attr('x', 10 + i * (barWidth + barSpacing) + barWidth / 2) // Center the text horizontally
        .attr('y', 70 - t[i].prt - 5)
        .attr('font-size', '8px') // Adjust the vertical position of the text
        .attr('text-anchor', 'middle') // Center the text horizontally
        .attr('fill', 'white'); // Set the text color
        nodeGroup.append('rect')
        .text(t[i].value)
        .attr('x', 10 + i * (barWidth + barSpacing)) // Calculate the x-coordinate based on index
        .attr('y', 70 - t[i].prt) // Set the y-coordinate of the bar
        .attr('width', barWidth) // Set the width of the bar
        .attr('height', t[i].prt) // Set the height of the bar
        .attr('fill', 'steelblue')
        .on('click', (event: any, d: Node) => {
         // this.createGraph(d.id);
         this.recreateGraph(d.id,nodeGroup);

          console.log('Here we show detail about graph',d.id);
        }); // Set the fill color of the bar
      //  Append text to the bar
      nodeGroup.append('text')
        .text(t[i].percentage) // Set the text content
        .attr('x', 10 + i * (barWidth + barSpacing) + barWidth / 2) // Center the text horizontally
        .attr('y', 70 - t[i].prt - 5)
        .attr('font-size', '8px') // Adjust the vertical position of the text
        .attr('text-anchor', 'middle') // Center the text horizontally
        .attr('fill', 'white'); // Set the text color

      nodeGroup.append('text')
        .text(t[i].value) // Set the text content
        .attr('x', 10 + i * (barWidth + barSpacing) + barWidth / 2) // Center the text horizontally
        .attr('y', 70 + 10)
        .attr('font-size', '8px') // Adjust the vertical position of the text
        .attr('text-anchor', 'middle') // Center the text horizontally
        .attr('fill', 'white');
    }
  }
}
