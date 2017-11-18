import {ImageSummary} from '../model/imageSummary';
import {AlbumSummary} from '../model/albumSummary';
import {FilterCriteria} from '../model/filterCriteria';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import { Headers, Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';

@Injectable()
export class ImageService {

    ImageAdded: Subject<ImageSummary> = new Subject<ImageSummary>();
    ImageDeleted: Subject<string> = new Subject<string>();
    ImageUpdated: Subject<ImageSummary> = new Subject<ImageSummary>();

    AlbumAdded: Subject<AlbumSummary> = new Subject<AlbumSummary>();
    AlbumDeleted: Subject<string> = new Subject<string>();
    AlbumUpdated: Subject<AlbumSummary> = new Subject<AlbumSummary>();

    constructor(private http: Http) {
    }

    public static buildRoute(suffix: string): URL {

        if (environment.API_ROOT == null) {
            return new URL(suffix, window.location.origin);
        } else {
            return new URL(suffix, environment.API_ROOT);
        }
    }

    deleteImage(id: string):  Promise<void> {
        // TODO error handling
        return this.http.delete(ImageService.buildRoute('api/images/' + id).href).toPromise().then(res => {
            this.ImageDeleted.next(id);
        });
    }

    deleteAlbum(id: string): Promise<void> {
        // TODO error handling
        // TODO utility function to create rest routes
        return this.http.delete(ImageService.buildRoute('api/albums/' + id).href).toPromise().then(x => {
            this.AlbumDeleted.next(id);
        });
    }

    updateAlbum(album: AlbumSummary): Promise<void> {
        return this.http.put(ImageService.buildRoute('api/albums/' + album.id).href, album).toPromise().then(
            (res) => {
                this.AlbumUpdated.next(album);
            },
            (err) => {
                console.log('error');
                // TODO error handling
            });
    }

    updateImage(image: ImageSummary): Promise<void> {
        return this.http.put(ImageService.buildRoute('api/images/' + image.id).href, image).toPromise().then(
            (res) => {
                this.ImageUpdated.next(image);
            },
            (err) => {
                console.log('error');
                // TODO error handling
            });
    }

    createAlbum(images: ImageSummary[]): Promise<AlbumSummary> {
        const album: AlbumSummary = {
            id : 'placeholder',
            imageIds : images.map(i => i.id),
            description : '',
            name : 'New Album',
            created : new Date(Date.now()),
            updated : new Date(Date.now())
        };

        return this.http.post(ImageService.buildRoute('api/albums').href, album).toPromise().then(
            (res) => {
                const results: AlbumSummary = JSON.parse(res.text());
                this.AlbumAdded.next(results);
                return results;
            });
    }

    getAlbum(id: string): Promise<AlbumSummary> {
        const promise = new Promise<AlbumSummary>((resolve, reject) => {
            this.http
                .get(ImageService.buildRoute('api/albums/' + id).href)
                .toPromise()
                .then(res => {
                    console.log(res.json());
                    const results: AlbumSummary = JSON.parse(res.text());
                    resolve(results);
                });
        });

        return promise;
    }

    getAlbumList(filter: FilterCriteria): Promise<AlbumSummary[]> {
        const promise = new Promise<AlbumSummary[]>((resolve, reject) => {
            this.http
                .get(ImageService.buildRoute('api/albums/').href)
                .toPromise()
                .then(res => {
                    console.log(res.json());
                    const results: AlbumSummary[] = JSON.parse(res.text());
                    resolve(results);
                });
        });

        return promise;
    }

    getImageList(filter: FilterCriteria): Promise<ImageSummary[]> {

        const promise = new Promise<ImageSummary[]>((resolve, reject) => {
            this.http
                .get(
                    // TODO got to be a better way of doing this...
                    filter.albumId == null ?
                    ImageService.buildRoute('api/images/').href
                    :
                    ImageService.buildRoute('api/images/').href + '?albumId=' + filter.albumId
                    )
                .toPromise()
                .then(res => {
                    console.log(res.json());
                    const results: ImageSummary[] = JSON.parse(res.text());
                    resolve(results);
                });
        });

        return promise;
    }
}
