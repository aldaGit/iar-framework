import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MenuBar} from './menu-bar';
import {provideRouter} from '@angular/router';

describe('MenuBar', () => {
  let component: MenuBar;
  let fixture: ComponentFixture<MenuBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuBar],
      providers: [provideRouter([])]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MenuBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
