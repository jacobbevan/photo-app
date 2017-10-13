import {ImageService} from './imageService';
import {ImageSummary} from '../model/imageSummary';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

export class MultiSelectService
{
    Selected : ImageSummary[] = [];
    Enabled : BehaviorSubject<boolean> = new BehaviorSubject(false);
    Added : Subject<ImageSummary> = new Subject<ImageSummary>();
    Removed : Subject<ImageSummary> = new Subject<ImageSummary>();
    RemovedAll : Subject<any> = new Subject<any>();

    setEnabled(enabled : boolean) {
        this.Enabled.next(enabled);
    }
    
    addSelection(item : ImageSummary) : void {
        this.Selected.push(item);
        this.Added.next(item);
    }

    removeSelection(item : ImageSummary) : void {
        this.Selected = this.Selected.filter(s=>s.id != item.id);
        this.Removed.next(item);
    }

    resetSelection() : void {
        this.Selected = [];
        this.RemovedAll.next(new Object());
    }
}