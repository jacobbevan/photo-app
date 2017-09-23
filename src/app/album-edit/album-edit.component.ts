import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ImageService } from "../services/imageService";
import { ActivatedRoute } from "@angular/router";
import { AlbumSummary } from "../model/albumSummary";
import { ImageSummary } from "../model/imageSummary";
import { FilterCriteria } from "../model/filterCriteria";

@Component({
  selector: 'album-edit',
  templateUrl: './album-edit.component.html',
  styleUrls: ['./album-edit.component.css']
})
export class AlbumEditComponent implements OnInit {

  private album : AlbumSummary;
  private images : ImageSummary[];

  albumDetails : FormGroup;
  albumName : FormControl;
  albumDesc : FormControl;

  constructor(private imageService : ImageService, private fb : FormBuilder, private route : ActivatedRoute, private location : Location) { }

  ngOnInit() {
    this.initForm();
    this.route.params.subscribe(p=>{
      if(p["albumId"]){
          this.album = this.imageService.getAlbum(p["albumId"]);
          this.images = this.imageService.getImageList({albumId : this.album.id} );
          console.log("edit album" + this.album.name )
          this.albumName.setValue(this.album.name);
          this.albumDesc.setValue(this.album.description);
        }      
      }
    );
  }

  private initForm() : void {
    this.albumName = new FormControl("",Validators.required);
    this.albumDesc = new FormControl("", Validators.required);
    this.albumDetails = this.fb.group({ 
        "albumName" : this.albumName,
        "albumDesc" : this.albumDesc
      }
      
    );
  }

  onSubmit() : void {
    this.album.name = this.albumName.value;
    this.album.description = this.albumDesc.value;
    this.imageService.saveAlbum(this.album);
    this.location.back();
  }

  onCancel() : void {
    this.location.back();
  }
}
