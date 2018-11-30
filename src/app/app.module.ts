import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ChartsModule } from 'ng2-charts/ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DrawableCanvasComponent } from './drawable-canvas/drawable-canvas.component';
import { CanvasService } from './services/canvas.service';
import { AiService } from './services/ai.service';
import { ChartComponent } from './chart/chart.component';


@NgModule({
  declarations: [
    AppComponent,
    DrawableCanvasComponent,
    ChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
  ],
  providers: [
    CanvasService,
    AiService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
