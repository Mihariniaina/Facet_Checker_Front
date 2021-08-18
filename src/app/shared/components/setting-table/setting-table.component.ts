import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SettingRowsTable } from '@app/models/setting-table';

@Component({
  selector: 'app-setting-table',
  templateUrl: './setting-table.component.html',
  styleUrls: ['./setting-table.component.scss'],
})
export class SettingTableComponent implements OnInit {
  selectedOptions: string[] = [];
  //Ici paramètres de base pour le bouton Settings
  //facetLists: string[] = ["Alternance de Couleurs", "Couleurs en en-tete"];
  facetLists: string[] = [];
  checked: boolean = false;
  checkedGMK: boolean = false;


  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<SettingRowsTable>
  ) {

    this.facetLists = this.data.facetLists;
    //this.facetLists = this.data.selectedOptions;
    this.selectedOptions = this.data.selectedOptions;
    //this.checked = this.data.checked;
    //this.selectedOptions = this.data.selectedOptions;
  }

  ngOnInit(): void {
    if (this.selectedOptions.includes("Alternance de Couleurs"))
      this.checked = true;
    if (this.selectedOptions.includes("Pagination with GMK"))
      this.checkedGMK = true;
    // this.onNgModelChange(this.data.checklist) ;
    //console.log(" options selectionnées" + this.data.selectedOptions);
    // this.onNgModelChange(this.data.selectedOptions[0]);
  }

  onNgModelChange(options: string) {
    if (!this.selectedOptions.includes(options)) {
      this.selectedOptions.push(options);
    } else {
      this.selectedOptions = this.selectedOptions.filter((s) => s !== options);
    }
    //console.log(this.selectedOptions);
  }

  onClick(): void {
    //this.dialogRef.close({ selected: this.selectedOptions, checked: this.checked });
    //console.log(" close : " + this.selectedOptions);
    this.dialogRef.close(this.selectedOptions);
  }

  onChecked(event: any) {
    this.selectedOptions = [];
    this.selectedOptions = event === false ? this.selectedOptions = this.facetLists : [];
    //console.log(this.selectedOptions);
  }


  slideToAlternance(event) {
    //console.log("event " + event);
    if (this.checked == true)
      this.selectedOptions.push("Alternance de Couleurs");
    if (this.checked == false)
      this.selectedOptions.splice(this.selectedOptions.indexOf("Alternance de Couleurs"));
    //this.onClick();
    //console.log(" Options : " + this.selectedOptions);
  }

  slideToGMK(event) {
    if (this.checkedGMK == true)
      this.selectedOptions.push("Pagination with GMK");
    if (this.checkedGMK == false)
      this.selectedOptions.splice(this.selectedOptions.indexOf("Pagination with GMK"));
    //this.onClick();
  }

}
