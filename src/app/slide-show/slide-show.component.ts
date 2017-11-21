import { Component, OnInit } from '@angular/core';
import { ImageService } from '../services/imageService';
import { AlbumSummary } from '../model/albumSummary';
import { ActivatedRoute } from '@angular/router';
import { ImageSummary } from '../model/imageSummary';

@Component({
  selector: 'app-slide-show',
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.css']
})
export class SlideShowComponent implements OnInit {

  private images: ImageSummary[];
  private album: AlbumSummary;

  constructor(private imageService: ImageService, private route: ActivatedRoute) { }

  getFullImageURL(imageSummary: ImageSummary): URL {
    return ImageService.buildRoute(imageSummary.fullImage.toString());
  }

  ngOnInit() {
    this.route.params.subscribe(p => {
      if (p['albumId']) {
          this.imageService.getAlbum(p['albumId']).then(album => {
            this.album = album;
            this.imageService.getImageList({albumId : album.id}).then(res => this.images = res);
            });
        }
      }
    );
  }
}
