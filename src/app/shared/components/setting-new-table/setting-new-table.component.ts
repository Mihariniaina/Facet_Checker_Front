import { Component, OnInit, TemplateRef,HostBinding, ViewChild ,Inject, Output, EventEmitter} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '@app/user-spaces/dashbord/components/lp-validator-test/lp-newvalidator/lp-newvalidator.component';

@Component({
  selector: 'app-setting-new-table',
  templateUrl: './setting-new-table.component.html',
  styleUrls: ['./setting-new-table.component.scss']
})
export class SettingNewTableComponent implements OnInit {

 @ViewChild('editModal') editModal : TemplateRef<any>; // Note: TemplateRef
  toggleChecked: boolean;
   @Output() colorEmitter = new EventEmitter < boolean > ();

   changed(e){
   this.data.toggleChecked=e.checked;

   this.colorEmitter.emit(this.data.toggleChecked);
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)public data: DialogData,
    public dialogRef: MatDialogRef<any>
  ) {
    this.toggleChecked =  this.data.toggleChecked;
  }

  ngOnInit(): void {

  }

  onNgModelChange(options: string) {


  }
  onClick(): void {

  }

  onChecked(event: any) {

  }


}
