import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css'],
})
export class PageNotFoundComponent implements OnInit {
  nonexistentRoute: string;

  constructor(
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.nonexistentRoute = router.url.normalize();
  }

  ngOnInit(): void {
    this.titleService.setTitle("Prasham's Portfolio - Page Not Found");
    this.metaService.updateTag({
      name: 'description',
      content:
        "The page specified could not be found on Prasham Shah's portfolio website.",
    });
  }
}
