import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const auth = getAuth();

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule
  ]
})
export class LoginPage {

  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  // LOGIN
  async login() {
    if (!this.email || !this.password) {
      this.showMessage('Debes ingresar correo y contraseña');
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/create']);
    } catch (error) {
      console.error(error);
      this.showMessage('Credenciales incorrectas');
    }
  }

  // RECUPERAR CONTRASEÑA
  async resetPassword() {
    const alert = await this.alertController.create({
      header: 'Recuperar contraseña',
      message: 'Ingresa tu correo electrónico',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'correo@ejemplo.com'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Enviar',
          handler: async (data) => {
            if (!data.email) {
              this.showMessage('Debes ingresar un correo');
              return false;
            }

            try {
              await sendPasswordResetEmail(auth, data.email);
              this.showMessage(
                'Correo enviado. Revisa tu bandeja de entrada.'
              );
            } catch (error: any) {
              this.showMessage(error.message);
            }

            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  // ALERTA REUTILIZABLE
  async showMessage(message: string) {
    const alert = await this.alertController.create({
      header: 'Información',
      message,
      buttons: ['OK']
    });

    await alert.present();
  }
}