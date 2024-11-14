import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByChannelComponent } from './by-channel.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ByChannelComponent', () => {
  let component: ByChannelComponent;
  let fixture: ComponentFixture<ByChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ByChannelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Customer Feedback By Channel"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Customer Feedback By Channel');
  });

  it('should initialize the channelForm with a null value', () => {
    const channelControl = component.channelForm.controls['channel'];
    expect(channelControl.value).toBeNull();
    expect(channelControl.valid).toBeFalse();
  });

  it('should populate select with list of channels', () => {
    const compiled = fixture.nativeElement;
    const selectElement = compiled.querySelector('select');

    // The number of options in the select should be equal to the number of channels in the channels array
    expect(selectElement.options.length).toEqual(component.channels.length);
  });
});
