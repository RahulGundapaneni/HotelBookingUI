import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { BookingApiService } from './booking-api.service';
import type { HotelSummary } from './models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private readonly api = inject(BookingApiService);
  private readonly fb = inject(FormBuilder);

  hotelFilterControl = this.fb.control('');

  hotels: HotelSummary[] = [];
  hotelsLoading = false;
  hotelsError = '';

  constructor() {
    this.loadHotels();
  }

  sampleHotels = [
    { name: 'Central Plaza', city: 'Austin', rating: 4.6, rooms: 38 },
    { name: 'Riverwalk Suites', city: 'San Antonio', rating: 4.4, rooms: 24 },
    { name: 'Hill Country Inn', city: 'Fredericksburg', rating: 4.2, rooms: 18 },
  ];

  sampleRooms = [
    {
      hotelName: 'Central Plaza',
      roomNumber: '1204',
      roomType: 'DELUXE',
      capacity: 3,
      baseRate: 189,
    },
    {
      hotelName: 'Riverwalk Suites',
      roomNumber: '807',
      roomType: 'STANDARD',
      capacity: 2,
      baseRate: 149,
    },
  ];

  async loadHotels(city?: string) {
    this.hotelsLoading = true;
    this.hotelsError = '';
    try {
      this.hotels = await firstValueFrom(this.api.listHotels(city));
    } catch (error) {
      this.hotelsError =
        error instanceof Error ? error.message : 'Unable to load hotels.';
    } finally {
      this.hotelsLoading = false;
    }
  }

  applyHotelFilter() {
    const city = this.hotelFilterControl.value?.trim();
    this.loadHotels(city || undefined);
  }

  resetHotelFilter() {
    this.hotelFilterControl.setValue('');
    this.loadHotels();
  }
}
