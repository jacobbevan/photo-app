import { Component, OnInit, OnChanges, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { ImageSummary } from '../model/imageSummary';
import { ImageService } from '../services/imageService';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.css']
})
export class ImageListComponent implements OnInit, OnChanges  {

  private columnCount = 6;
  private rowCount = 0;

  @Input('large') large = false;
  @Input('images') images: ImageSummary[] = [];
  @Input('rowIndexes') rowIndexes: number[] = [];
  @Input('columnIndexes') columnIndexes: number[] = [];
  @Input('colClass') colClass: string;

  constructor() {
  }

  tileExists(row: number, col: number): boolean {
    return row * this.columnCount + col < this.images.length;
  }

  tileSummary(row: number, col: number): ImageSummary {
    return this.images[row * this.columnCount + col];
  }

  public  updateLayout = () => {

    if (this.large) {
      this.columnCount = 2;
      this.colClass = 'col-xs-6';
    } else {
      this.columnCount = 6;
      this.colClass = 'col-xs-2';
    }

    this.rowCount = 1 + (this.images.length - this.images.length % this.columnCount) / this.columnCount;

    this.rowIndexes = Array.apply(null, {length : this.rowCount}).map(Function.call, Number);
    this.columnIndexes = Array.apply(null, {length : this.columnCount}).map(Function.call, Number);
  }

  ngOnInit() {
    this.updateLayout();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateLayout();
  }
}
