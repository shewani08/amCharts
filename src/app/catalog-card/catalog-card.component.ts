import { Component } from '@angular/core';

@Component({
  selector: 'app-catalog-card',
  templateUrl: './catalog-card.component.html',
  styleUrls: ['./catalog-card.component.css']
})
export class CatalogCardComponent {
health: string | undefined;
ngOnInit(){}
selectHealth(type:string){
this.health=type;
}
}
