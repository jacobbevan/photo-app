import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AlbumSummary } from "../model/albumSummary";
import { ImageService } from "../services/imageService";
import { FilterCriteria } from "../model/filterCriteria";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'album-list',
  templateUrl: './album-list.component.html',
  styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit, OnDestroy {

  @Input("albums") albums : AlbumSummary[] = []

  private addedSub : Subscription;
  private deletedSub : Subscription;
  private updatedSub : Subscription;
  
  public updateAlbumList = () =>
  {
    this.albums = this.imageService.getAlbumList(new FilterCriteria())
  }
  
  constructor(private route: ActivatedRoute, private imageService : ImageService) {
  }

  ngOnInit() {
    this.updateAlbumList();
    this.deletedSub = this.imageService.AlbumDeleted.subscribe(a=>this.albums = this.albums.filter(b=> b.id != a.id));    
    this.addedSub = this.imageService.AlbumAdded.subscribe(a=>this.updateAlbumList());
    this.updatedSub = this.imageService.AlbumUpdated.subscribe(a=>this.updateAlbumList());
  }

  ngOnDestroy(): void {
    this.addedSub.unsubscribe();
    this.deletedSub.unsubscribe();
    this.updatedSub.unsubscribe(); 
  }

}
