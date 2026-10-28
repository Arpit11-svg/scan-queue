import React, { useState } from "react";
import authService from "../services/auth.service.js";
import Input from "./ui/Input.jsx";
import { useForm } from "react-hook-form";

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ shouldFocusError: true });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const login = async (data) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await authService.login({
        email: data.email,
        password: data.password,
      });

      setSuccess("Logged in successfully!");
      reset();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const errorText = (msg) =>
    msg && <p className="mt-1 text-sm text-red-400">{msg}</p>;

  return (
    <form onSubmit={handleSubmit(login)} className="space-y-5">
      {success && (
        <p className="rounded-lg bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div>
        <Input
          label="Business Email"
          placeholder="maxhospitals@gmail.com"
          {...register("email", {
            required: "Business email is required",
            pattern: {
              value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
              message: "Enter a valid email",
            },
          })}
        />
        {errorText(errors.email?.message)}
      </div>

      <div>
        <Input
          type="password"
          label="Password"
          placeholder="********"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
        />
        {errorText(errors.password?.message)}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}

export default LoginForm;
