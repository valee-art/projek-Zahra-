export type Role = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: Role;
}

export interface Assignment {
  id?: string;
  title: string;
  description: string;
  studentName: string;
  status: 'submitted' | 'graded' | 'pending';
  createdAt: string;
}

export interface PlaneTicket {
  id?: string;
  flightNumber: string;
  seatNumber: string;
  passengerName: string;
  userId: string;
  createdAt: string;
}

export interface MovieTicket {
  id?: string;
  movieTitle: string;
  seatNumber: string;
  passengerName: string;
  userId: string;
  createdAt: string;
}

export type MenuType = 'dashboard' | 'tugas' | 'pesawat' | 'bioskop' | 'stats' | 'database' | 'settings';
