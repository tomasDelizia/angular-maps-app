import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { routes } from '../../../app.routes';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent {
  router = inject(Router);

  routes = routes
    .filter((route) => route.path !== '**')
    .map((route) => ({
      path: route.path,
      title: `${route.title ?? 'Angular Maps'}`,
    }));

  // Observable that emits the current page title
  pageTitle$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event) => event.url),
    map(
      (url) =>
        routes.find((route) => `/${route.path}` === url)?.title ??
        'Angular Maps'
    )
  );

  pageTitle = toSignal(this.pageTitle$);
}
