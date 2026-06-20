"use client";

import styles from "./page.module.css";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { useEffect, useRef, useState } from "react";
import createDate from "./action/createDate";
import DateObject from "react-date-object";
import { useFormState } from "react-dom";
import { getReservedTimes } from "./action/ReservedItems";
import { getFullyBookedDates } from "./action/GetFullyBookedDates";

export default function Home() {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [reservedTimes, setReservedTimes] = useState([]);
  const [disabledDates, setDisabledDates] = useState([]);

  const times = ["9", "10", "11", "12"];

  const formRef = useRef();

  const [state, formAction] = useFormState(createDate, {
    success: false,
    message: "",
  });

  // گرفتن تایم‌های رزرو شده بر اساس تاریخ
  useEffect(() => {
    if (!date) return;

    const fetchData = async () => {
      const res = await getReservedTimes(date.format("YYYY/MM/DD"));
      setReservedTimes(res);
    };

    fetchData();
  }, [date]);

  // گرفتن تاریخ‌های فول رزرو
  useEffect(() => {
    const fetch = async () => {
      const res = await getFullyBookedDates(times);
      setDisabledDates(res);
    };

    fetch();
  }, []);

  // ریست فرم بعد از موفقیت
  useEffect(() => {
    if (state.success) {
      setDate(null);
      setTime("");
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>رزرو نوبت ماشین</h1>

      <form ref={formRef} action={formAction} className={styles.form}>
        {/* Date Picker */}
        <DatePicker
          calendar={persian}
          locale={persian_fa}
          value={date}
          onChange={setDate}
          placeholder="تاریخ را وارد کنید..."
          minDate={new DateObject({ calendar: persian })}
          mapDays={({ date }) => {
            const formatted = date.format("YYYY/MM/DD");

            if (disabledDates.includes(formatted)) {
              return {
                disabled: true,
                style: {
                  backgroundColor: "#334155",
                  color: "#94a3b8",
                },
              };
            }
          }}
        />

        {/* Times */}
        <div className={styles.timeGrid}>
          {times.map((item, index) => {
            const isReserved = reservedTimes.includes(item);

            return (
              <button
                key={`${item}-${index}`}
                type="button"
                disabled={isReserved}
                onClick={() => setTime(item)}
                className={
                  isReserved
                    ? styles.timeDisabled
                    : time === item
                    ? styles.timeSelected
                    : styles.timeBtn
                }
              >
                {isReserved ? "رزرو شده" : `ساعت ${item}`}
              </button>
            );
          })}
        </div>

        {/* Hidden inputs */}
        <input
          type="hidden"
          name="date"
          value={date ? date.format("YYYY/MM/DD") : ""}
        />
        <input type="hidden" name="time" value={time} />

        {/* Username */}
        <input
          type="text"
          name="username"
          dir="rtl"
          placeholder="نام کاربری"
          className={styles.input}
        />

        {/* Submit */}
        <button type="submit" className={styles.submitBtn}>
          ثبت نوبت
        </button>

        {/* Message */}
        {state.message && <p className={styles.message}>{state.message}</p>}
      </form>
    </main>
  );
}