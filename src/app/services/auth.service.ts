import { Injectable } from '@angular/core';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserRole } from '../models/user-role';
import { BehaviorSubject, Observable } from 'rxjs';

const USERS_COLLECTION = 'users';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentRole$ = new BehaviorSubject<UserRole | null>(null);
  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor() {
    onAuthStateChanged(auth, async (user) => {
      this.currentUser$.next(user);
      if (user) {
        try {
          const role = await this.getUserRole(user.uid);
          this.currentRole$.next(role);
        } catch {
          this.currentRole$.next(null);
        }
      } else {
        this.currentRole$.next(null);
      }
    });
  }

  get user$(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  get role$(): Observable<UserRole | null> {
    return this.currentRole$.asObservable();
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  register(email: string, password: string, role: UserRole) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async saveUserProfile(uid: string, email: string, role: UserRole): Promise<void> {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(userRef, { email, role });
  }

  async getUserRole(uid: string): Promise<UserRole | null> {
    try {
      const userRef = doc(db, USERS_COLLECTION, uid);
      const snap = await getDoc(userRef);
      const data = snap.data();
      const role = data?.['role'];
      if (role === 'local' || role === 'repartidor') {
        return role as UserRole;
      }
      return null;
    } catch {
      return null;
    }
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }

  getCurrentRole(): UserRole | null {
    return this.currentRole$.getValue();
  }

  logout() {
    return signOut(auth);
  }
}
