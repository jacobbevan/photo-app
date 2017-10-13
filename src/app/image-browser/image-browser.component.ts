import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ImageService } from "../services/imageService";
import { FilterCriteria } from "../model/filterCriteria";
import { ImageSummary } from "../model/imageSummary";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'image-browser',
  templateUrl: './image-browser.component.html',
  styleUrls: ['./image-browser.component.css']
})
export class ImageBrowserComponent implements OnInit {

  private filter : FilterCriteria = new FilterCriteria();
  private addedSub : Subscription;
  private deletedSub : Subscription;

  @Input("images") public images : ImageSummary[]; 
  @Input("images") public large : boolean = false;

  constructor(private route: ActivatedRoute, private imageService : ImageService) {
    this.imageService = imageService;
    this.route.params.subscribe(params => {
 
      //this multiple parsing is gross. combine into on object?
      if(params["large"]){
          this.large =JSON.parse(params["large"]);
      }
      if(params["filter"]){
        this.filter = JSON.parse(params["filter"]) as FilterCriteria;
      }
      this.updateImageList();
    });
  }

  public updateImageList = () => {
    this.imageService.getImageList(this.filter).then(res=>this.images = res);     
  }

  ngOnInit() {
    this.updateImageList();

    this.addedSub = this.imageService.ImageAdded.subscribe(x=> this.updateImageList())
    this.deletedSub = this.imageService.ImageDeleted.subscribe(x=> this.updateImageList())
  }

  ngOnDestroy(): void {
    this.addedSub.unsubscribe();
    this.deletedSub.unsubscribe();
  }
  
}
