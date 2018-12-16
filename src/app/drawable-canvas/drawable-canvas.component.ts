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
  // @ViewChild('fileReader') public fileReaderEleRef: ElementRef;

  public width = 300;
  public height = 300;


  canvasEl: HTMLCanvasElement;
  cx: CanvasRenderingContext2D;
  // fileReaderInputEl: HTMLInputElement;
  // fileReader = new FileReader();
  // imgEl = new Image();

  private canvasResetSub;
  private canvasImageSub;

  constructor(
    private _canvasService: CanvasService,
    private _aiService: AiService,
  ) { }

  ngOnInit() {
    this.canvasEl = this.aiCanvas.nativeElement;
    // this.fileReaderInputEl = this.fileReaderEleRef.nativeElement;
    this.cx = this.canvasEl.getContext('2d');

    this.canvasEl.width = this.width;
    this.canvasEl.height = this.height;


    this.captureEvents(this.canvasEl);
    this.captureTouchEvents(this.canvasEl);

    this.canvasResetSub =  this._canvasService.resetCanvasObs$.subscribe((input: any) => {
      this.cx.clearRect(0, 0, this.cx.canvas.width, this.cx.canvas.height);
    });

    this.canvasImageSub = this._canvasService.canvasImageObs$.subscribe(() => {
      // this.grayscale();
      //
      const scaled = this.cx.drawImage(this.canvasEl, 0, 0, 28, 28);
      const imgData = this.cx.getImageData(0, 0, 28, 28);
      this.grayscale();
      this._aiService.predict(imgData);
    });
  }

  ngOnDestroy() {
    this.canvasResetSub.unsubscribe();
    this.canvasImageSub.unsubscribe();
  }

  // fileChanged(event: any) {
  //   console.log('filechanged');
  //   const fileBlob = this.fileReaderInputEl.files[0];
  //   if (fileBlob.type.match('image.*')) {
  //     this.fileReader.readAsDataURL(fileBlob);
  //     this.fileReader.onload = () => {
  //       this.imgEl.src = this.fileReader.result;
  //       this.imgEl.onload = () => {
  //         this.cx.drawImage(this.imgEl, 0, 0);
  //       };
  //     };
  //   }

  // }

  private download() {
    const link = document.createElement('a');
    link.addEventListener('click', (eve) => {
      const imageData = this.cx.getImageData(0, 0, 28, 28);
      this.cx.putImageData(imageData, 0, 0);
      link.href = this.canvasEl.toDataURL();
      link.download = 'myPainting.png';
    });
    link.click();
  }

  private grayscale() {
      const imageData = this.cx.getImageData(0, 0, 28, 28);
      const dataInfo = imageData.data;
      for (let i = 0; i < dataInfo.length; i += 4) {
        const avg = (dataInfo[i] + dataInfo[i + 1] + dataInfo[i + 2]) / 3;
        dataInfo[i]     = avg; // red
        dataInfo[i + 1] = avg; // green
        dataInfo[i + 2] = avg; // blue
      }
      this.cx.putImageData(imageData, 0, 0);
  }

  private captureTouchEvents(canvasEl: HTMLCanvasElement) {
    fromEvent(canvasEl, 'touchstart')
    .pipe(
      switchMap((e) => {
        return fromEvent(canvasEl, 'touchmove')
        .pipe(
          takeUntil(fromEvent(canvasEl, 'touchend')),
          pairwise()
        );
      })
    )
    .subscribe((res: [TouchEvent, TouchEvent]) => {
      const rect = this.canvasEl.getBoundingClientRect();
      // previous and current position with the offset
      const prevPos = {
        x: res[0].changedTouches[0].clientX - rect.left,
        y: res[0].changedTouches[0].clientY - rect.top
      };

      const currentPos = {
        x: res[1].changedTouches[0].clientX - rect.left,
        y: res[1].changedTouches[0].clientY - rect.top
      };

      // this method we'll implement soon to do the actual drawing
      this.drawOnCanvas(prevPos, currentPos);
    });
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
    this.cx.strokeStyle = '#ef6c00';

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }
}
