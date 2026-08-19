import {Component, inject, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MenuBar} from "./components/menu-bar/menu-bar";
import {AuthService} from "./services/auth-service";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuBar],
  templateUrl: './app.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  isLoggedIn = false;
  protected authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.onLoginStateChange().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    })
  }
}
