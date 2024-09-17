"use client";
import { deleleReservation } from "../_lib/action";
import ReservationCard from "./ReservationCard";
import { useOptimistic } from "react";

export default function ReservationList({ bookings }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (bookings, bookingId) =>
      bookings.filter((booking) => booking.id !== bookingId)
  );

  function handleDelete(bookingId) {
    optimisticDelete(bookingId);
    deleleReservation(bookingId);
  }
  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
        />
      ))}
    </ul>
  );
}
