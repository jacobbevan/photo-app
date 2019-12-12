import { Component, OnInit, Input } from '@angular/core';
import { ImageService } from '../services/imageService';
import { AlbumSummary } from '../model/albumSummary';
import { ImageSummary } from '../model/imageSummary';
import { Router } from '@angular/router';

@Component({
  selector: 'album-tile',
  templateUrl: './album-tile.component.html',
  styleUrls: ['./album-tile.component.css']
})
export class AlbumTileComponent implements OnInit {

  @Input('album') album: AlbumSummary;
  private images: ImageSummary[];

  imageCount(): number {
    return this.images.length;
  }

  constructor(private router: Router, private imageService: ImageService) { }

  ngOnInit() {
    this.imageService.getImageList({albumId : this.album.id}).then(res => {
      this.images = res.records;
    });
  }

  tileSummary(index: number): ImageSummary {
    return this.images[index % this.images.length];
  }

  editAlbum(): void {
    console.log(this.album);
    this.router.navigate(['albums/edit', {
      albumId : this.album.id
    }]);
  }

  viewAlbum(): void {
    this.router.navigate(['albums/show', {
      albumId : this.album.id
    }]);
  }

  deleteAlbum(): void {
    this.imageService.deleteAlbum(this.album.id);
  }

}
