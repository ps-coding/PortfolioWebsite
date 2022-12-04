import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle("Prasham's Portfolio");
    this.metaService.updateTag({
      name: 'description',
      content:
        "This is Prasham Shah's portfolio website. On this website you can find information about him and his achievements, as well as read his blogs. Prasham Shah consistently updates this website and uses it as his personal portfolio.",
    });
  }

  getAge() {
    const age = moment().diff(moment('31082008', 'DDMMYYYY'), 'years');
    return `${age} years old`;
  }

  getGrade() {
    const year = moment().diff(moment('01092013', 'DDMMYYYY'), 'years');

    if (year <= 12) {
      return `in ${year}th grade`;
    } else {
      return 'no longer in grade school';
    }
  }
}
