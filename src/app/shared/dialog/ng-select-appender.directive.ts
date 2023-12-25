import { OverlayRef } from '@angular/cdk/overlay';
import { AfterViewInit, Directive, ElementRef, Optional } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { NgSelectComponent } from '@ng-select/ng-select';

@Directive({
  selector: 'ng-select[autoAppendTo]',
})
export class NgSelectAppenderDirective implements AfterViewInit {
  constructor(
    private readonly elementRef: ElementRef,
    private readonly ngSelect: NgSelectComponent,
    private readonly dialog: MatDialog,
    // HERE Opcionálisan injektáljuk a MatExpansionPanel
    @Optional() private readonly expansion: MatExpansionPanel
  ) {}

  ngAfterViewInit() {
    this.ngSelect.appendTo = this.getAppendTo();
  }

  getClosestDialog(
    element: ElementRef<HTMLElement>
  ): MatDialogRef<unknown> | undefined {
    let parent: HTMLElement | null = element.nativeElement.parentElement;

    while (parent && !parent.classList.contains('mat-dialog-container')) {
      parent = parent.parentElement;
    }

    if (parent == null) {
      return undefined;
    }

    return this.dialog.openDialogs.find((dialog) => dialog.id === parent?.id);
  }
  protected getAppendTo(): string | undefined {
    const modal = this.getClosestDialog(this.elementRef);

    if (modal == null) {
      // HERE Ha nem volt modal és nincs expansion sem akkor mint eredetileg undefined,
      // TÖRÖLD A KOMMENTET
      /* if (this.expansion != null) {
         return 'body';
      } */
      return undefined;
    }

    // const appendTo = (modal['_overlayRef'] as OverlayRef)[
    //   '_host'
    // ] as HTMLElement;
    // // itt az üres stringre is figyelni kell, nem csak a null/undefined-ra
    // appendTo.id = appendTo.id || `append-to-${0}`;

    // return `#${appendTo.id}`;
  }
}
