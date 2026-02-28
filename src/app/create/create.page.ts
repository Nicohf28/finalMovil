import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { getDatabase, ref, set } from "firebase/database";
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

const db = getDatabase();

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class CreatePage {
  infoForm = this.formBuilder.group({
    info_title: [null, Validators.required],
    info_description: [null, Validators.required]
  });

  constructor(private router: Router, private formBuilder: FormBuilder) { }

  saveInfo() {
    const id = uuidv4();
    set(ref(db, 'infos/' + id), this.infoForm.value).then(() => {
      // Navega a DetailPage con el id
      this.router.navigate(['/detail', id]);
    });
  }
}