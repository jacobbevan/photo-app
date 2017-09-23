import {ImageSummary} from "../model/imageSummary";
import {AlbumSummary} from "../model/albumSummary";
import {FilterCriteria} from "../model/filterCriteria"
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

export class ImageService
{
    private images : ImageSummary[];
    private albums : AlbumSummary[];

    ImageAdded : Subject<ImageSummary> = new Subject<ImageSummary>();
    ImageDeleted : Subject<ImageSummary> = new Subject<ImageSummary>();
    ImageUpdated  : Subject<ImageSummary> = new Subject<ImageSummary>();

    AlbumAdded : Subject<AlbumSummary> = new Subject<AlbumSummary>();
    AlbumDeleted : Subject<AlbumSummary> = new Subject<AlbumSummary>();
    AlbumUpdated  : Subject<AlbumSummary> = new Subject<AlbumSummary>();

    constructor() {
        
        this.images = [
            new ImageSummary("k1", "Ramsay Eating"),
            new ImageSummary("k2","Ramsay Crying"),
            new ImageSummary("k3","Ramsay Pulling Angela's Nose"),
            new ImageSummary("k4","Ramsay Splashing"),
            new ImageSummary("k5","Sardines"), 
            new ImageSummary("k6","We jump in the lake"),
            new ImageSummary("k7","Getting the metro"),
            new ImageSummary("k8","Another"),
            new ImageSummary("k9","Big glass of Port"),
            new ImageSummary("k10","c"),
            new ImageSummary("k11","d"),
            new ImageSummary("k12","e"), 
            new ImageSummary("k13","f"),
            new ImageSummary("k14","g"),
            new ImageSummary("k15","a"),
            new ImageSummary("k16","b"),
            new ImageSummary("k17","c"),
            new ImageSummary("k18","d"),
            new ImageSummary("k19","e"), 
            new ImageSummary("k20","f"),
            new ImageSummary("k21","h"),
          ];    

        this.albums = [
            new AlbumSummary("k1", "Porto", "Pictures of Ziggy's birthday trip to Porto", ["k5","k7","k9"]),
            new AlbumSummary("k2","For Nonna", "Pictures that Aurora will like", ["k2", "k3", "k4"]),
            new AlbumSummary("k3","Ramsay", "Young Master", ["k1", "k2", "k3", "k4", "k8"])
        ];
 
    }

    deleteImage(id : string) : void
    {
        let image = this.images.find(s=>s.id === id);
        this.images = this.images.filter(s=>s.id != id);
        for(let album of this.albums) {
            let count = album.imageIds.length;
            album.imageIds = album.imageIds.filter(s=>s != id);
            if(album.imageIds.length != count) {
                this.AlbumUpdated.next(album);
            }
        }
            
        this.ImageDeleted.next(image)
    }

    deleteAlbum(id : string) : void
    {
        let album = this.albums.find(s=>s.id === id);
        this.albums = this.albums.filter(s=>s.id != id);
        console.log("doing the on nexxt thing");
        this.AlbumDeleted.next(album);
    }

    saveAlbum(album : AlbumSummary) : void 
    {

        this.AlbumUpdated.next(album);
    }

    createAlbum(images : ImageSummary[]) : AlbumSummary{
        var album = new AlbumSummary("k8", "New Album", "", images.map(i=>i.id));
        this.albums.push(album);
        return album;
    }

    getAlbum(id : string) : AlbumSummary
    {
        return this.albums.find(x=>x.id==id);
    }

    getImage(id : string) : ImageSummary
    {
        return this.images.find(x=>x.id==id);
    }

    getAlbumList(filter : FilterCriteria) : AlbumSummary[]
    {
        return this.albums;
    }

    getImageList(filter : FilterCriteria) : ImageSummary[]
    {


        if(filter.albumName != null){
            var album = this.albums.find(a=>a.name.toLowerCase() == filter.albumName.toLowerCase())

            let ret : ImageSummary[] = [];
            for(let id of album.imageIds) {
                var imgSum = this.images.find(i=>i.id == id);
                ret.push(imgSum);
            }
            return ret;
        }        

        if(filter.albumId != null){
            console.log("search for images by album id");
            var album = this.albums.find(a=>a.id == filter.albumId)

            let ret : ImageSummary[] = [];
            for(let id of album.imageIds) {
                var imgSum = this.images.find(i=>i.id == id);
                ret.push(imgSum);
            }
            return ret;
        }        
        return this.images;
    }
}