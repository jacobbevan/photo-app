import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ImageSummary } from '../model/imageSummary';
import { MultiSelectService } from "../services/multiSelectService";
import { Subscription } from "rxjs/Subscription";
import { FormGroup, FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router/router";
import { ImageService } from "../services/imageService";
import { environment } from '../../environments/environment';

@Component({
  selector: 'image-tile',
  templateUrl: './image-tile.component.html',
  styleUrls: ['./image-tile.component.css']
})
export class ImageTileComponent implements OnInit, OnDestroy, OnChanges {

  private subMultiEditModeEnabled : Subscription;
  private subRemoved : Subscription;
  private subRemoveAll : Subscription;
  private multiEditMode : boolean = false;
  private multiCheckState : boolean = false;
  private isMouseOver : boolean = false;
  
  imageClass : any; //TODO fix up typing here
  captionEditMode : boolean = false;  
  
  @Input('readOnly') readOnly : boolean = false;
  @Input('editVis') editVis : string = "hidden";
  @Input('imageSummary') imageSummary : ImageSummary;
  @Input('showCaption') showCaption : boolean = true;
  
  captionGroup : FormGroup;
  private captionInput : FormControl;

  constructor(private imageService : ImageService, private multiSelect : MultiSelectService){
  }
 
  setImageClass() : void
  {
    this.imageClass = {
      "azb-img" : true,
      "azb-img-highlight" : (this.multiEditMode && this.isMouseOver) && !this.readOnly,
      "azb-img-unchecked" : (this.multiEditMode && !this.multiCheckState) && !this.readOnly,
      "azb-img-checked" : (this.multiEditMode && this.multiCheckState) && !this.readOnly
    }
  }

  getThumbnailURL(): URL {
    return ImageService.buildRoute(this.imageSummary.thumbnail.toString());
  }

  getFullImageURL(): URL {
    return ImageService.buildRoute(this.imageSummary.fullImage.toString());
  }

  getEditVis(): string {
    return this.editVis;
  }

  view() : void {
    console.log("view clicked");
  }

  editCaption(el : HTMLElement) : void {
    this.captionEditMode = true;
    el.focus();
  }

  delete() : void {
    this.imageService.deleteImage(this.imageSummary.id);
  }

  imageClick() : void {
    if(this.multiEditMode){
      this.multiCheckState = ! this.multiCheckState;
      if(this.multiCheckState) {
        this.multiSelect.addSelection(this.imageSummary);
      }
      else {
        this.multiSelect.removeSelection(this.imageSummary); 
      }
      this.setImageClass();        
    }      
  }

  mouseOver() : void {
    this.editVis = "visible";
    this.isMouseOver = true;
    this.setImageClass();
  }

  mouseOut() : void {
    this.isMouseOver = false;
    this.editVis = "hidden";

    this.setImageClass();
  }

  ngOnInit() {
    this.initialiseMultiSelect();
    this.initialiseCaptionInput();
    this.setImageClass();    
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.multiCheckState = this.multiSelect.Selected.find(i=>i.id==this.imageSummary.id)!=null;
    if(this.captionInput!=null){
      this.captionInput.setValue(this.imageSummary.caption);
    }
    this.setImageClass();
  }
  
  initialiseCaptionInput() : void {
    this.captionInput  = new FormControl(this.imageSummary.caption);
    this.captionGroup = new FormGroup(
      {
        "caption" : this.captionInput
      }
    )
  }

  cancelCaptionChange() : void {
    this.captionInput.setValue(this.imageSummary.caption);
    this.captionEditMode = false;    
  }

  submitCaptionChange() : void {
    this.imageSummary.caption = this.captionInput.value;
    this.captionEditMode = false;
  }
  
  initialiseMultiSelect() : void {

    this.subMultiEditModeEnabled = this.multiSelect.Enabled.subscribe(value => {
      this.multiEditMode = value;
      this.setImageClass();
    });

    this.subRemoveAll = this.multiSelect.RemovedAll.subscribe(s=> {
      this.multiCheckState = false;
      this.setImageClass();
    });
    
    this.subRemoved  = this.multiSelect.Removed.subscribe(s=> {
      if(s.id == this.imageSummary.id){
        s=>this.multiCheckState =false;
        this.setImageClass();
      }
    });

  }

  ngOnDestroy(): void {
    this.subMultiEditModeEnabled.unsubscribe();
    this.subRemoveAll.unsubscribe();
    this.subRemoved.unsubscribe();
  }
  

}
