import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ImageSummary } from '../model/imageSummary';
import { MultiSelectService } from "../services/multiSelectService";
import { Subscription } from "rxjs/Subscription";
import { FormGroup, FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router/router";
import { ImageService } from "../services/imageService";

@Component({
  selector: 'image-tile',
  templateUrl: './image-tile.component.html',
  styleUrls: ['./image-tile.component.css']
})
export class ImageTileComponent implements OnInit, OnDestroy, OnChanges {

  private subMultiEditModeEnabled : Subscription;
  private subMultiSelect : Subscription;
  private subRemoved : Subscription;
  private subRemoveAll : Subscription;
  private multiEditMode : boolean = false;
  private captionEditMode : boolean = false;  
  private imageClass : any;
  private isMouseOver : boolean = false;

  @Input('readOnly') readOnly : boolean = false;
  @Input('editVis') editVis : string = "hidden";
  @Input('imageSummary') imageSummary : ImageSummary;
  @Input('showCaption') showCaption : boolean = true;

  private multiGroup : FormGroup;
  private multiCheck  : FormControl;
  
  private captionGroup : FormGroup;
  private captionInput : FormControl;

  constructor(private imageService : ImageService, private multiSelect : MultiSelectService){
  }
  
  setImageClass(multiSelectMode : boolean, isSelected : boolean, isMouseOver : boolean) : void
  {
    console.log(this.multiCheck.value);
    this.imageClass = {
      "azb-img" : true,
      "azb-img-highlight" : this.multiEditMode && this.isMouseOver,
      "azb-img-unchecked" : this.multiEditMode && !this.multiCheck.value
    }
  } 

  getEditVis() : string {
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

  mouseOver() : void {
    this.editVis = "visible";
    this.isMouseOver = true;
    this.setImageClass(this.multiEditMode, this.multiCheck.value, this.isMouseOver);
  }

  mouseOut() : void {
    this.isMouseOver = false;
    this.editVis = "hidden";

    this.setImageClass(this.multiEditMode, this.multiCheck.value, this.isMouseOver);
  }

  ngOnInit() {
    this.initialiseMultiSelect();
    this.initialiseCaptionInput();    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.multiCheck!=null){
      this.multiCheck.setValue(this.multiSelect.Selected.find(i=>i.id==this.imageSummary.id)!=null);
    }

    if(this.captionInput!=null){
      this.captionInput.setValue(this.imageSummary.caption);
    }
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
    this.multiCheck = new FormControl("");
    this.multiGroup = new FormGroup(
      {
        "multiCheck" : this.multiCheck
      }
    )

    this.subMultiEditModeEnabled = this.multiSelect.Enabled.subscribe(value => {
      this.multiEditMode = value;
      this.setImageClass(this.multiEditMode, this.multiCheck.value, this.isMouseOver);
    });
    this.subRemoveAll = this.multiSelect.RemovedAll.subscribe(s=>this.multiCheck.setValue(false));
    this.subRemoved  = this.multiSelect.Removed.subscribe(s=> {
      if(s.id == this.imageSummary.id){
        s=>this.multiCheck.setValue(false);
      }
    });

    this.subMultiSelect = this.multiGroup.valueChanges.subscribe(
      value => {
        if(value["multiCheck"] == true) {
          this.multiSelect.addSelection(this.imageSummary);
          //this.setImageClass(this.multiEditMode, this.multiCheck.value, this.isMouseOver);
        }
        else {
          this.multiSelect.removeSelection(this.imageSummary);
          //this.setImageClass(this.multiEditMode, this.multiCheck.value, this.isMouseOver);
        }          
      });
  }

  ngOnDestroy(): void {
    this.subMultiEditModeEnabled.unsubscribe();
    this.subMultiSelect.unsubscribe();
    this.subRemoveAll.unsubscribe();
    this.subRemoved.unsubscribe();
  }
  

}
