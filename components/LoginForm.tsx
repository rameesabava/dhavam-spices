"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { loginUser } from "@/lib/login";

type Values = { email: string; password: string };
type FieldName = keyof Values;
type Errors = Partial<Record<FieldName, string>>;

const FIELD_ORDER: FieldName[] = ["email", "password"];

function validate(v: Values): Errors {
  const e: Errors = {};
  const email = v.email.trim();

  if (!email) {
    e.email = "Please enter your email address.";
  } else if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
  ) {
    e.email = "Enter a valid email, like name@example.com.";
  }

  if (!v.password) {
    e.password = "Please enter your password.";
  }

  return e;
}

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-[#20261f] placeholder:text-[#9aa28c] transition-shadow focus:outline-none focus:ring-4 focus:ring-[#9a432a]/25";

function Field({
  id,
  label,
  error,
  aside,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label
          htmlFor={id}
          className="text-sm font-medium text-[#2f381b]"
        >
          {label}
        </label>
        {aside}
      </div>

      {children}

      {error && (
        <p
          id={`${id}-err`}
          role="alert"
          className="mt-1.5 text-sm text-[#b3341f]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function LoginForm() {
  const router = useRouter();

  const [v, setV] = useState<Values>({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState<
    Partial<Record<FieldName, boolean>>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const resetForm = () => {
      setV({ email: "", password: "" });
      setTouched({});
      setSubmitted(false);
      setShow(false);
      setBusy(false);
      setFormError("");
    };

    resetForm();

    window.addEventListener("pageshow", resetForm);

    return () => {
      window.removeEventListener("pageshow", resetForm);
    };
  }, []);

  const all = validate(v);
  const errors: Errors = {};

  FIELD_ORDER.forEach((k) => {
    if ((touched[k] || submitted) && all[k]) {
      errors[k] = all[k];
    }
  });

  const set =
    (k: FieldName) => (e: ChangeEvent<HTMLInputElement>) => {
      setV((p) => ({ ...p, [k]: e.target.value }));

      if (formError) {
        setFormError("");
      }
    };

  const blur = (k: FieldName) => () =>
    setTouched((t) => ({ ...t, [k]: true }));

  const cls = (k: FieldName) =>
    `${inputBase} ${
      errors[k] ? "border-[#b3341f]" : "border-[#cfd5bf]"
    }`;

  const aria = (k: FieldName) => ({
    "aria-invalid": !!errors[k],
    "aria-describedby": errors[k] ? `${k}-err` : undefined,
  });

  async function onSubmit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();

    if (busy) return;

    setSubmitted(true);
    setFormError("");

    const firstBad = FIELD_ORDER.find((k) => all[k]);

    if (firstBad) {
      formRef.current
        ?.querySelector<HTMLInputElement>(`#${firstBad}`)
        ?.focus();
      return;
    }

    setBusy(true);

    try {
      const data = await loginUser({
        email: v.email.trim().toLowerCase(),
        password: v.password,
      });

      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("username", data.user.username);
      sessionStorage.setItem("role", data.user.role);

      window.dispatchEvent(new Event("authChanged"));

      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/products");
      }
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setBusy(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className="space-y-5"
    >
      {formError && (
        <p
          role="alert"
          className="rounded-xl bg-[#fbeae7] px-4 py-3 text-sm text-[#b3341f]"
        >
          {formError}
        </p>
      )}

      <Field id="email" label="Email" error={errors.email}>
        <input
          id="email"
          type="email"
          value={v.email}
          onChange={set("email")}
          onBlur={blur("email")}
          maxLength={254}
          autoComplete="email"
          placeholder="you@example.com"
          className={cls("email")}
          {...aria("email")}
        />
      </Field>

      <Field id="password" label="Password" error={errors.password}>
        <div className="relative">
          <input
            id="password"
            type={show ? "text" : "password"}
            value={v.password}
            onChange={set("password")}
            onBlur={blur("password")}
            maxLength={64}
            autoComplete="current-password"
            placeholder="Your password"
            className={`${cls("password")} pr-16`}
            {...aria("password")}
          />

          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-pressed={show}
            className="absolute inset-y-0 right-3 my-auto h-8 rounded-md px-2 text-sm font-semibold text-[#3f4a24] hover:bg-[#e6ebdc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a432a]"
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </Field>

      <button
        type="submit"
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#3f4a24] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#3f4a24]/25 transition-all hover:-translate-y-0.5 hover:bg-[#2f381b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#9a432a]/40 disabled:translate-y-0 disabled:opacity-70"
      >
        {busy && (
          <span
            className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
            aria-hidden="true"
          />
        )}
        {busy ? "Logging in…" : "Log in"}
      </button>

      <p className="text-center text-sm text-[#566049]">
        New to Dhavam Spices?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#9a432a] hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}