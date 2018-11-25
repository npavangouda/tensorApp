import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class AiService {


    constructor() {}

    predict() {
        console.log('predict image');
    }
}
