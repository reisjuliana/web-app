import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { User } from "../models/user.model"


@Injectable({
  providedIn: "root",
})
export class UserService {
  private apiUrl = "/api"

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`)
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user)
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user)
  }

  toggleUserStatus(id: string, active: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}/status`, { sn_ativo: active })
  }

  generateUserId(name: string): string {
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
    const randomNum = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0")
    const combined = (initials + randomNum)
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("")
    return combined.substring(0, 6)
  }
}
