"use server";

///use stripe for online payment
import { auth, signIn, signOut } from "@/app/_lib/auth";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

// in this first argument willbe data which we have binded and 2nd arg
// will be formData when the function is called this data is passed

export async function createReservation(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    throw new Error("Booking could not be created");
  }
  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

export async function updateReservation(formData) {
  // 1) authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  //2 authorization
  const guestBookings = await getBookings(session.user.guestId);

  const bookingId = parseInt(formData.get("bookingId"), 10);

  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  //3 Building update data
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  //4 mutation
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  //5 error handling
  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  // 6) revalidation

  // only updating the this route only not the child route
  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  //6 redirecting
  redirect("/account/reservations");
  //   revalidatePath("/account/reservation");
}

export async function deleleReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  //   await new Promise((res) => setTimeout(res, 2000));

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  revalidatePath("/account/reservations");
}
export async function updateGuest(formData) {
  // first we authenticate whether is user is logged in or not as it is asking for data
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const nationalID = formData.get("nationalID");

  const [nationality, countryFlag] = formData.get("nationality").split("%");
  // checking the dats
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function signInAction() {
  //name of provider
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
