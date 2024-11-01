import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockistComponent } from './stockist.component';

describe('StockistComponent', () => {
  let component: StockistComponent;
  let fixture: ComponentFixture<StockistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
