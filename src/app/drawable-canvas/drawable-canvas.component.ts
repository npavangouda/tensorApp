import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, pairwise } from 'rxjs/operators';
import { CanvasService } from '../services/canvas.service';
import { AiService } from '../services/ai.service';

@Component({
  selector: 'app-drawable-canvas',
  templateUrl: './drawable-canvas.component.html',
  styleUrls: ['./drawable-canvas.component.scss']
})
export class DrawableCanvasComponent implements OnInit, OnDestroy {

  @ViewChild('aiCanvas') public aiCanvas: ElementRef;
  public width = 500;
  public height = 400;


  canvasEl: HTMLCanvasElement;
  cx: CanvasRenderingContext2D;

  private canvasResetSub;
  private canvasImageSub;

  constructor(
    private _canvasService: CanvasService,
    private _aiService: AiService,
  ) { }

  ngOnInit() {
    this.canvasEl = this.aiCanvas.nativeElement;
    this.cx = this.canvasEl.getContext('2d');

    this.canvasEl.width = this.width;
    this.canvasEl.height = this.height;


    this.captureEvents(this.canvasEl);

    this.canvasResetSub =  this._canvasService.resetCanvasObs$.subscribe((input: any) => {
      this.cx.clearRect(0, 0, this.cx.canvas.width, this.cx.canvas.height);
    });

    this.canvasImageSub = this._canvasService.canvasImageObs$.subscribe(() => {
      this._aiService.predict();
    });
  }

  ngOnDestroy() {
    this.canvasResetSub.unsubscribe();
    this.canvasImageSub.unsubscribe();
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point
              pairwise()
            );
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = this.canvasEl.getBoundingClientRect();
        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) { return; }

    this.cx.beginPath();

    this.cx.lineWidth = 10;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#111111';

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }
}
