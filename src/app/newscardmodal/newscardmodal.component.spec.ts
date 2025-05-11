import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewscardmodalComponent } from './newscardmodal.component';

describe('NewscardmodalComponent', () => {
  let component: NewscardmodalComponent;
  let fixture: ComponentFixture<NewscardmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewscardmodalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewscardmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
