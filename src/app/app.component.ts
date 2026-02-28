import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBOkSzuCTyy0ZmFuHZADTRCZwngGQHnRx4",
  authDomain: "crud-a0659.firebaseapp.com",
  databaseURL: "https://crud-a0659-default-rtdb.firebaseio.com",
  projectId: "crud-a0659",
  storageBucket: "crud-a0659.firebasestorage.app",
  messagingSenderId: "962367746252",
  appId: "1:962367746252:web:01a84bcd895d12ace65269"
};

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})

export class AppComponent {
  constructor() {
    initializeApp(firebaseConfig);
  }
}
