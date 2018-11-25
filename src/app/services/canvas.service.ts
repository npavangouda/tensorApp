import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class CanvasService {

    private resetCanvasSubj = new Subject<boolean>();
    private canvasImageSubj = new Subject();

    resetCanvasObs$ = this.resetCanvasSubj.asObservable();
    canvasImageObs$ = this.canvasImageSubj.asObservable();

    constructor() {}

    public resetCanvas() {
        this.resetCanvasSubj.next(true);
    }

    public canvasImage() {
        this.canvasImageSubj.next();
    }

}
