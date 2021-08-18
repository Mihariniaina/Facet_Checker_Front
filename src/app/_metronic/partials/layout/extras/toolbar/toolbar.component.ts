import { Component, OnInit, Input, Output, EventEmitter, DoCheck, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { map } from "rxjs/operators";
import { MatMenuPanel, MatMenuTrigger } from '@angular/material/menu';
import { Users } from '@app/models/users';
import { ProfilesService } from '@app/user-spaces/profiles/services/profiles.service';
import { AuthService } from '@app/authentification/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '@app/services/notification.service';
import { User } from '@app/classes/users';

export interface DialogData {
  toggleChecked: boolean;

}
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, DoCheck {

  toggleChecked4: boolean = false;
  searchMasq: string;

  @ViewChild(MatMenuTrigger) public menuTrigger: MatMenuTrigger;
  @ViewChild('clickmenu') clickmenu: MatMenuPanel; MatMenuTrigger;
  public user: Users;

  public updatedUser = {
    id: "",
    image: "",
    lastname: "",
    firstname: "",
    email: "",
    token: "",
    language: "",
    headColor: false,
    hideFilter: false,
    role: []

  };
  toggleChecked: boolean;
  toggleChecked2: boolean;
  toggleChecked3: boolean;

  colorTab: string;
  alterTab: string;
  gmkTab: string;

  modalOpen: any;
  isLoading$ = new BehaviorSubject<boolean>(false);

  changed(e) {
    this.toggleChecked = e.checked;
    this.colorTab = String(this.toggleChecked);

    const queryParams: Params = { colorTab: this.colorTab };//add param colorTab to route
    this.router.navigate(
      [],
      {
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      });
  }

  changed2(e) {
    this.toggleChecked2 = e.checked;
    //console.log("event  ++++++++++ " + this.toggleChecked2);

    this.alterTab = String(this.toggleChecked2);

    const queryParams: Params = { alterTab: this.alterTab };
    this.router.navigate(
      [],
      {
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      });
  }

  changed4(e) {
    this.toggleChecked4 = e.checked;
    this.searchMasq = String(this.toggleChecked4);

    const queryParams: Params = { searchMasq: this.searchMasq };//add param searchMasq to route
    this.router.navigate(
      [],
      {
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      });

    this.user.hideFilter = JSON.parse(this.searchMasq);
    this.updatedUser.hideFilter = this.user.hideFilter;
    this.isLoading$.next(true);
    const newUser = {
      ...this.user,
      image: this.updatedUser.image,
    } as Users;
    this.profileService
      .editUser(this.updatedUser.id, this.updatedUser)
      .subscribe((res: any) => {

        if (res && res.message) {
          this.profileService.checkUserInfo(newUser);
          this.notifs.sucess(res.message);
        }
        this.isLoading$.next(false);
      });

    // this.user.hideFilter = this.toggleChecked4;
    // this.servicehideFilter.updateHideFilter(this.user, this.user._id).subscribe(
    //   () => console.log("hideFilter")
    // );
  }

  changed3(e) {
    this.toggleChecked3 = e.checked;
    this.gmkTab = String(this.toggleChecked3);

    const queryParams: Params = { gmkTab: this.gmkTab };
    this.router.navigate(
      [],
      {
        queryParams: queryParams,
        queryParamsHandling: 'merge',
      });
  }


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private profileService: ProfilesService,
    private userService: AuthService,
    private notifs: NotificationService) {
    this.userService.currentUserSubject.pipe(
      map((user: User) => {
        if (user) {
          this.user = user,
            this.updatedUser.email = this.user.email;
          this.updatedUser.lastname = this.user.lastname;
          this.updatedUser.firstname = this.user.firstname;
          this.updatedUser.id = this.user._id;
          this.updatedUser.token = this.user.token;
          this.updatedUser.language = this.user.language;
          this.updatedUser.hideFilter = this.user.hideFilter;
          this.updatedUser.image = this.user.image;
          this.updatedUser.role = this.user.role;
          this.toggleChecked4 = this.user.hideFilter;
          this.searchMasq = String(this.toggleChecked4);
          const queryParams: Params = { searchMasq: this.searchMasq };
          this.router.navigate([], {
            queryParams: queryParams,
            queryParamsHandling: 'merge',
          });
        }
      }
      )
    )
      .subscribe();
  }

  public ngDoCheck(): void {

    this.route.queryParams.subscribe(params => {
      this.colorTab = params['colorTab'];
      if (this.colorTab !== undefined) { this.toggleChecked = JSON.parse(this.colorTab); }

      this.alterTab = params['alterTab'];
      if (this.alterTab !== undefined) { this.toggleChecked2 = JSON.parse(this.alterTab); }

      this.gmkTab = params['gmkTab'];
      if (this.gmkTab !== undefined) { this.toggleChecked3 = JSON.parse(this.gmkTab); }

      this.modalOpen = params['modal']
      //this.searchMasq = params['searchMasq'];
      //if (this.searchMasq !== undefined) { this.toggleChecked4 = JSON.parse(this.searchMasq); }

      if (this.modalOpen === "true") {
        this.menuTrigger.openMenu();
      }

    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.user._id = this.user['_id']
    }
  }


  menuOpened() {
    this.modalOpen = "true";
    const queryParams: Params = { modal: this.modalOpen };//add param colorTab to route
    this.router.navigate(
      [],
      {

        queryParams: queryParams,
        queryParamsHandling: 'merge',
      });

    this.menuTrigger.openMenu();

    setTimeout(() => {
      this.clickmenu.focusFirstItem('mouse');
      // console.log(document.querySelector('.menu-item'));
      // const firstItem: HTMLElement = document.querySelector('.menu-item');
      // firstItem.focus();
    })

  }
  menuClosed() {
    this.menuTrigger.closeMenu();
    this.modalOpen = "false";
    const queryParams: Params = { modal: this.modalOpen };//add param colorTab to route
    this.router.navigate(
      [],
      {

        queryParams: queryParams,
        queryParamsHandling: 'merge',
      });


  }
}
