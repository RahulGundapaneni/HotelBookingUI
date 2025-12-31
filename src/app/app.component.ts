import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { BookingApiService } from './booking-api.service';
import type { AvailableRoom, HotelSummary } from './models';

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
  availabilityForm = this.fb.nonNullable.group(
    {
      city: ['Austin', Validators.required],
      checkIn: [this.formatDateOffset(1), Validators.required],
      checkOut: [this.formatDateOffset(3), Validators.required],
      guests: [2, [Validators.required, Validators.min(1)]],
    },
    { validators: this.checkOutAfterCheckInValidator() },
  );
  availabilityControls = this.availabilityForm.controls;

  hotels: HotelSummary[] = [];
  hotelsLoading = false;
  hotelsError = '';

  rooms: AvailableRoom[] = [];
  roomsLoading = false;
  roomsError = '';
  selectedRoom: AvailableRoom | null = null;

  constructor() {
    this.loadHotels();
    this.searchAvailability();
  }

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

  async searchAvailability() {
    if (this.availabilityForm.invalid) {
      this.availabilityForm.markAllAsTouched();
      return;
    }

    this.roomsLoading = true;
    this.roomsError = '';
    const search = this.availabilityForm.getRawValue();

    try {
      this.rooms = await firstValueFrom(this.api.searchAvailability(search));
      if (this.selectedRoom && !this.rooms.some((room) => room.roomId === this.selectedRoom?.roomId)) {
        this.selectedRoom = null;
      }
    } catch (error) {
      this.rooms = [];
      this.roomsError =
        error instanceof Error ? error.message : 'Unable to search room availability.';
    } finally {
      this.roomsLoading = false;
    }
  }

  selectRoom(room: AvailableRoom) {
    this.selectedRoom = room;
  }

  showControlInvalid(controlName: keyof typeof this.availabilityControls) {
    const control = this.availabilityControls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  showControlError(controlName: keyof typeof this.availabilityControls, errorCode: string) {
    const control = this.availabilityControls[controlName];
    return control.hasError(errorCode) && (control.touched || control.dirty);
  }

  get stayNights(): number | null {
    const { checkIn, checkOut } = this.availabilityForm.getRawValue();
    if (!checkIn || !checkOut) {
      return null;
    }
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffInMs = end.getTime() - start.getTime();
    const nights = Math.round(diffInMs / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : null;
  }

  get estimatedTotal(): number | null {
    if (!this.selectedRoom || this.selectedRoom.baseRate === null) {
      return null;
    }
    const nights = this.stayNights;
    if (!nights) {
      return null;
    }
    return this.selectedRoom.baseRate * nights;
  }

  private checkOutAfterCheckInValidator(): ValidatorFn {
    return (group) => {
      const checkIn = group.get('checkIn')?.value;
      const checkOut = group.get('checkOut')?.value;
      if (!checkIn || !checkOut) {
        return null;
      }
      const isAfter = new Date(checkOut).getTime() > new Date(checkIn).getTime();
      return isAfter ? null : { dateOrder: true };
    };
  }

  private formatDateOffset(daysFromToday: number) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    return date.toISOString().slice(0, 10);
  }
}
