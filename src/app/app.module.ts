import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule} from '@angular/http';
import { FormsModule} from '@angular/forms'
import { ReactiveFormsModule} from '@angular/forms'
import { RouterModule, Routes, Router } from '@angular/router';
import { AppComponent } from './app.component';
import { ImageTileComponent } from './image-tile/image-tile.component';
import { ImageListComponent } from './image-list/image-list.component';
import { NavigationComponent } from './navigation/navigation.component';
import { ImageService } from './services/imageService';
import { MultiSelectService } from './services/multiSelectService';
import { AlbumTileComponent } from './album-tile/album-tile.component';
import { AlbumListComponent } from './album-list/album-list.component';
import { AlbumEditComponent } from './album-edit/album-edit.component';
import { ImageBrowserComponent } from './image-browser/image-browser.component';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { UploadService } from "./services/uploadService";

const routes: Routes = [
  {path : '', redirectTo: 'home', pathMatch: 'full'}, 
  {path : 'images', component: ImageBrowserComponent}, 
  {path: 'albums', component: AlbumListComponent},
  {path: 'albums/edit', component: AlbumEditComponent},
  {path: 'upload', component: ImageUploadComponent}  
]

@NgModule({
  declarations: [
    AppComponent,
    ImageTileComponent,
    ImageListComponent,
    NavigationComponent,
    AlbumTileComponent,
    AlbumListComponent,
    AlbumEditComponent,
    ImageBrowserComponent,
    ImageUploadComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, {useHash: true})
  ],
  providers: [
    ImageService,
    MultiSelectService,
    UploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }