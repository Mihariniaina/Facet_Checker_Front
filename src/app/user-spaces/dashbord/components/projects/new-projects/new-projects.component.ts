import { HttpErrorResponse } from '@angular/common/http';
import { Component, DoCheck, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentification/services/auth.service';
import { User } from '@app/classes/users';
import { NotificationService } from '@app/services/notification.service';
import { CommonService } from '@app/shared/services/common.service';
import { ProjectsService } from '@app/user-spaces/dashbord/services/projects.service';

@Component({
  selector: 'app-new-projects',
  template: `
      <app-add-or-edit
        [userId]="userId"
        [isAddItem]="true"
        (formProject)="onSubmit($event)"
        style="padding: 45px 45px 0 45px;"
      ></app-add-or-edit>
  `,
  styleUrls: [],
  providers: [ProjectsService],
})
export class NewProjectsComponent implements DoCheck {
  public user: User;
  public userId: any;
  private form: FormGroup;

  private imageLandscape: File;
  private imageSquared: File;

  constructor(
    private auth: AuthService,
    private router: Router,
    private projetctService: ProjectsService,
    private notis: NotificationService,
    private common: CommonService
  ) {
    this.auth.currentUserSubject.subscribe(
      (user: User) => (this.userId = user._id)
    );
  }

  ngDoCheck(): void {
    this.common.hideSpinner();
  }

  async onSubmit(value: {
    form: FormGroup;
    imageLandscape: File;
    imageSquared: File;
  }) {
    this.form = value.form;
    this.imageLandscape = value.imageLandscape;
    this.imageSquared = value.imageSquared;
    if (this.form.valid) {
      this.common.showSpinner('root');
      try {
        const img1 = this.imageLandscape
          ? await this.projetctService.uploadImages(this.imageLandscape)
          : undefined;
        const img2 = this.imageSquared
          ? await this.projetctService.uploadImages(this.imageSquared)
          : undefined;

        const valus = {
          ...this.form.value,
          image_project_Landscape: img1 ? img1.img : '',
          image_project_Squared: img2 ? img2.img : '',
        };

        const result = await this.projetctService.addProjects(valus);
        if (result && result.message) {
          this.notis.sucess(result.message);
          this.common.hideSpinner();
          this.router.navigateByUrl('/user-space/all-projects');
        } else {
          console.log('not valid', result);
          this.notis.warn('input required');
          this.common.hideSpinner();
        }
      } catch (error) {
        if (error instanceof HttpErrorResponse) {
          console.log(error.message);
          this.notis.info(error.message);
        }
        this.common.hideSpinner();
        throw error;
      }
    }
  }
}
