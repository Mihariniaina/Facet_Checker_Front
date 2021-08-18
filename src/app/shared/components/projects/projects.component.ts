import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { DetailsComponent } from '@app/user-spaces/dashbord/components/projects/dialog/details.component';
import { EditComponent } from '@app/user-spaces/dashbord/components/projects/dialog/edit.component';
import { RemoveComponent } from '@app/user-spaces/dashbord/components/projects/dialog/remove.component';
import { User } from '@app/classes/users';
import { AuthService } from '@app/authentification/services/auth.service';
import { Projects } from '@app/user-spaces/dashbord/interfaces/projects';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';
import { TriggerService } from '@app/user-spaces/services/trigger.service';
import { Observable } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, DoCheck {
  @Input() public allProjects$: Observable<Projects[]> = new Observable<
    Projects[]
  >(undefined);
  private user!: User;

  searchMasq: any;
  constructor(
    private projectServices: ProjectsService,
    public dialog: MatDialog,
    private common: CommonService,
    private notifs: NotificationService,
    public triggerServices: TriggerService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.user = this.auth.currentUserSubject.value;
  }

  ngOnInit(): void { }

  onExperimentalValidator(_id: any) {
    this.common.isLoading$.next(true);
    if (this.searchMasq !== undefined) {
      const queryParams: Params = { searchMasq: this.searchMasq };
      this.router.navigate(
        ['/user-space/lp-newvalidator', _id],
        {

          queryParams: queryParams,
          queryParamsHandling: 'merge',
        });

    }
    else
      this.router.navigate(['/user-space/lp-newvalidator', _id]);
  }
  public ngDoCheck(): void {
    this.route.queryParams.subscribe(params => {
      this.searchMasq = params['searchMasq'];//get value searchMasq   from param

    });
  }
  onDeteils(item: Projects) {
    this.dialog
      .open(DetailsComponent, {
        data: item,
        width: '60%',
      })
      .afterClosed()
      .pipe(
        map(() => {
          this.common.hideSpinner('root');
        })
      )
      .subscribe();
  }

  onDelete(item: Projects) {
    this.dialog
      .open(RemoveComponent, {
        data: {
          message: 'Are you sure to delete this project ?',
        },
        width: '600px',
      })
      .afterClosed()
      .pipe(
        map((result) => {
          if (result === true) {
            this.common.isLoading$.next(true);
            this.common.showSpinner('root');
            this.projectServices
              .deleteProjects(item._id)
              .subscribe((result) => {
                if (result && result.message) {
                  this.notifs.sucess(result.message);
                  this.allProjects$ = this.projectServices.refresh$.pipe(
                    tap(() => {
                      this.triggerServices.trigrer$.next(true);
                    }),
                    switchMap((_) => this.projectServices.getAllProjects(this.user._id))
                  );
                  this.common.isLoading$.next(false);
                  this.common.hideSpinner();
                }
              });
          }
        })
      )
      .subscribe();
  }

  onEdit(item: Projects) {
    this.dialog
      .open(EditComponent, {
        data: item,
        width: '75%',
        autoFocus: false,
      })
      .afterClosed()
      .pipe(
        map((result: boolean) => {
          if (result === true) {
            this.projectServices.refresh$.next(true);
            this.triggerServices.trigrer$.next(true);
          }
        })
      )
      .subscribe();
  }

  public navigateURL(_id: any) {
    this.common.isLoading$.next(true);
    this.router.navigate(['/user-space/lp-validator', _id]);
  }
}
