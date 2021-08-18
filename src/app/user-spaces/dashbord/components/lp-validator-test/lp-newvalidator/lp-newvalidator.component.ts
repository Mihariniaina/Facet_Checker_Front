import { Component, HostListener, OnInit, ViewChild, Input, OnChanges, SimpleChanges, DoCheck, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Papa } from 'ngx-papaparse';
import { CombinatoricsService } from '../../../../../services/combinatorics.service';
import { PageEvent } from '@angular/material/paginator';
import { ThisReceiver } from '@angular/compiler';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { DataTypes } from '@app/user-spaces/interfaces/data-types';
import { CommonService } from '@app/shared/services/common.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

import { MatDialog } from "@angular/material/dialog";
import { SettingTableComponent } from '@app/shared/components/setting-table/setting-table.component';
import { TableOptionsComponent } from '@app/shared/components/table-options/table-options.component';
import { last, map } from 'rxjs/operators';
import { SettingRowsTable } from '@app/models/setting-table';
import { newArray } from '@angular/compiler/src/util';
import { MatBottomSheet, MatBottomSheetConfig } from "@angular/material/bottom-sheet";
import { BottonSheetComponent } from "@app/shared/components/botton-sheet/botton-sheet.component";
import { EspaceMessageBottomComponent } from "@app/user-spaces/dashbord/components/lp-validator-test/espace-message-bottom/espace-message-bottom.component";
import { LpNewvalidatorService } from "@app/user-spaces/dashbord/components/lp-validator-test/lp-newvalidator/lp-newvalidator.service";
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
export interface DialogData {
  toggleChecked: boolean;
  toggleCheckedAlternance: boolean
  toggleCheckedGMK: boolean
  toggleCheckedSearchMasq: boolean;

}

@Component({
  selector: 'app-lp-newvalidator',
  templateUrl: './lp-newvalidator.component.html',
  styleUrls: ['./lp-newvalidator.component.scss', './material-sort-icon.scss']
})
export class LpNewvalidatorComponent implements OnInit, DoCheck {
  csvPaginatedTableData = [];
  datasource = [];
  @Input() toggleChecked: boolean;
  colorTab: any;
  @Input() toggleCheckedAlternance: boolean;
  alterTab: any;
  @Input() toggleCheckedGMK: boolean;
  gmkTab: any;
  @Input() toggleCheckedSearchMasq: boolean;
  searchMasq: any;
  dataSource: MatTableDataSource<any>;
  changed() {
    console.log(this.toggleChecked);
  }
  iteams: any[] = [
    { value: 5 },
    { value: 10 },
    { value: 50 },
    { value: 100 },
    { value: 1000 },
    { value: 110005 },
    { value: 105000 },
    { value: 1020500 },
    { value: 1000000000 }
  ];

  @Input() data: DataTypes;

  public dataView: DataTypes = {

    displayColumns: [],

    hideColumns: [],

    data: [],

  };

  checked: boolean = true;

  public form = new FormGroup({
    fileName: new FormControl('', [
      Validators.required,
      Validators.pattern(/(.csv)/),
    ]),
    fileSource: new FormControl('', [Validators.required]),
  });
  public isExcel = false;
  fileName = '';
  fileDropped: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatHorizontalStepper) stepper!: MatHorizontalStepper;
  childRevelancy = { displayColumns: [], hideColumns: [], data: [] };

  public dataSources!: {
    displayColumns: string[];
    hideColumns: string[];
    data: any[];
  };

  page = 1;
  perpage = 10;
  totalPage = 10;

  inferlistData = [];
  inferlistColumns = [];
  inferlistColumnsToDisplay = [];
  inferlistColumnsHidden = [];

  columns = [];
  csvTableData = [];

  // inferList Step
  pageStart = 0;
  pageEnd = 0;
  pageStart2 = 0;
  pageEnd2 = 0;
  pageStart2k = "";
  pageEnd2k = "";
  total = 0;
  total2 = 0;
  total2k = "";
  initialise = true;
  showWithGMK = false;
  inferOrCheck = true;

  lastTablePage = 0;
  csvTablePerPage = 10;
  csvTablePage = 1;
  columnsToDisplay = [];
  columnsToHide = [];
  uploading = false;
  products = [];
  selectedDataArray = [];
  checklist: string[] = [];
  lastTotal = 0;
  selectedStepperIndex = 0;
  setIndexStep = 0;
  isEditeStepper = false;
  checkIndex: number;
  isNextStepp = false;

  nbInferBoxChecked2k = " ";
  nbInferLine2k = " ";

  showInferTable = true;

  postState: any = {};

  csvstats: any = {};
  inferliststats = {};
  sum = 0;

  // Number of Products
  nbProducts: number;
  nbProducts2K = " ";
  nbInferLine: number;
  // To know the number of Boxes Checked
  nbBoxChecked = 0;
  nbBoxChecked2K = " ";
  nbInferBoxChecked = 0;
  allChecked = true;
  allInferBoxChecked = true;
  // Row number of the last box checked
  lastProductCheck = 0;
  lastInferBoxChecked = 0;
  // Use to know if the CTRL Key is pressed
  ctrlDown = false;
  // Control the style of the sort arrows
  classArrows = 'arrows-container';
  // Array containing the inferData selection status
  // selectStatusInferData;
  // Use for column resizing
  private maxWidth: number;
  private minWidth: number;
  private maxWidthProduct: number;
  // Array containing whether a column is dbclicked or not
  private isDbclick: boolean[] = [];
  // Informations useful to column resizing
  isClickResize = false;
  startPositionResize: number;
  nbColumnResize: number;

  lastLoad: number;

  readonly config: MatBottomSheetConfig = {
    hasBackdrop: false,
    disableClose: false,
    panelClass: 'bottom-sheet-container',
    direction: 'ltr'
  };
  IfShow2color = false;
  previousBool = false;

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private papa: Papa,
    private combinatorics: CombinatoricsService,
    private common: CommonService,
    private route: ActivatedRoute,
    private router: Router,

    private _bottomSheet: MatBottomSheet,
    private lpNewValidatorservice: LpNewvalidatorService,
    public dialog: MatDialog) {
    console.log(this.csvPaginatedTableData);
  }


  public ngDoCheck(): void {
    this.route.queryParams.subscribe(params => {
      this.colorTab = params['colorTab'];//get value colorTab   from param
      if (this.colorTab !== undefined) {
        this.toggleChecked = JSON.parse(this.colorTab);
      };

      this.alterTab = params['alterTab'];
      if (this.alterTab !== undefined) {
        this.toggleCheckedAlternance = JSON.parse(this.alterTab);
      };

      this.searchMasq = params['searchMasq'];//get searchMasq value from param
      if (this.searchMasq !== undefined) {
        this.toggleCheckedSearchMasq = !JSON.parse(this.searchMasq);
        if (!this.toggleCheckedSearchMasq) {

        }
      };

      this.gmkTab = params['gmkTab'];
      if (this.gmkTab !== undefined) {
        this.toggleCheckedGMK = JSON.parse(this.gmkTab);
        if (this.toggleCheckedGMK != this.previousBool) {
          this.previousBool = this.toggleCheckedGMK;
          console.log(" here   ");
          this.reboot();
        }
      }
    });
  }

  reboot() {
    if (this.inferOrCheck == true) {
      this.csvTablePage = this.csvTablePage - 1;
      this.pageUp('infer');
    } else {
      this.page = this.page - 1;
      this.pageUp('checkR');
    }
  }

  public dataInferList: DataTypes;

  ngOnInit(): void {
    this.common.displayEscMessage = false;
    //this.dataSource.sort = this.sort;
    // console.log(this.dataSource)
  }

  ngOnDestroy(): void {
    console.log('hey');
    this.common.displayEscMessage = true;
  }

  changeShowInferTable(checked) {
    this.showInferTable = checked;
  }

  // Dbclick on column to resize them
  doubleClick(i: any) {

    let col;
    this.stepper._getFocusIndex() === 1 ? col = document.getElementById(`${this.nbColumnResize}columnproduct`)
      : col = document.getElementById(`${this.nbColumnResize}columninfer`);
    const c = col as HTMLElement;

    if (this.isDbclick[i]) {
      c.style.width = this.minWidth + 'px';
      const f = c.parentNode as HTMLElement;
      f.style.width = this.minWidth + 'px';
      const child = c.childNodes[0] as HTMLElement;
      const widthChild = this.minWidth - 10;
      child.style.width = widthChild + 'px';
      this.isDbclick[i] = false;
    } else {
      this.minWidth = c.offsetWidth;
      c.style.width = this.maxWidth + 'px';
      const f = c.parentNode as HTMLElement;
      f.style.width = this.maxWidth + 'px';
      const child = c.childNodes[0] as HTMLElement;
      const widthChild = this.maxWidth - 10;
      child.style.width = widthChild + 'px';
      this.isDbclick[i] = true;
    }

  }

  // The necessary informations are stored
  onMouseDownResize(i: any, event) {
    this.isClickResize = true;
    this.nbColumnResize = i;
    this.startPositionResize = event.pageX;
    // console.log('isClick : ' + this.isClickResize + ' ; nbColumn : ' + this.nbColumnResize + ' ; startPos : ' + this.startPositionResize);
  }

  // The resizing is over
  @HostListener('window:mouseup', ['$event'])
  onMouseUpResize(): void {
    if (this.isClickResize) { this.isClickResize = false; }
  }

  // Deal with the mouse moves when the user is resizing a column
  @HostListener('window:mousemove', ['$event'])
  onMouseMoveResize(event: MouseEvent) {
    // Check whether the right place has been clicked
    if (this.isClickResize) {
      let col;
      this.stepper._getFocusIndex() === 1 ? col = document.getElementById(`${this.nbColumnResize}columnproduct`)
        : col = document.getElementById(`${this.nbColumnResize}columninfer`);
      const c = col as HTMLDivElement;

      const width = c.offsetWidth - (this.startPositionResize - event.pageX);
      this.startPositionResize = event.pageX;
      // console.log('width : ' + width + ' ; window.sreenx : ' + c.offsetWidth);

      c.style.width = width + 'px';
      // console.log(c.parentNode.childNodes[1]);
      const f = c.parentNode as HTMLElement;
      f.style.width = width + 'px';
      const child = c.childNodes[0] as HTMLElement;
      const widthChild = width - 10;
      child.style.width = widthChild + 'px';
      // const ft = f.parentNode.parentNode.parentNode.parentNode.childNodes[1].childNodes[0];
    }
  }

  @HostListener('window:keydown', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    if (event.ctrlKey || event.shiftKey) {
      this.ctrlDown = true;
    }
    if (event.code === 'Escape' && Date.now() < (this.lastLoad + 1500)) {
      console.log(Date.now() + ' - ' + this.lastLoad);
      this._bottomSheet.open(EspaceMessageBottomComponent, this.config);
      console.log(this.lpNewValidatorservice.count);
      this.lpNewValidatorservice.interruptOperation$.subscribe(res => {
        if (res && this.lpNewValidatorservice.count === 1) {
          this.stepper.previous();
          this.lpNewValidatorservice.count--;
        }
      });
    }
  }

  @HostListener('window:keyup', ['$event']) onKeyupHandler(
    event: KeyboardEvent
  ) {
    this.ctrlDown = false;
  }

  selectChange(product, checked, index) {
    // If the CTRL/SHIFT is pressed onKeydownHandler will set this variable on true
    if (this.ctrlDown) {
      // last will contain the row number of the current product
      const last = index;
      let i = last > this.lastProductCheck ? this.lastProductCheck : last;
      const limit = last > this.lastProductCheck ? last : this.lastProductCheck;
      for (i; i < limit; i++) {
        this.csvTableData[i].selected = checked;
      }
      // We add the box that have been checked to the number of Checked Boxes
      checked ? this.nbBoxChecked += Math.abs(last - this.lastProductCheck) - 1
        : this.nbBoxChecked -= Math.abs(last - this.lastProductCheck) - 1;
    }
    if (checked) {
      this.nbBoxChecked++;
      if (this.nbBoxChecked === this.nbProducts) {
        this.allChecked = true;
      }
    } else {
      this.nbBoxChecked--;
      this.allChecked = false;
    }
    // lastProductCheck will contain the row number of the current product on order to use it later
    this.lastProductCheck = index;
    product.selected = checked;

    //Update value nbInferBoxChecked2k
    if (this.gmkTab == "true") {
      this.nbBoxChecked2K = this.encodageGMK(this.nbBoxChecked);
    } else {
      this.nbBoxChecked2K = this.encodageEspace(this.nbBoxChecked);
    }
    this.inferOrCheck = true;
    console.log(" alter " + this.nbBoxChecked2K + " number " + this.nbBoxChecked);
  }


  allCheckChange(checked) {
    this.allChecked = checked;
    this.csvTableData.forEach(product => product.selected = checked);
    checked ? this.nbBoxChecked = this.nbProducts : this.nbBoxChecked = 0;
  }

  selectInferdataChange(inferdata, checked, index) {
    // If the CTRL/SHIFT is pressed onKeydownHandler will set this variable on true
    if (this.ctrlDown) {
      // last will contain the row number of the current product
      const last = index;
      let i = last > this.lastInferBoxChecked ? this.lastInferBoxChecked : last;
      const limit = last > this.lastInferBoxChecked ? last : this.lastInferBoxChecked;
      for (i; i < limit; i++) {
        this.inferlistData[i].selected = checked;
        // this.selectStatusInferData[i + (this.page - 1) * this.perpage] = checked;
      }
      // We add the box that have been checked to the number of Checked Boxes
      checked ? this.nbInferBoxChecked += Math.abs(last - this.lastInferBoxChecked) - 1
        : this.nbInferBoxChecked -= Math.abs(last - this.lastInferBoxChecked) - 1;
    }
    if (checked) {
      this.nbInferBoxChecked++;
      if (this.nbInferBoxChecked === this.nbInferLine) {
        this.allInferBoxChecked = true;
      }
    } else {
      this.nbInferBoxChecked--;
      this.allInferBoxChecked = false;
    }
    // lastProductCheck will contain the row number of the current product on order to use it later
    this.lastInferBoxChecked = index;
    inferdata.selected = checked;
    // this.selectStatusInferData[index + (this.page - 1) * this.perpage] = checked;

    // Update nbInferBoxChecked
    this.inferOrCheck = false;
    if (this.gmkTab == "true") {
      this.nbInferBoxChecked2k = this.encodageGMK(this.nbInferBoxChecked);
    } else {
      this.nbInferBoxChecked2k = this.encodageEspace(this.nbInferBoxChecked);
    }
    console.log(" alter " + this.nbInferBoxChecked2k + " number " + this.nbInferBoxChecked);
  }

  allInferBoxesCheck(checked) {
    this.allInferBoxChecked = checked;
    this.inferlistData.forEach(inferdata => inferdata.selected = checked);
    /*for (let i = 0; i < this.selectStatusInferData.length; i++) {
      this.selectStatusInferData[i] = checked;
    }*/
    checked ? this.nbInferBoxChecked = this.nbInferLine : this.nbInferBoxChecked = 0;
  }

  // To switch arrows class on click
  columnSort() {

    if (this.sort.direction == 'asc') {
      this.classArrows = 'arrows-container-za';
      this.sort.direction = "desc";
    } else {
      this.classArrows = 'arrows-container-az';
      this.sort.direction = "asc";
    }
  }

  tableOptionsProduct() {
    this.dialog
      .open(TableOptionsComponent, {
        data: {
          noHiddenRows: this.columnsToDisplay,
          hiddenRows: this.columnsToHide,
        },
        width: '60%',
      })
      .afterClosed()
      .pipe(
        map((result: SettingRowsTable) => {
          if (result) {
            result.noHiddenRows.unshift('number');

            this.columnsToDisplay = result.noHiddenRows;
          }
        })
      )
      .subscribe();
  }

  tableOptionsInferData() {
    this.dialog
      .open(TableOptionsComponent, {
        data: {
          noHiddenRows: this.inferlistColumnsToDisplay,
          hiddenRows: this.inferlistColumnsHidden,
        },
        width: '60%',
      })
      .afterClosed()
      .pipe(
        map((result: SettingRowsTable) => {
          if (result) {
            result.noHiddenRows.unshift('number');

            this.inferlistColumnsToDisplay = result.noHiddenRows;
          }
        })
      )
      .subscribe();
  }

  public getWidthProduct(id: any) {

    this.maxWidthProduct = 0;
    //console.log('hey');
    for (let index = 0; index < this.csvTableData.length; index++) {

      this.maxWidth = 0;
      for (let index = 0; index < this.csvPaginatedTableData.length; index++) {

        const elem = document.getElementById(`${id}product${index}`);
        if (elem && this.maxWidth < elem?.offsetWidth) {
          this.maxWidth = elem.offsetWidth + 25;
        }
      }
    }
  }

  public getWidthInfer(id: any) {
    this.maxWidth = 0;

    for (let index = 0; index < this.inferlistData.length; index++) {
      const elem = document.getElementById(`${id}infer${index}`);
      if (elem && this.maxWidth < elem?.offsetWidth) {
        this.maxWidth = elem.offsetWidth + 25;
      }
    }
  }

  uploadFile() {
    // Show loading spinner
    this.common.isLoading$.next(true);
    this.common.showSpinner('root');

    this.sum = Number(this.lastTotal) | 0;
    if (this.csvTableData.length > 0) {
      this.uploading = true;
      const selectedData = this.csvTableData
        .filter((x) => !!x.selected)
        .map((x) => {
          const { selected, ...rest } = x;
          return rest;
        });
      const selectedDataCsv = this.papa.unparse(selectedData);
      this.selectedDataArray = selectedData;
      /*
        Add code here: upload selectedDataCsv to database, save products and get them back
      */

      this.uploading = false;
      //console.log(selectedDataCsv);
    }
    this.lastTotal = -1;
    this.createInferList();
  }


  // on average the worker and the non worker version perform about the same
  // it's just that there is a slight UI freeze when using the main thread
  // since it takes ~300ms for the first products computation and ~0.001ms for consecutive computations then the lag is not noticeable
  // but if you use a dataset that can make the UI freeze noticeable (something > 500ms is noticeable but acceptable , > 1s it becomes a pain)
  // it's better to use the worker
  // also if the browser doesnt support the worker the service would still fallback to the non worker version instead
  createInferList(worker = true) {
    //console.log('perPage', this.perpage);
    //console.log('pageNum', this.page);
    this.totalPage = this.getLastPage("checkR");
    //console.log('selectedData', this.selectedDataArray);
    let combinationsPromise = null;
    if (worker) {
      combinationsPromise = this.combinatorics.getPaginatedProductsCombinationsUsingWorker(this.selectedDataArray, this.page - 1, this.perpage);
    } else {
      combinationsPromise = this.combinatorics.getPaginatedProductsCombinations(this.selectedDataArray, this.page - 1, this.perpage);

    }
    combinationsPromise.then((inferlistWithStats) => {
      const inferlist = inferlistWithStats.facetsCombinations;
      //console.log({ inferlistWithStats });
      if (this.lastTotal == -1) {
        this.lastTotal = inferlistWithStats.stats.totalCombinationsCount;
        this.inferliststats = inferlistWithStats.stats;
        // this.selectStatusInferData = new Array(this.lastTotal);
        // initialisation array selectStatusInferData
        /*for (let i = 0; i < this.selectStatusInferData.length; i++) {
          this.selectStatusInferData[i] = true;
        }*/
        // Update the variable to the number of rows
        this.nbInferLine = this.lastTotal;
        this.nbInferBoxChecked = this.nbInferLine;
      }
      if (inferlist && inferlist.length > 0) {
        const sample = inferlist[0];
        // this should also perhaps be static later
        // that is why there are name display value but actually name and value or even value only is enough
        // it's there in case we want to display different names
        this.inferlistColumns = Object.keys(sample).map((x) =>
        ({
          name: x,
          display: x,
          value: x
        })
        );
        this.inferlistColumnsToDisplay = this.inferlistColumns.map((x) => x.name);
        this.inferlistColumnsToDisplay.unshift('number', 'select');
      }

      const inferlistCsvFormat = this.papa.unparse(inferlist);
      //console.log('CSV DATA:');
      //console.log(inferlistCsvFormat);
      this.inferlistData = inferlist.map((x) => ({ ...x, selected: true }));
      // Update of the current inferlistData select status with the ones saved earlier.
      let j = (this.page - 1) * this.perpage;
      for (const inferData of this.inferlistData) {
        inferData.selected = true;
        j++;
      }
      // Close loading spinner
      this.common.isLoading$.next(false);
      this.common.hideSpinner();
      this.common.isLoading$.subscribe(res => {
        if (!res) {
          this.lastLoad = Date.now();
        }
      });
      // add selected property
      this.total2 = Number(this.inferliststats["totalCombinationsCount"]) | 0;
      if (this.pageEnd2 == 0) {
        this.pageStart2 = 1;
        this.pageEnd2 = this.inferlistData.length;
        this.chooseUdpate("checkR");
      }
    });
  }

  postCurrent() {
    //console.log(`POSTING CURRENT PAGE ${this.page} ${this.perpage}`);
    this.postState.currentPage = this.page;
    this.postState.state = 'posting';
    const times = [];
    //console.log({ times });
    let ok = 1;
    return new Promise((resolve, reject) => {
      for (let i = 0; i < this.inferlistData.length; i++) {
        const nPostData = this.inferlistData[i];
        nPostData.numero = i;
        const timeobj = { index: i, start: performance.now(), end: 0 };
        times.push(timeobj);
        this.http.post(
          `${environment.baseUrl}/validator/search-item`,
          nPostData
        ).subscribe((data) => {
          timeobj.end = performance.now();
          //console.log('POST RESULT:');
          //console.log(data);
          this.postState.state = 'done';
          //console.log('ok : ' + ok);
          ok++;
          if (ok == this.inferlistData.length) {
            resolve(true);
          }
        });
      }

    });

  }

  postAll() {
    this.showInferTable = false;
    //console.log('POSTING ALL PAGES');
    if (this.page * this.perpage < this.lastTotal) {
      this.postCurrent().then((_) => {
        this.page = this.page + 1;
        this.createInferList();
        this.postAll();
      });
    }
  }

  onFileChange(event) {
    // Show loading spinner
    this.common.isLoading$.next(true);
    this.common.showSpinner('root');

    //this.goToFirstPage("infer");
    this.papa;
    this.isExcel = event.target
      ? !!event.target.files[0]?.name.match(/(.csv)/)
      : !!event[0]?.name.match(/(.csv)/);
    const file = event.target ? event.target.files[0] : event[0];
    this.fileName = event.target ? event.target.files[0]?.name : event[0]?.name;
    if (this.isExcel && (event.length > 0 || event.target.files.length > 0)) {
      // Show loading spinner
      this.common.isLoading$.next(true);
      this.common.showSpinner('root');
      this.form.patchValue({
        fileSource: file,
        fileName: file?.name,
      });

      this.readFile(file).subscribe((csvData) => {
        this.papa.parse(csvData, {
          complete: (result) => {
            //console.log('Parsed: ', result);
            this.updateTable(result.data);
            //console.log('=======');
            this.common.isLoading$.next(false);
            this.common.hideSpinner();
            this.common.isLoading$.subscribe(res => {
              if (!res) {
                this.lastLoad = Date.now();
              }
            });
          },
          header: true,
        });
      });
    }
    //console.log('hey');
    // reset input
    if (this.isExcel) {
      event.target.value = null;
      this.removeUpload();
    }
    // nextStep
    this.nextInfterList(event);
  }

  removeUpload() {
    this.fileName = '';
    this.isExcel = false;
    this.form.patchValue({
      fileSource: '',
      fileName: '',
    });
  }


  // the table displaying the data from the csv
  updateTable(table) {
    if (table.length > 0) {
      const sample = table[0];
      // this should perhaps be static later
      this.columns = Object.keys(sample).map((x) =>
      ({
        name: x,
        display: x,
        value: x
      })
      );
      this.columnsToDisplay = this.columns.map((x) => x.name);
      this.columnsToDisplay.unshift('number', 'select');
      this.csvstats = { total: table.length };
    }
    // add selected property
    this.csvTableData = table.map((x) => ({ ...x, selected: true }));

    this.updateCsvTablePagination();

    // Update the variable to the number of rows
    this.nbProducts = this.csvTableData.length;
    this.nbBoxChecked = this.nbProducts;

    //console.log(this.csvTableData);
    //console.log(this.columns);
    //console.log(this.columnsToDisplay);
  }

  updateCsvTablePagination() {
    // last

    this.lastTablePage = this.getLastPage("infer");
    this.lastTablePage = this.csvstats.total / this.csvTablePerPage | 0;
    const pageStart = (this.csvTablePage - 1) * this.csvTablePerPage;
    // if lastPage, get reste of total/itemPerPage
    // set pageEnd
    let pageEnd = pageStart + Number(this.csvTablePerPage);
    if (this.getLastPage("infer") === this.csvTablePage) {
      pageEnd = this.csvstats.total;
    }
    // actual
    this.pageStart = Number(pageStart) + 1;
    this.pageEnd = Number(pageEnd);

    // element total
    this.total = Number(this.csvstats.total);
    // todo replace with slice for better performance
    this.csvPaginatedTableData = this.csvTableData.filter((_, k) => {
      return k >= pageStart && k < pageEnd;
    });
    this.dataSource = new MatTableDataSource(this.csvPaginatedTableData);
    this.dataSource.sort = this.sort;

    if (this.initialise == true) {
      this.nbProducts = this.csvTableData.length;
      this.nbBoxChecked = this.nbProducts;
      this.chooseUdpate("infer");
      this.initialise = false;
    }
  }

  readFile(file) {
    return new Observable<string>((observer) => {
      const fileReader = new FileReader();
      fileReader.onload = () => observer.next(fileReader.result as string);
      fileReader.readAsText(file, 'UTF-8');
    });
  }

  selectionChange(ev: any) { }
  // Upload file ok
  public nextInfterList(event: any) {
    this.setIndexStep = this.stepper.selectedIndex;
    // this.isUserProject = true;
    this.dataSources = event;

    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;

    this.stepper.next();
  }

  public nextCheckRevelancy(event: any) {
    this.setIndexStep = this.stepper.selectedIndex;
    this.dataInferList = event;

    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;
    this.stepper.next();
  }

  public nextMatching(event: any) {
    this.setIndexStep = this.stepper.selectedIndex;
    this.childRevelancy = event;

    this.stepper.selected.completed = true;
    this.stepper.selected.editable = true;
    this.stepper.next();
  }

  private inferList(res: any[]) {
    const head = Object.keys(res[0]);
    if (head.indexOf('select') !== -1) {
      head.splice(head.indexOf('select'), 1);
    }
    head.unshift('number', 'select');
    return {
      displayColumns: head,
      data: res,
      hideColumns: [],
    };
  }

  private checkRevelancy(res: any[]) {
    const headers = [
      'number',
      'select',
      'List_Page_Label',
      'Number_of_Item',
      'List_Page_Main_Query',
      'Item_Type',
      '_1st_Property',
      '_2nd_Property',
      '_3rd_Property',
      '_4th_Property',
      '_5th_Property',
      'Property_Schema',
      '_id',
      'idProduct',
    ];
    return {
      displayColumns: headers,
      data: res,
      hideColumns: [],
    };
  }

  arrowSwitchColor(entering, arrow) {
    const enter = entering;
    //const image = document.getElementById("img-arrow-" + arrow) as HTMLImageElement;
    const htimage = document.getElementById("img-arrow-" + arrow);
    if (!enter
      || (arrow === 'left' && this.pageStart === 1)
      || (arrow === 'right' && this.csvTablePage === this.getLastPage('infer'))) {
      //image.src = 'assets/images/' + arrow + '-skinny.png';
      htimage.classList.add('page-arrow-blue');
      htimage.classList.remove('page-arrow-white');
    }
    else {
      //image.src = 'assets/images/' + arrow + '-skinny-w.png';
      htimage.classList.add('page-arrow-white');
      htimage.classList.remove('page-arrow-blue');
    }


  }

  arrowSwitchColor2(entering, arrow) {
    const enter = entering;
    const image = document.getElementById("img-arrow-" + arrow + "2") as HTMLImageElement;
    if (!enter
      || (arrow === 'left' && this.pageStart === 1)
      || (arrow === 'right' && this.csvTablePage === this.getLastPage('infer'))) {
      image.src = 'assets/images/' + arrow + '-skinny-b.png';
    }
    else
      image.src = 'assets/images/' + arrow + '-skinny-b.png';
  }

  private async checkProject(data: any[]): Promise<void> {
    if ((data[0].length && data[1].length) > 0) {
      this.selectedStepperIndex = 2;
      this.stepper.steps.forEach((step) => {
        step.completed = true;
        step.editable = true;
      });

      this.dataSources = this.inferList(data[0]);
      this.dataInferList = this.checkRevelancy(data[1]);
      this.isNextStepp = this.stepper?.steps.toArray()[0].completed;
      // this.common.hideSpinner('root');
      this.common.isLoading$.next(false);

    } else if (data[0].length > 0 && data[1].length == 0) {
      this.selectedStepperIndex = 1;
      this.stepper.steps.forEach((step, index) => {
        if (index < 1) {
          step.completed = true;
          step.editable = true;
        } else {
          step.completed = false;
          step.editable = true;
        }
      });

      this.dataSources = this.inferList(data[0]);
      this.isNextStepp = this.stepper?.steps.toArray()[0].completed;
      // this.common.hideSpinner('root');
      this.common.isLoading$.next(false);
    } else {
      this.selectedStepperIndex = 0;
      this.stepper.steps.forEach((step) => {
        step.completed = false;
        step.editable = true;
      });
      this.isNextStepp = false;
      // this.common.hideSpinner('root');
      this.common.isLoading$.next(false);
    }
  }

  facetLists: string[] = [];
  settingsOptions = this.facetLists;
  array: string[] = [];

  openSettingTable() {
    this.dialog
      .open(SettingTableComponent, {
        data: {
          facetLists: this.facetLists,
          selectedOptions: this.settingsOptions,
        },
        width: '600px',
      })
      .afterClosed()
      .pipe(
        map((result: string[]) => {
          //console.log(result);
          this.checklist = result;
          this.IfShow2color = false;
          this.showWithGMK = false;
          this.array = [];
          for (let key in this.checklist) {
            if (this.checklist.hasOwnProperty(key)) {
              this.array.push(this.checklist[key]);
              // Critères de vérification
              if (this.checklist[key] == "Alternance de Couleurs") {
                this.IfShow2color = true;
              }
              if (this.checklist[key] == "Pagination with GMK") {
                this.showWithGMK = true;
                this.goToFirstPage("infer");
              }
            }
          }
          //console.log(this.array);
          this.settingsOptions = this.array;
        })
      )
      .subscribe();


  }

  encodageEspace(params: number) {
    let aRetourner = "", j = 0;
    let nombre = params.toString();
    for (let i = nombre.length - 1; i >= 0; i--) {
      if (j % 3 == 0) {
        aRetourner = nombre[i] + " " + aRetourner;
      } else {
        aRetourner = nombre[i] + aRetourner;
      }
      j++;
    }
    return aRetourner;
  }

  updateValue(params: string) {
    if (params == "infer") {
      this.pageStart2k = this.encodageEspace(this.pageStart);
      this.pageEnd2k = this.encodageEspace(this.pageEnd);
      this.total2k = this.encodageEspace(this.total);
      this.nbBoxChecked2K = this.encodageEspace(this.nbBoxChecked);
      this.nbProducts2K = this.encodageEspace(this.nbProducts);
    } else {
      this.pageStart2k = this.encodageEspace(this.pageStart2);
      this.pageEnd2k = this.encodageEspace(this.pageEnd2);
      this.total2k = this.encodageEspace(this.total2);
      this.nbInferBoxChecked2k = this.encodageEspace(this.nbInferBoxChecked);
      this.nbInferLine2k = this.encodageEspace(this.nbInferLine);
    }
  }

  encodageGMK(params: number) {
    let aRetourner = "", j = 0;
    //console.log("encodage GMK : ++++++++++ ");
    //console.log("  type :  " + typeof params + " value " + params);

    let nombre = params.toString();

    for (let i = nombre.length - 1; i >= 0; i--) {
      if (j % 9 == 0 && j != 0) {

        aRetourner = nombre[i] + "G " + aRetourner;

      } else {
        if (j % 6 == 0 && j != 0) {
          aRetourner = nombre[i] + "M " + aRetourner;

        } else {
          if (j % 3 == 0 && j != 0) {
            aRetourner = nombre[i] + "K " + aRetourner;

          } else {
            if (((j + 2) % 3 == 0 && nombre[i] != '0' && nombre[i - 1] == '0' && nombre[i - 2] == '0') || (j % 3 == 0 && nombre[i] == '0' && nombre[i - 1] == '0' && nombre[i - 2] == '0')
              || ((j + 1) % 3 == 0 && nombre[i] == '0') || ((j + 2) % 3 == 0 && nombre[i] == '0' && nombre[i - 1] == '0'))
              aRetourner = aRetourner;
            else
              aRetourner = nombre[i] + aRetourner;
          }
        }
      }
      j++;
      //console.log(" nombre GMK : " + aRetourner);
    }
    return aRetourner;
  }

  updateValueToGMK(params: string) {
    //console.log(" update GMK ");
    if (params == "infer") {
      //console.log("updateValueToGMK " + params);
      this.pageStart2k = this.encodageGMK(this.pageStart);
      this.pageEnd2k = this.encodageGMK(this.pageEnd);
      this.total2k = this.encodageGMK(this.total);
      this.nbBoxChecked2K = this.encodageGMK(this.nbBoxChecked);
      this.nbProducts2K = this.encodageGMK(this.nbProducts);
    }
    else {
      this.pageStart2k = this.encodageGMK(this.pageStart2);
      this.pageEnd2k = this.encodageGMK(this.pageEnd2);
      this.total2k = this.encodageGMK(this.total2);
      this.nbInferBoxChecked2k = this.encodageGMK(this.nbInferBoxChecked);
      this.nbInferLine2k = this.encodageGMK(this.nbInferLine);
    }

  }

  goToFirstPage(params: string) {
    if (params == "infer") {
      this.csvTablePage = 1;
      this.inferOrCheck = true;
      this.updateCsvTablePagination();
      this.chooseUdpate(params);

    } else {
      this.page = 1;
      this.pageStart2 = (this.page - 1) * this.perpage + 1;
      this.pageEnd2 = (Number(this.pageStart2) + this.perpage) - 1;
      this.inferOrCheck = false;
      this.createInferList();
      this.chooseUdpate(params);
    }

  }

  goToLastPage(params: string) {
    if (params == "infer") {
      const modulo = this.csvstats.total % this.csvTablePerPage;
      const rep = this.csvstats.total / this.csvTablePerPage;
      if (modulo == 0) {
        this.csvTablePage = rep;
      } else {
        this.csvTablePage = (rep | 0) + 1;
      }
      this.updateCsvTablePagination();
      this.inferOrCheck = true;
      this.chooseUdpate(params);

    } else {
      const sum = Number(this.lastTotal) | 0;
      const modulo = sum % this.perpage;
      const rep = sum / this.perpage;
      this.nbInferBoxChecked += this.nbInferLine - this.nbInferBoxChecked;
      this.allInferBoxChecked = true;
      if (modulo == 0) {
        this.page = rep;
      } else {
        this.page = (rep | 0) + 1;
      }

      this.pageStart2 = (this.page - 1) * this.perpage;
      this.pageEnd2 = this.total2;
      this.inferOrCheck = false;
      this.createInferList();
      this.chooseUdpate(params);
      //this.updateValueToGMK(params);
    }
  }

  getLastPage(params: string) {
    if (params == "infer") {
      let lastPage = this.csvTablePage;
      const modulo = this.csvstats.total % this.csvTablePerPage;
      const rep = this.csvstats.total / this.csvTablePerPage;
      if (modulo == 0) {
        lastPage = rep;
      } else {
        lastPage = (rep | 0) + 1;
      }
      return lastPage;
    }
    else {
      let lastPage = this.page;
      const sum = Number(this.lastTotal) | 0;
      const modulo = sum % this.perpage;
      const rep = sum / this.perpage;
      this.nbInferBoxChecked += this.nbInferLine - this.nbInferBoxChecked;
      this.allInferBoxChecked = true;
      if (modulo == 0) {
        lastPage = rep;
      } else {
        lastPage = (rep | 0) + 1;
      }

      return lastPage;
    }
  }

  pageUp(params: string) {
    if (params == "infer") {
      this.csvTablePage = this.csvTablePage + 1;
      this.inferOrCheck = true;
      this.updateCsvTablePagination();
      this.chooseUdpate(params);
      //this.updateValue(params);
    } else {
      this.page = this.page + 1;
      this.pageStart2 = (this.page - 1) * this.perpage + 1;
      this.pageEnd2 = (Number(this.pageStart2) + this.perpage) - 1;
      this.inferOrCheck = false;
      this.nbInferBoxChecked += this.nbInferLine - this.nbInferBoxChecked;
      this.allInferBoxChecked = true;
      this.createInferList();
      this.chooseUdpate(params);
      //this.updateValueToGMK(params);
    }
  }

  pageDown(params: string) {
    if (params == "infer") {
      this.csvTablePage = this.csvTablePage - 1;
      this.inferOrCheck = true;
      this.updateCsvTablePagination();
      this.chooseUdpate(params);
    } else {
      this.page = this.page - 1;
      this.pageStart2 = (this.page - 1) * this.perpage + 1;
      this.pageEnd2 = (Number(this.pageStart2) + this.perpage) - 1;
      this.inferOrCheck = false;
      this.nbInferBoxChecked += this.nbInferLine - this.nbInferBoxChecked;
      this.allInferBoxChecked = true;
      this.createInferList();
      this.chooseUdpate(params);
    }
  }

  chooseUdpate(params: string) {
    if (this.toggleCheckedGMK == true)
      this.updateValueToGMK(params);
    else
      this.updateValue(params);
  }

}


