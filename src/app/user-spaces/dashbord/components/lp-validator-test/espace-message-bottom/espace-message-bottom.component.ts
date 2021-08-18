import { Component, OnInit } from '@angular/core';
import {MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {LpNewvalidatorService} from "@app/user-spaces/dashbord/components/lp-validator-test/lp-newvalidator/lp-newvalidator.service";

@Component({
  selector: 'app-espace-message-bottom',
  templateUrl: './espace-message-bottom.component.html',
  styleUrls: ['./espace-message-bottom.component.scss']
})
export class EspaceMessageBottomComponent implements OnInit {


  constructor(
    public _bottomSheetRef: MatBottomSheetRef<EspaceMessageBottomComponent>,
    public lpNewValidatorService: LpNewvalidatorService
  ) { }

  ngOnInit(): void { this.lpNewValidatorService.interruptOperation$.next(false);
  this.lpNewValidatorService.count = 1}

  public interropt() {
    this.lpNewValidatorService.interruptOperation$.next(true);
    this._bottomSheetRef.dismiss();
  }

}
