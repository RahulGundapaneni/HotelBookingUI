import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import type {
  AvailableRoom,
  AvailabilitySearch,
  BookingPayload,
  BookingResponse,
  HotelSummary,
} from './models';

@Injectable({
  providedIn: 'root',
})
export class BookingApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl.replace(/\/$/, '');

  listHotels(city?: string) {
    const params = city ? { city } : undefined;
    return this.http.get<HotelSummary[]>(`${this.baseUrl}/api/hotels`, {
      params,
    });
  }

  searchAvailability(search: AvailabilitySearch) {
    return this.http.get<AvailableRoom[]>(`${this.baseUrl}/api/availability`, {
      params: {
        city: search.city,
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        guests: search.guests,
      },
    });
  }

  createBooking(payload: BookingPayload) {
    return this.http.post<BookingResponse>(`${this.baseUrl}/api/bookings`, payload);
  }
}
