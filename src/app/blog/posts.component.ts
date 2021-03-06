import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentRouterModule } from '@angular-component/router';
import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-posts',
  template: `
    <div class="grid grid-rows-3 gap-4 py-8 max-w-2xl text-2xl">
      <div
        *ngFor="let post of posts$ | async"
        class="flex flex-col h-full overflow-x-auto"
      >
        <a linkTo="{{ post.route }}" class="text-gray-600">{{ post.title }}</a>

        <p class="text-sm">
          {{ post.publishedDate | date: 'longDate' }}
        </p>
      </div>
    </div>
  `,
})
export class PostsComponent {
  posts$ = this.routesService.available$.pipe(
    map((routes) => routes.filter((route) => this.isPost(route))),
    map((filteredRoutes) =>
      filteredRoutes
        .slice()
        .sort((a, b) =>
          new Date(a.publishedDate).getTime() >
          new Date(b.publishedDate).getTime()
            ? -1
            : 0
        )
    )
  );

  isPost(route: ScullyRoute) {
    return (
      route.route.startsWith('/blog/posts') &&
      !route.route.includes('angular-unfiltered')
    );
  }

  constructor(private routesService: ScullyRoutesService) {}
}

@NgModule({
  declarations: [PostsComponent],
  exports: [PostsComponent],
  imports: [CommonModule, ComponentRouterModule],
})
export class PostsComponentModule {}
