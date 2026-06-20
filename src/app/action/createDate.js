"use server";
import { revalidatePath } from "next/cache";
import userModel from "../../../User";
import connectToDB from "../../../db";

export default async function createDate(prevState, formData) {
  try {
    const date = formData.get("date");
    const time = formData.get("time");
    const username = formData.get("username");
    console.log("time----", time);
    console.log("date----", date);
    console.log("user----", username);

    await connectToDB();
    await userModel.create({
      date,
      time,
      username,
    });
    console.log("ثبت شد");
    revalidatePath("/");
    return { success: true, message: "ثبت شد" };
  } catch (error) {
    return { success: false, message: "خطا رخ داد" };
  }
}
