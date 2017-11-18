import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { FilterCriteria} from '../model/filterCriteria';
import { MultiSelectService} from '../services/multiSelectService';
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationStart } from '@angular/router';
import { ImageService } from '../services/imageService';
import { AlbumSummary } from '../model/albumSummary';
import { ImageSummary } from '../model/imageSummary';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

  private subAdded: Subscription;
  private subRemoved: Subscription;
  private subRemoveAll: Subscription;
  private large = true;
  private filter: FilterCriteria = new FilterCriteria();

  isCollapsed = true;

  showMultiButtons = false;
  title = 'AZB Photos';
  searchGroup: FormGroup;
  searchText: FormControl;

  multiGroup: FormGroup;
  multiCheck: FormControl;
  multiSelectCount = 0;

  constructor(private router: Router, private multiSelect: MultiSelectService, private imageService: ImageService) {
    router.events.subscribe (event => {
        console.log(event);
        if (event instanceof NavigationStart ) {
          const ns = <NavigationStart> event;
          console.log(ns.url);
          // TODO lookup table
          if (ns.url.startsWith('/images')) {
            this.title = 'AZB Images';
            return;
          }
          if (ns.url.startsWith('/albums')) {
            this.title = 'AZB Albums';
            return;
          }
          if (ns.url.startsWith('/upload')) {
            this.title = 'AZB Image Upload';
            return;
          }
        }
    });
  }

  ngOnInit() {
    this.initialiseSearch();
    this.initialiseMultiSelect();
  }

  ngOnDestroy(): void {
    this.subAdded.unsubscribe();
    this.subRemoved.unsubscribe();
    this.subRemoveAll.unsubscribe();
  }

  toggleSize(large: boolean): void {
    this.large = large;
    this.showImages();
  }

  initialiseSearch(): void {
    this.searchText = new FormControl('');
    this.searchGroup = new FormGroup(
      {
        'searchText' : this.searchText
      }
    );
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  onSearch(): void {
    this.filter = { albumName : this.searchText.value};
    this.showImages();
  }

  showImages(): void {
    this.isCollapsed = true;
    this.router.navigate(['images', {
      large : this.large,
      filter : JSON.stringify(this.filter)
    }]);
  }

  showAlbums(): void {
    this.isCollapsed = true;
    this.router.navigate(['albums']);
  }

  showUpload(): void {
    this.isCollapsed = true;
    this.router.navigate(['upload']);
  }

  createNewAlbum(): void {
    this.imageService.createAlbum(this.multiSelect.Selected).then(a => {
      this.router.navigate(['albums/edit', {
        albumId : a.id
      }]);
    });
  }

  deleteSelected(): void {
    for (const img of this.multiSelect.Selected){
      this.imageService.deleteImage(img.id);
    }
    this.multiSelect.resetSelection();
  }

  initialiseMultiSelect(): void {
    this.multiCheck = new FormControl('');
    this.multiGroup = new FormGroup(
      {
        'multiCheck' : this.multiCheck
      }
    );

    // TODO why does this compile? shouldn't it need a cast?
    this.multiGroup.valueChanges.subscribe(
      value => {
        this.showMultiButtons = value['multiCheck'];
        this.multiSelect.setEnabled(this.showMultiButtons);
        if (!this.showMultiButtons) {
          this.multiSelect.resetSelection();
        }
      }
    );

    this.subAdded = this.multiSelect.Added.subscribe(
      value => this.multiSelectCount = this.multiSelect.Selected.length);

    this.subRemoved = this.multiSelect.Removed.subscribe(
      value => this.multiSelectCount = this.multiSelect.Selected.length);

    this.subRemoveAll = this.multiSelect.RemovedAll.subscribe(
      value => this.multiSelectCount = this.multiSelect.Selected.length);

  }
}
