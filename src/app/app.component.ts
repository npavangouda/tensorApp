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
  predictions: any;

  constructor(
    private _canvasService: CanvasService,
    private _aiService: AiService
  ) {
  }

  ngOnInit() {
    this._aiService.loadModel();
  }

  OnReset(event: any) {
    this._canvasService.resetCanvas();
    this.predictions = null;
  }

  OnPredict(event: any) {
    this._canvasService.canvasImage();
    this.predictions = this._aiService.predictions;
  }
}
