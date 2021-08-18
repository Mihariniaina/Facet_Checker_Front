import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewResizableDirective } from './new-resizable.directive';
import {LpNewvalidatorComponent} from '@app/user-spaces/dashbord/components/lp-validator-test/lp-newvalidator/lp-newvalidator.component';
import { MatCardModule } from '@angular/material/card';
import {SharedModule} from "@app/shared/modules/shared.module";
import {LandingModule} from "@app/shared/modules/landing.module";
import {MatStepperModule} from "@angular/material/stepper";
import {LandingPageModule} from "@app/shared/modules/landing-page.module";
import {ResizableModule} from "angular-resizable-element";
import {RouterModule} from "@angular/router";
import {LpValidatorComponent} from "@app/user-spaces/dashbord/components/lp-validator/lp-validator.component";
import {CapitalizeFirstPipePipe} from "@app/user-spaces/dashbord/pipe/capitalize-first-pipe.pipe";
import {LpValidatorService} from "@app/user-spaces/dashbord/services/lp-validator.service";
import {ItemTypeService} from "@app/user-spaces/dashbord/services/item-type.service";
import {PropertyValueService} from "@app/user-spaces/dashbord/services/property-value.service";
import {IdbService} from "@app/services/idb.service";
import {HttpCancelService} from "@app/shared/services/http-cancel.service";
import {TableOptionsComponent} from "@app/shared/components/table-options/table-options.component";
import {SettingTableComponent} from "@app/shared/components/setting-table/setting-table.component";
import {GoogleMachingComponent} from "@app/user-spaces/dashbord/components/lp-validator/google-maching/google-maching.component";
import {TuneItComponent} from "@app/user-spaces/dashbord/components/lp-validator/dialog/tune-it.component";
import {EspaceMessageBottomComponent} from "@app/user-spaces/dashbord/components/lp-validator-test/espace-message-bottom/espace-message-bottom.component";
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';



@NgModule({
  declarations: [
    NewResizableDirective,
    LpNewvalidatorComponent,
    EspaceMessageBottomComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    LandingModule,
    MatStepperModule, // stepper module
    LandingPageModule,
    ResizableModule,
     MatTableModule,
    MatSortModule,
    RouterModule.forChild([{ path: '', component: LpNewvalidatorComponent }]),
    MatCardModule,
  ],
  exports: [
    RouterModule,
    MatCardModule
  ],
  providers: [
    LpValidatorService,
    ItemTypeService,
    PropertyValueService,
    IdbService,
    HttpCancelService
  ],
  entryComponents: [
    TableOptionsComponent,
    SettingTableComponent,
    // ImportItemComponent,
    // CheckRelevancyComponent,
    // InferListComponent,
    GoogleMachingComponent,
    TuneItComponent,
  ],
})
export class LpNewvalidatorModule { }
