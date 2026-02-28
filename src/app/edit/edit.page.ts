import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const db = getDatabase();

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule]
})
export class EditPage implements OnInit {
  id: string | null = null;
  infoForm = this.fb.group({
    info_title: [null, Validators.required],
    info_description: [null, Validators.required]
  });

  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      const infoRef = ref(db, 'infos/' + this.id);
      onValue(infoRef, (snapshot) => {
        const data = snapshot.val();
        this.infoForm.patchValue(data);
      });
    }
  }

  updateInfo() {
    if (!this.id) return;
    set(ref(db, 'infos/' + this.id), this.infoForm.value).then(() => {
      this.router.navigate(['/detail', this.id]);
    });
  }
}