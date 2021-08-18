import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[newResizeColumn]'
})
export class NewResizableDirective {
  @Input('newResizeColumn') resizable: boolean;
  @Input() index: number;

  @Input() maxWidth: number;
  private minWidth: number;
  private isDbClicked: boolean = false;

  private startX: number;

  private startWidth: number = 0;

  private column: HTMLElement;

  private table: HTMLElement;

  private pressed: boolean;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.column = this.el.nativeElement;
  }

  ngOnInit() {
    if (this.resizable) {
      const row = this.renderer.parentNode(this.column);
      const thead = this.renderer.parentNode(row);
      this.table = this.renderer.parentNode(thead);

      const resizer = this.renderer.createElement('span');

      this.renderer.addClass(resizer, 'resize-holder');
      this.renderer.appendChild(this.column, resizer);
      this.renderer.listen(resizer, 'mousedown', this.onMouseDown);
      // this.renderer.listen(this.table, 'mousemove', this.onMouseMove);
      this.renderer.listen('document', 'mouseup', this.onMouseUp);
    }
  }

  onMouseDown = (event: MouseEvent) => {
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = this.column.offsetWidth;
  }

  @HostListener('body:mousemove', ['$event'])
  onMouseMove = (event: MouseEvent) => {
    const offset = 15;
    if (this.pressed && event.buttons) {
      // Calculate width of column
      const width = this.startWidth + (event.pageX - this.startX - offset);


      /*const tableCells = Array.from(
        document.querySelectorAll('.mat-row')
      ).map((row: any) => row.querySelectorAll('.mat-cell').item(this.index + 2));*/
      // Set table header width
      this.renderer.setStyle(this.column, 'width', `${width}px`);

      // render for input sreach field
      const columnName = this.column.childNodes[0] as HTMLElement;
      columnName.style.width = `${width}px`;

      // const divToResize = columnName.childNodes[1] as HTMLElement;
      // divToResize.style.width = `${width}px`;

      const searchCase = this.column.childNodes[1] as HTMLElement;

      const chi = searchCase.childNodes[0] as HTMLElement;
      chi.style.width = `${width}px`;

      const input = chi.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;
      input.style.width = `${width}px`;

      if (width > 30) searchCase.style.width = `${width}px`;

      this.isDbClicked = false;
    }
  };

  onMouseUp = (event: MouseEvent) => {
    if (this.pressed) {
      this.pressed = false;
      this.renderer.removeClass(this.table, 'resizing');
    }
  };

  @HostListener('dblclick', ['$event']) onLeave(e: MouseEvent) {
    this.isDbClicked = !this.isDbClicked;
    if (this.isDbClicked == true) {

      this.minWidth = this.column.offsetWidth;

      // Set table header width
      this.renderer.setStyle(this.column, 'width', `${this.maxWidth}px`);

      // render for input sreach field
      const columnName = this.column.childNodes[0] as HTMLElement;
      columnName.style.width = `${this.maxWidth}px`;

      const searchCase = this.column.childNodes[1] as HTMLElement;

      const chi = searchCase.childNodes[0] as HTMLElement;
      chi.style.width = `${this.maxWidth}px`;

      const input = chi.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;
      input.style.width = `${this.maxWidth}px`;

      if (this.maxWidth > 30) searchCase.style.width = `${this.maxWidth}px`;

    } else {
      // Set table header width
      this.renderer.setStyle(this.column, 'width', `${this.minWidth}px`);

      // render for input sreach field
      const columnName = this.column.childNodes[0] as HTMLElement;
      columnName.style.width = `${this.minWidth}px`;

      const searchCase = this.column.childNodes[1] as HTMLElement;

      const chi = searchCase.childNodes[0] as HTMLElement;
      chi.style.width = `${this.minWidth}px`;

      const input = chi.childNodes[0].childNodes[0].childNodes[1] as HTMLElement;
      input.style.width = `${this.minWidth}px`;

      if (this.minWidth > 30) searchCase.style.width = `${this.minWidth}px`;

    }
  }

}
