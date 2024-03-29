import { PageNotFoundComponent } from './../page-not-found.component';
import { AvatarModule } from './../shared/modules/avatar.module';
import { Injectable, NgModule } from '@angular/core';
// import { DashbordComponent } from './dashbord/dashbord.component';
import { LandingPageModule } from '@app/shared/modules/landing-page.module';
import { LandingModule } from '@app/shared/modules/landing.module';
import { SharedModule } from '@app/shared/modules/shared.module';
import { RouterModule } from '@angular/router';
import { SideMenuComponent } from '@app/shared/components/side-menu/side-menu.component';
import { LayoutComponent } from '../pages/_layout/layout.component';
import { SubheaderWrapperComponent } from '@app/_metronic/partials/layout/subheader/subheader-wrapper/subheader-wrapper.component';
import { SearchOffcanvasComponent } from '@app/_metronic/partials/layout/extras/offcanvas/search-offcanvas/search-offcanvas.component';
import { NotificationsOffcanvasComponent } from '@app/_metronic/partials/layout/extras/offcanvas/notifications-offcanvas/notifications-offcanvas.component';
import { QuickActionsOffcanvasComponent } from '@app/_metronic/partials/layout/extras/offcanvas/quick-actions-offcanvas/quick-actions-offcanvas.component';
import { CartOffcanvasComponent } from '@app/_metronic/partials/layout/extras/offcanvas/cart-offcanvas/cart-offcanvas.component';
import { QuickPanelOffcanvasComponent } from '@app/_metronic/partials/layout/extras/offcanvas/quick-panel-offcanvas/quick-panel-offcanvas.component';
import { UserOffcanvasComponent } from '@app/_metronic/partials/layout/extras/offcanvas/user-offcanvas/user-offcanvas.component';
import { ToolbarComponent } from '@app/_metronic/partials/layout/extras/toolbar/toolbar.component';
import { ScrollTopComponent } from '@app/_metronic/partials/layout/extras/scroll-top/scroll-top.component';
import { ScriptsInitComponent } from '@app/pages/_layout/init/scipts-init/scripts-init.component';
import { Subheader7Component } from '@app/_metronic/partials/layout/subheader/subheader7/subheader7.component';
import { Subheader6Component } from '@app/_metronic/partials/layout/subheader/subheader6/subheader6.component';
import { Subheader5Component } from '@app/_metronic/partials/layout/subheader/subheader5/subheader5.component';
import { Subheader4Component } from '@app/_metronic/partials/layout/subheader/subheader4/subheader4.component';
import { Subheader3Component } from '@app/_metronic/partials/layout/subheader/subheader3/subheader3.component';
import { Subheader2Component } from '@app/_metronic/partials/layout/subheader/subheader2/subheader2.component';
import { Subheader1Component } from '@app/_metronic/partials/layout/subheader/subheader1/subheader1.component';
import { DropdownMenu4Component } from '@app/_metronic/partials/content/dropdown-menus/dropdown-menu4/dropdown-menu4.component';
import { DropdownMenu3Component } from '@app/_metronic/partials/content/dropdown-menus/dropdown-menu3/dropdown-menu3.component';
import { DropdownMenu2Component } from '@app/_metronic/partials/content/dropdown-menus/dropdown-menu2/dropdown-menu2.component';
import { DropdownMenu1Component } from '@app/_metronic/partials/content/dropdown-menus/dropdown-menu1/dropdown-menu1.component';
import { AsideComponent } from '@app/pages/_layout/components/aside/aside.component';
import { HeaderMobileComponent } from '@app/pages/_layout/components/header-mobile/header-mobile.component';
import { FooterComponent } from '@app/pages/_layout/components/footer/footer.component';
import { HeaderComponent } from '@app/pages/_layout/components/header/header.component';
import { HeaderMenuComponent } from '@app/pages/_layout/components/header/header-menu/header-menu.component';
import { TopbarComponent } from '@app/pages/_layout/components/topbar/topbar.component';
import { SearchDropdownInnerComponent } from '@app/_metronic/partials/layout/extras/dropdown-inner/search-dropdown-inner/search-dropdown-inner.component';
import { NotificationsDropdownInnerComponent } from '@app/_metronic/partials/layout/extras/dropdown-inner/notifications-dropdown-inner/notifications-dropdown-inner.component';
import { QuickActionsDropdownInnerComponent } from '@app/_metronic/partials/layout/extras/dropdown-inner/quick-actions-dropdown-inner/quick-actions-dropdown-inner.component';
import { CartDropdownInnerComponent } from '@app/_metronic/partials/layout/extras/dropdown-inner/cart-dropdown-inner/cart-dropdown-inner.component';
import { LanguageSelectorComponent } from '@app/pages/_layout/components/topbar/language-selector/language-selector.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GeneralModule } from '@app/_metronic/partials/content/general/general.module';
import { HighlightModule } from 'ngx-highlightjs';
import { NgbNavModule, NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchResultComponent } from '@app/_metronic/partials/layout/extras/dropdown-inner/search-dropdown-inner/search-result/search-result.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { UserDropdownInnerComponent } from '@app/_metronic/partials/layout/extras/dropdown-inner/user-dropdown-inner/user-dropdown-inner.component';
import { HeaderMenuDynamicComponent } from '@app/pages/_layout/components/header/header-menu-dynamic/header-menu-dynamic.component';
import {DateAgoPipe} from "@app/user-spaces/dashbord/pipe/date-ago.pipe";
import {TranslatePipe} from "@ngx-translate/core";
@Injectable({
  providedIn: 'root',
})
@NgModule({
  declarations: [
    // DashbordComponent,
    //LpNewvalidatorComponent,
    LayoutComponent,
    SideMenuComponent,
    SubheaderWrapperComponent, //...
    SearchOffcanvasComponent,
    NotificationsOffcanvasComponent,
    QuickActionsOffcanvasComponent,
    CartOffcanvasComponent,
    QuickPanelOffcanvasComponent,
    UserOffcanvasComponent,
    ToolbarComponent,
    ScrollTopComponent,
    ScriptsInitComponent,
    Subheader1Component,
    Subheader2Component,
    Subheader3Component,
    Subheader4Component,
    Subheader5Component,
    Subheader6Component,
    Subheader7Component,
    DropdownMenu1Component,
    DropdownMenu2Component,
    DropdownMenu3Component,
    DropdownMenu4Component,
    HeaderMobileComponent,
    AsideComponent,
    FooterComponent,
    HeaderComponent,
    HeaderMenuComponent,
    HeaderMenuDynamicComponent,
    TopbarComponent,
    SearchDropdownInnerComponent,
    NotificationsDropdownInnerComponent,
    QuickActionsDropdownInnerComponent,
    CartDropdownInnerComponent,
    LanguageSelectorComponent,
    SearchResultComponent,
    UserDropdownInnerComponent,

    // PIPES
    DateAgoPipe,
  ],
  imports: [
    LandingPageModule,
    LandingModule,
    SharedModule,
    // LayoutModule,
    NgbProgressbarModule, //ProgressBar module
    CommonModule,
    FormsModule,
    GeneralModule,
    HighlightModule,
    NgbNavModule,
    NgbTooltipModule,
    InlineSVGModule,
    AvatarModule,
    MatInputModule,
    RouterModule.forChild([
      {
        path: 'user-space',
        component: LayoutComponent,
        children: [
          {
            path: 'lp-validator/:idProduit',
            loadChildren: () =>
              import(
                './dashbord/components/lp-validator/lp-validator.module'
                ).then((m) => m.LpValidatorModule),
          },
          {
            path: 'lp-newvalidator/:idProduit',
            loadChildren: () =>
              import(
                './dashbord/components/lp-validator-test/lp-newvalidator/lp-newvalidator.module'
                ).then((m) => m.LpNewvalidatorModule),
          },
          {
            path: 'all-projects',
            loadChildren: () =>
              import(
                './dashbord/components/projects/all-projects/all-projects.module'
                ).then((m) => m.AllProjectsModule),
          },
          {
            path: 'new-project',
            loadChildren: () =>
              import(
                './dashbord/components/projects/new-projects/new-projects.module'
                ).then((m) => m.NewProjectsModule),
          },
          {
            path: 'profile',
            loadChildren: () =>
              import('./profiles/profiles.module').then(
                (m) => m.ProfilesModule
              ),
          },
          {path: '', redirectTo: 'all-projects', pathMatch: 'full'},
        ],
      },
      {path: '**', component: PageNotFoundComponent},
      {path: '', redirectTo: 'user-space', pathMatch: 'full'},
    ]),
  ],
  exports: [RouterModule],
  providers: [TranslatePipe]
  // providers: [
  //   TranslateService,
  //   TranslationService,
  //   LpValidatorService,
  //   ConvertUploadFileService
  // ],
  // entryComponents: [
  //   TableOptionsComponent,
  //   SettingTableComponent,
  //   ImportItemComponent,
  //   CheckRelevancyComponent,
  //   InferListComponent
  // ]
})
export class DashbordModule { }
