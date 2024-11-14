import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { TableComponent } from '../../../shared/table/table.component';

@Component({
  selector: 'app-by-channel',
  standalone: true,
  imports: [ReactiveFormsModule, TableComponent],
  template: `
    <h1>Customer Feedback By Channel</h1>
    <div class="form-container">
      <form class="form" [formGroup]="channelForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label class="label" for="channel">Channel</label>
          <select class="select" formControlName="channel" id="channel" name="channel">
            @for (channel of channels; track channel) {
              <option value="{{ channel }}">{{ channel }}</option>
            }
          </select>
        </div>
        <div class="form__actions">
          <button class="button button--primary" type="submit">Submit</button>
        </div>
      </form>

      @if (customerFeedbackData.length > 0) {
        <app-table
            [title]="'Customer Feedback By Channel'"
            [data]="customerFeedbackData"
            [headers]="['Date', 'Region', 'Product', 'Category', 'Channel', 'Salesperson',
              'Customer', 'Rating', 'Agent Name', 'Feedback Type', 'Feedback Text']"
            [sortableColumns]="['Date', 'Region', 'Product', 'Category', 'Salesperson',
              'Customer', 'Rating', 'Agent Name', 'Feedback Type']"
            [headerBackground]="'primary'"
            >
          </app-table>
      }
  `,
  styles: `
   .form-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .form {
      width: 50%;
      margin: 20px 0;
    }`
})
export class ByChannelComponent {
  customerFeedbackData: any = [];
  channels: string[] = [ 'Online', 'Retail' ];

  channelForm = this.fb.group({
    channel: [null, Validators.compose([Validators.required])]
  })

  constructor(private http: HttpClient, private fb: FormBuilder) {

  }

  onSubmit() {
    const channel = this.channelForm.controls['channel'].value;

    this.http.get(`${environment.apiBaseUrl}/reports/customer-feedback/by-channel?channel=${channel}`).subscribe({
      next: (data: any) => {
        this.customerFeedbackData = data;

        // Set up table
        for (let data of this.customerFeedbackData) {
          data['Date'] = new Date(data['date']).toLocaleDateString(); // Format date
          data['Region'] = data['region'];
          data['Product'] = data['product'];
          data['Category'] = data['category'];
          data['Channel'] = data['channel'];
          data['Salesperson'] = data['salesperson'];
          data['Customer'] = data['customer'];
          data['Rating'] = data['rating'];
          data['Agent Name'] = data['agentDetails'].name;
          data['Feedback Type'] = data['feedbackType'];
          data['Feedback Text'] = data['feedbackText'];
        }
      },
      error: (err) => {
        console.error('Error fetching customer feedback data by channel:', err);
      }
    });
  }
}
