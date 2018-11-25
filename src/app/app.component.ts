import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CanvasService } from './services/canvas.service';
import { AiService } from './services/ai.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'tesorApp';

  constructor(
    private _canvasService: CanvasService,
    private _aiService: AiService
  ) {
  }

  ngOnInit() {
  }

  OnReset(event: any) {
    this._canvasService.resetCanvas();
  }

  OnPredict(event: any) {
    this._canvasService.canvasImage();
  }
}
