import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslatePipe } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@environments/environment";
import { element } from "protractor";
import { Notifications } from '../user-spaces/dashbord/interfaces/notifications';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  public language;

  public translationError = [['Incorrect password', 'Mot-de-passe incorrect'],
  ['e-mail doesn\'t exist', 'Cet email n\'existe pas'],
  ['Email already exists', 'Cet email existe déjà'],
  ['please complete all fields', 'Merci de compléter tous les champs'],
  ['User not found', 'Aucun utilisateur correspondant'],
  ['Email does not exists !!! sorry', 'Cet email n\'existe pas, désolé !'],
  ['Please give an email !', 'Merci de préciser un email'],
  ['Incorrect token !!!!', 'Token incorrect !'],
  ['User with this token does not existe', 'Aucun utilisateur avec ce token n\'existe'],
  [' this token is already used !', 'Ce token est déjà utilisé'],
  ['Project update error', 'Erreur lors de la mise à jour du projet'],
  ['Project not found!', 'Le projet n\'a pas été trouvé'],
  ['not project for the idProject', 'Aucun projet ne correspond à cet ID'],
  ['Format inconnu', 'Format inconnu'],
  ['Email already exists!', 'Cet email existe déjà'],
  ['User not found!', 'Aucun utilisateur correspondant'],
  ['The name must not exceed more than 24 characters', 'Le nom du projet ne doit pas dépasser 24 caractères'],
  ['Error getting notifs', 'Erreur du chargement des notifs'],
  ['Error saving notif', 'Erreur de l\'enregistrement de la notif'],
  ['Error deleting notif', 'Erreur de la suppression de la notif'],
  ['Error deleting all notifs', 'Erreur de la suppression des notifs']];

  public translationSuccess = [['User created', 'Compte créé'],
  ['Require Admin Role!', 'Nécessite le rôle d\'administrateur'],
  ['Require Freemium Role!', 'Nécessite d\'être Freemium'],
  ['Require Premium Role!', 'Nécessite d\'être Premium'],
  ['check  your e-mail please!', 'Merci de vérifier votre boite de réception'],
  ['Password update succefully', 'Votre mot-de-passe a bien été mise à jour'],
  ['New project created successfully!!', 'Création réussie !'],
  ['Project updated successfully!', 'Mise à jour réussie !'],
  ['Project deleted !', 'Projet supprimé !'],
  ['The product was deleted successfully', 'Le produit à bien été supprimé'],
  ['jsonFile not Found', 'Aucun fichier json trouvé'],
  ['inferlist vide', 'Inferlist vide'],
  ['Itemtype removed !', 'Itemtype retiré'],
  ['Item property value saved successful', 'Valeur de la propriété de l\'item enregistrée'],
  ['itemtype property removed !', 'La propriété de l\'itemtype rétirée'],
  ['User updated successfully!', 'Mise à jour du profile réussie'],
  ['Objet supprimé !', 'Objet supprimé !'],
  ['Notification saved', 'Notification enregistrée'],
  ['All notifications deleted', 'Suppression de toutes les notifs'],
  ['Notification deleted', 'Notification supprimée']];

  public notificationsTitle = [['Welcome Back !', 'Bienvenue !']];
  public notificationsText = [['Happy to see you !', 'Heureux de vous revoir !']];

  private readonly config: MatSnackBarConfig = {
    horizontalPosition: 'end',
    verticalPosition: 'bottom',
    duration: 3000,
  };

  // Array with the notifications that will appear on the topbar notification menu
  public topBarNotifications = [];

  private _userId;
  userImage;
  userSignUp = false;
  dateSignUp: Date;
  pathImage;

  constructor(private snackbar: MatSnackBar,
    private cookieService: CookieService,
    private http: HttpClient) {
    localStorage.getItem('language') ? this.language = localStorage.getItem('language') : this.language = 'en';
    localStorage.getItem('topBarNotifications') ? this.topBarNotifications = JSON.parse(localStorage.getItem('topBarNotifications'))
      : this.topBarNotifications = [];
    this.userImage = 'favicon.ico'
  }

  public warn(message: string) {
    let mes;
    let close;
    const find = this.translationError.find(res => res[0] === message);
    if (this.language !== 'en') {
      close = 'Fermer';
      if (find) {
        mes = find[1];
      } else {
        mes = message;
      }
    } else {
      mes = message;
      close = 'Close';
    }
    this.snackbar.open(mes, close, {
      ...this.config,
      panelClass: ['snack-bar-error'],
    });
  }

  public sucess(message: string) {
    let mes;
    let close;
    const find = this.translationSuccess.find(res => res[0] === message);
    if (this.language !== 'en') {
      close = 'Fermer';
      if (find) {
        mes = find[1];
      } else {
        mes = message;
      }
    } else {
      mes = message;
      close = 'Close';
    }
    this.snackbar.open(mes, close, {
      ...this.config,
      panelClass: ['snack-bar-success'],
    });
  }

  public info(message: string) {
    this.snackbar.open(message, 'Close', {
      ...this.config,
      panelClass: ['snack-bar-info'],
      duration: undefined,
    });
  }

  public infoIterropt(message: string) {
    this.snackbar.open(message, 'Close', {
      ...this.config,
      panelClass: ['snack-bar-info-echape'],
      duration: undefined,
      // duration: 4000,
    });
  }

  public dismiss() {
    this.snackbar.dismiss();
  }

  public addSignUpNotif() {
    this.userSignUp = true;
    this.dateSignUp = new Date();
  }

  public addNotifTopBar(notifTitle: string, notifText: string, notifDate, userId: any = this._userId) {
    console.log(userId);
    this.postNotifDB(notifTitle, notifText, notifDate, userId)
      .subscribe((res: any) => {
        if (res) {
          this.sucess('Notification saved');
          this.topBarNotifications.push({
            _id: res._id,
            title_notification: notifTitle,
            message_notification: notifText,
            date_notification: notifDate,
            image_notification: res.image_notification
          });
          localStorage.setItem('topBarNotifications', JSON.stringify(this.topBarNotifications));
        }
      });
  }

  public postNotifDB(notifTitle: string, notifText: string, notifDate, userId: any): Observable<Notifications> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.cookieService.get('SEMEWEE')}`
    );
    return this.http.post<Notifications>(
      `${environment.baseUrl}/notification/userNotif`,
      {
        user_id: userId,
        title: notifTitle,
        message: notifText,
        date: notifDate,
        image: this.pathImage
      },
      { headers: headers }
    );
  }

  public getNotifsDB(userId: any) {
    this.http.get<Notifications[]>(
      `${environment.baseUrl}/notification/notifOneUser/${userId}`,
    ).subscribe((result) => {
      this.topBarNotifications = [];
      localStorage.setItem('topBarNotifications', JSON.stringify(this.topBarNotifications));
      if (result.length) {
        result.forEach(notif => {
          if (notif) {
            this.topBarNotifications
              .push({
                _id: notif._id,
                title_notification: notif.title_notification,
                message_notification: notif.message_notification,
                date_notification: notif.date_notification,
                image_notification: notif.image_notification
              });
          }
        });
        localStorage.setItem('topBarNotifications', JSON.stringify(this.topBarNotifications));
      }
      if (this.dateSignUp && this.userSignUp) {
        this.userSignUp = false;
        this.postNotifDB('Notification.Welcome', 'Notification.Created', this.dateSignUp, userId)
          .subscribe((res: any) => {
            if (res) {
              this.sucess('Signup notif : success');
              this.topBarNotifications.splice(this.topBarNotifications.indexOf(e => e._id === 'noId'), 1);
              this.topBarNotifications.push({
                _id: res._id,
                title_notification: 'Notification.Welcome',
                message_notification: 'Notification.Created',
                date_notification: this.dateSignUp,
                image_notification: 'favicon.ico'
              });
              localStorage.setItem('topBarNotifications', JSON.stringify(this.topBarNotifications));
            }
          });
      }
    });
  }

  public deleteOneNotifDB(notifId: any) {
    this.http.delete<{ message: string }>(
      `${environment.baseUrl}/notification/deleteNotif/${this._userId}/${notifId}`
    ).subscribe((res: any) => {
      if (res && res.message) {
        this.sucess(res.message);
      }
    });
  }

  public deleteAllNotifUser() {
    this.http.delete<{ message: string }>(
      `${environment.baseUrl}/notification/allNotifsDeleted/${this._userId}`
    ).subscribe((res: any) => {
      if (res && res.message) {
        this.sucess(res.message);
      }
    });
  }

  set userId(value) {
    this._userId = value;
  }
}
