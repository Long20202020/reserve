"use server";

import connectToDB from "../../../db";
import userModel from "../../../User";


export async function getReservedTimes(date) {
  await connectToDB();

  const reservations = await userModel.find({ date });

  return reservations.map((r) => r.time);
}