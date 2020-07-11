import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

import { ScullyRoutesService } from '@scullyio/ng-lib';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-posts',
  template: `
    <h2>Posts</h2>

    <mat-list>
      <mat-list-item *ngFor="let post of posts$ | async">
        <h2 mat-line>
          <a routerLink="{{ post.route }}">{{ post.title }}</a>
        </h2>

        <p mat-line>{{ post.publishedDate | date:'longDate' }} - {{ post.readingTime }} min read</p>
      </mat-list-item>
    </mat-list>
  `,
  styles: [
    `
      a {
        color: black;
        white-space: initial;
      }

      :host /deep/ .mat-list-item {
        font-size: 24px;
      }

      @media screen and (max-width: 480px) {
        :host /deep/ .mat-list-item {
          font-size: 16px;
        }
      }
    `,
  ],
})
export class BlogComponent {
  posts$ = this.routesService.available$.pipe(
    map((routes) => routes.filter((route) => route.route.startsWith('/blog/posts'))),
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

  constructor(private routesService: ScullyRoutesService) {}
}

@NgModule({
  declarations: [BlogComponent],
  imports: [CommonModule, MatListModule, RouterModule],
})
export class BlogComponentModule {}
