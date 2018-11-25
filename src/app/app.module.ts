import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DrawableCanvasComponent } from './drawable-canvas/drawable-canvas.component';
import { CanvasService } from './services/canvas.service';
import { AiService } from './services/ai.service';


@NgModule({
  declarations: [
    AppComponent,
    DrawableCanvasComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    CanvasService,
    AiService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
