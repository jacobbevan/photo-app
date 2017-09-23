import { Component, OnInit, Input } from '@angular/core';
import { ImageService } from "../services/imageService";
import { AlbumSummary } from "../model/albumSummary";
import { ImageSummary } from "../model/imageSummary";
import { FilterCriteria } from "../model/filterCriteria";
import { Router } from "@angular/router";

@Component({
  selector: 'album-tile',
  templateUrl: './album-tile.component.html',
  styleUrls: ['./album-tile.component.css']
})
export class AlbumTileComponent implements OnInit {

  @Input("album") private album : AlbumSummary;
  private images : ImageSummary[];

  imageCount() : number
  {
    return this.images.length;
  }
  
  constructor(private router : Router, private imageService : ImageService) { }

  ngOnInit() {
    this.images = this.imageService.getImageList({albumName : this.album.name});
    console.log(this.images);
  }

  tileSummary(index : number) : ImageSummary {
    return this.images[index % this.images.length];
  }

  editAlbum() : void {
    console.log(this.album);
    this.router.navigate(["albums/edit", {
      albumId : this.album.id 
    }]);
  }

  viewAlbum() : void {
    console.log("not yet implemented");
  }

  deleteAlbum() : void {
    this.imageService.deleteAlbum(this.album.id);
  }

}
