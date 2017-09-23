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
  private imageClass : string = "azb-img";
  
  @Input('readOnly') readOnly : boolean = false;
  @Input('editVis') editVis : string = "hidden";
  @Input('editMode') editMode : boolean = false;
  @Input('imageSummary') imageSummary : ImageSummary;
  @Input('showCaption') showCaption : boolean = true;

  private multiGroup : FormGroup;
  private multiCheck  : FormControl;
  
  private captionGroup : FormGroup;
  private captionInput : FormControl;

  constructor(private imageService : ImageService, private multiSelect : MultiSelectService){
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
    this.editMode = true;
    this.editVis = "visible";
  }

  mouseOut() : void {
    this.editMode = false;
    this.editVis = "hidden";
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

    this.subMultiEditModeEnabled = this.multiSelect.Enabled.subscribe(value => this.multiEditMode = value);
    this.subRemoveAll = this.multiSelect.RemovedAll.subscribe(s=>this.multiCheck.setValue(false));
    this.subRemoved  = this.multiSelect.Removed.subscribe(s=> {
      if(s.id == this.imageSummary.id){
        s=>this.multiCheck.setValue(false);
      }
    });

    this.subMultiSelect = this.multiGroup.valueChanges.subscribe(
      value => {
        if(value["multiCheck"] == true) {
          console.log("multicheck selected")
          this.multiSelect.addSelection(this.imageSummary);
        }
        else {
          console.log("multicheck unselected")
          this.multiSelect.removeSelection(this.imageSummary);
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
