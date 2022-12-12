import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { RouterModule, Routes } from '@angular/router'
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { AppComponent } from './app.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AppRoutingModule } from './app-routing.module';
import { GameComponent } from './components/game/game.component';
import { LoginComponent } from './components/login/login.component';
import { ChatComponent } from './components/chat/chat.component';
import { ColordialogComponent } from './dialogs/colordialog/colordialog.component';

const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'register', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/:user', component: ProfileComponent },
  { path: 'game', component: GameComponent },
  { path: 'game/:code', component: GameComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    ProfileComponent,
    GameComponent,
    LoginComponent,
    ChatComponent,
    ColordialogComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    FormsModule,
    SocketIoModule.forRoot(config),
    AppRoutingModule,
    MatDialogModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ColordialogComponent],
})
export class AppModule { }
