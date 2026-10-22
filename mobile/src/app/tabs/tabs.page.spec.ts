import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TabsPage } from './tabs.page';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsPage],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links every tab button to its routed page', () => {
    const tabs = [...(fixture.nativeElement as HTMLElement).querySelectorAll('ion-tab-button')];
    expect(tabs.map((tab) => tab.getAttribute('href'))).toEqual([
      '/tabs/home', '/tabs/explore', '/tabs/events', '/tabs/map', '/tabs/favorites', '/tabs/trips',
    ]);
  });
});
