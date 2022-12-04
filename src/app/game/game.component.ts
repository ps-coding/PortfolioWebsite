import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent implements OnInit {
  constructor(private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle("Prasham's Portfolio - Game");
    this.metaService.updateTag({
      name: 'description',
      content:
        "This is the click game page of Prasham Shah's portfolio website. On this page you can play his click game. Click the button to you heart's satisfaction. As you click you will be able to see your speed. Click the button to increment your count, and click reset to clear your count and high speed. Your progress and high speed will be saved on device between sessions. You can challenge yourself to see how many times you can click the button within a certain time period or to see how high of a speed you can get. You can also race with your friends to see who can click the button a hundred times the fastest or to see who can get the highest speed.",
    });
  }
}
