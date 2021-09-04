import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DragAndDropRoutingModule } from './drag-and-drop-routing.module';
import { DragAndDropComponent } from './drag-and-drop/drag-and-drop.component';

@NgModule({
  declarations: [DragAndDropComponent],
  imports: [CommonModule, DragAndDropRoutingModule],
  exports: [DragAndDropComponent],
})
export class DragAndDropModule {}
