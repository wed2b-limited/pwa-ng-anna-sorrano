import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgClass, NgIf } from "@angular/common";
import { SharedService } from "./shared.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, NgClass,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'pwa-ng-heidi-hudson';
  @ViewChild('headerNav')
  navElement!: ElementRef;
  private lastScrollTop = 0;
  isMobile: boolean = false;
  showMenu: boolean = false

  constructor(private router: Router, private sharedService: SharedService) {}
  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showMenu = false
      }
    });
    this.isMobile = this.sharedService.checkScreenSize();
    window.addEventListener('load', () => this.setupScrollEvent());
  }
  ngAfterViewInit(): void {
  }

  private setupScrollEvent(): void {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.toggleHeaderClass();
          ticking = false;
        });

        ticking = true;
      }
    });
  }
  private toggleHeaderClass(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (scrollTop > this.lastScrollTop) {
      // When scrolling down
      this.navElement.nativeElement.classList.add('nav-up');
    } else {
      // When scrolling up
      this.navElement.nativeElement.classList.remove('nav-up');
    }
    this.lastScrollTop = scrollTop > 0 ? scrollTop : 0;
    if (this.lastScrollTop == 0) {
      this.navElement.nativeElement.classList.remove('navbar-top');
    } else {
      this.navElement.nativeElement.classList.add('navbar-top');
    }
  }

  toggleMenu() {
    this.showMenu = ! this.showMenu;
  }
}
