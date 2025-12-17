import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
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
}
