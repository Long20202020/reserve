"use server";

import userModel from "../../../User";
import connectToDB from "../../../db";

export async function getFullyBookedDates(ALL_TIMES) {
  await connectToDB();

  const reservations = await userModel.find();

  const grouped = {};

  reservations.forEach((r) => {
    if (!grouped[r.date]) grouped[r.date] = [];
    grouped[r.date].push(r.time);
  });

  const fullDates = Object.keys(grouped).filter((date) =>
    ALL_TIMES.every((t) => grouped[date].includes(t))
  );

  return fullDates;
}