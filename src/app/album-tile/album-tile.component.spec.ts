import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumTileComponent } from './album-tile.component';

describe('AlbumTileComponent', () => {
  let component: AlbumTileComponent;
  let fixture: ComponentFixture<AlbumTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
