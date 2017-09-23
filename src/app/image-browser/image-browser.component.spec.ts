import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageBrowserComponent } from './image-browser.component';

describe('ImageBrowserComponent', () => {
  let component: ImageBrowserComponent;
  let fixture: ComponentFixture<ImageBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
