import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HRUser } from '../_models/user';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection!: HubConnection;
  private onlineUsersSource = new BehaviorSubject<string[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  constructor(private toastr: ToastrService, private router: Router) { }

  createHubConnection(user: HRUser) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'presence', {
        accessTokenFactory: () => user.userToken
      })
      .withAutomaticReconnect()
      .build()

    //starting the hub
    this.hubConnection
        .start()
        .catch(error => console.log(error))

    this.hubConnection.on('UserIsOnline', username => {
      // this.toastr.info(username + ' has connected');
    })

    this.hubConnection.on('UserIsOffline', username => {
      // this.toastr.warning(username + ' disconnected')
    })

    this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
      this.onlineUsersSource.next(usernames)
    })

    this.hubConnection.on('NewMessageRecieved', ({username}) => {
      this.toastr.info(username + ' has sent you a new message!')
        .onTap
        .pipe(take(1))
        .subscribe(() => this.router.navigateByUrl('/dashboard/hrmember/' + username + '?tab=1'));
    })
  }

  stopHubConnection() {
    this.hubConnection.stop().catch(error => console.log(error));
  }
}
