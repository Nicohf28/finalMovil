import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular'; // <-- Agregado AlertController
import { Router } from '@angular/router';
import { getDatabase, ref, onValue, remove, DataSnapshot } from 'firebase/database';

const db = getDatabase();

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DetailPage implements OnInit {
  infos: any[] = [];

  constructor(private router: Router, private alertController: AlertController) {}

  ngOnInit() {
    const infosRef = ref(db, 'infos/');
    onValue(infosRef, (snapshot: DataSnapshot) => {
      const data = snapshot.val();
      this.infos = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          this.infos.push({ key, ...data[key] });
        }
      }
    });
  }

  editInfo(id: string) {
    this.router.navigate(['/edit', id]);
  }

  createNew() {
    this.router.navigate(['/create']);
  }

  // --------------------------------------
  // CONFIRMACIÓN Y ELIMINACIÓN
  // --------------------------------------
  async confirmDelete(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que deseas eliminar este elemento?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Sí, eliminar',
          handler: () => {
            this.deleteInfo(id);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteInfo(id: string) {
    const infoRef = ref(db, `infos/${id}`);
    remove(infoRef)
      .then(() => {
        console.log('Elemento eliminado correctamente');
      })
      .catch((error) => {
        console.error('Error al eliminar:', error);
      });
  }
}