import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as tf from '@tensorflow/tfjs';

@Injectable()
export class AiService {

    digitModel;
    predictions;

    constructor() { }

    async loadModel() {
        this.digitModel = await tf.loadModel('./../../assets/model/model.json');
    }

    async predict(imgData: ImageData) {
        const predTf = await tf.tidy(() => {
            let img = tf.fromPixels(imgData, 1);
            img = img.reshape([1, 28, 28]);
            img = tf.cast(img, 'float32');

            // Make and format the predications
            const output = this.digitModel.predict(img) as any;

            // Save predictions on the component
            this.predictions = Array.from(output.dataSync());
        });
    }
}
