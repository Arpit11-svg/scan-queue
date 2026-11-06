import React, { useState } from "react";
import Input from "./ui/Input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import authService from "../services/auth.service.js";

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ shouldFocusError: true });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const create = async (data) => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setSuccess("Account created successfully! Redirecting to login page...");
      reset();
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const errorText = (msg) =>
    msg && <p className="mt-1 text-sm text-red-400">{msg}</p>;

  return (
    <form onSubmit={handleSubmit(create)} className="space-y-5">
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
          label="Business Name"
          placeholder="e.g, Max Hospital"
          {...register("name", { required: "Business name is required" })}
        />
        {errorText(errors.name?.message)}
      </div>

      <div>
        <Input
          label="Business Email"
          placeholder="e.g, maxhospitals@gmail.com"
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
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}

export default SignupForm;
