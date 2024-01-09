import {Component, Inject, Input} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';



@Component({
  selector: 'app-migrant-dialog',
  templateUrl: './migrant-dialog.component.html',
  styleUrls: ['./migrant-dialog.component.css']
})
export class MigrantDialogComponent {
  @Input()
  dataSource!: any[];
  displayedColumns: string[] = ["Country", "2018","2019", "2020", "2021", "2022", "2023", "total_irregular_migrants"];
 //displayedColumns: string[] = ["Country"];
  constructor(
    public dialogRef: MatDialogRef<MigrantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataSource=data;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
