
"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { api } from "@/lib/axios";
import { GROUPS } from "@/lib/products";
import axios from "axios";

const label = "mb-1.5 block text-sm font-medium text-[#2f381b]";

const input =
  "w-full rounded-xl border border-[#cfd5bf] bg-white px-4 py-3 text-[#20261f] placeholder:text-[#9aa28c] focus:outline-none focus:ring-4 focus:ring-[#9a432a]/20";

const PACK_SIZES = ["50 g", "100 g", "150 g", "250 g", "500 g", "1 kg"];

type FormData = {
  name: string;
  group: string;
  description: string;
  sizes: string[];
};

export default function ProductForm() {
  const initialForm: FormData = {
    name: "",
    group: GROUPS[0]?.id ?? "whole",
    description: "",
    sizes: ["100 g"],
  };

  const [f, setF] = useState<FormData>(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  function updateField(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setF((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSaved(false);
  }

  function toggleSize(size: string) {
    setF((previous) => ({
      ...previous,
      sizes: previous.sizes.includes(size)
        ? previous.sizes.filter((item) => item !== size)
        : [...previous.sizes, size],
    }));

    setError("");
    setSaved(false);
  }

  function selectImage(selectedFile?: File) {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB.");
      return;
    }

    setFile(selectedFile);
    setError("");
    setSaved(false);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (saving) return;

    if (!f.name.trim()) {
      setError("Please enter the product name.");
      return;
    }

    if (!f.group) {
      setError("Please select a product group.");
      return;
    }

    if (f.sizes.length === 0) {
      setError("Please select at least one pack size.");
      return;
    }

    if (!file) {
      setError("Please select a product image.");
      return;
    }

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const body = new globalThis.FormData();

      body.append("name", f.name.trim());
      body.append("description", f.description.trim());
      body.append("group", f.group);

      // Send the sizes array as JSON for the backend controller.
      body.append("sizes", JSON.stringify(f.sizes));

      // Must match upload.single("image") in your Express route.
      body.append("image", file);

      await api.post("/product/add", body);

      setF({
        name: "",
        group: GROUPS[0]?.id ?? "whole",
        description: "",
        sizes: ["100 g"],
      });

      setFile(null);
      setSaved(true);
   
} catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    console.error("Add product API error:", err.response?.data);
    console.error("HTTP status:", err.response?.status);

    setError(
      err.response?.data?.message ||
        err.response?.data?.error ||
        (typeof err.response?.data === "string"
          ? err.response.data
          : err.message) ||
        "Unable to save product."
    );
  } else {
    console.error("Add product error:", err);

    setError(
      err instanceof Error
        ? err.message
        : "Unable to save product."
    );
  }
} finally {
  setSaving(false);
}

  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
      <form
        onSubmit={onSubmit}
        noValidate
        className="space-y-5 rounded-2xl border border-[#e3e8dc] bg-white p-6 sm:p-8"
      >
        <div>
          <h2 className="text-xl font-bold text-[#2f381b]">
            Add a new product
          </h2>
          <p className="mt-1 text-sm text-[#7a8470]">
            Enter the product details and choose its available pack sizes.
          </p>
        </div>

        {/* Product image */}
        <div>
          <label htmlFor="product-image" className={label}>
            Product image
          </label>

          <div className="relative flex min-h-44 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#cfd5bf] bg-[#f4f6ee]">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Product preview"
                className="h-44 w-full object-contain p-2"
              />
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="font-semibold text-[#9a432a]">
                  Choose a product photo
                </p>
                <p className="mt-1 text-xs text-[#7a8470]">
                  JPG, PNG, WEBP · Maximum 5 MB
                </p>
              </div>
            )}

            <input
              id="product-image"
              type="file"
              accept="image/*"
              onChange={(e) => selectImage(e.target.files?.[0])}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
          </div>

          {file && (
            <p className="mt-2 text-xs text-[#566049]">
              Selected: {file.name}
            </p>
          )}
        </div>

        {/* Product name */}
        <div>
          <label htmlFor="name" className={label}>
            Product name
          </label>
          <input
            id="name"
            name="name"
            value={f.name}
            onChange={updateField}
            placeholder="Cardamom Powder"
            maxLength={100}
            className={input}
          />
        </div>

        {/* Product group */}
        <div>
          <label htmlFor="group" className={label}>
            Product group
          </label>

          <select
            id="group"
            name="group"
            value={f.group}
            onChange={updateField}
            className={input}
          >
            {GROUPS.map((group) => (
              <option key={group.id} value={group.id}>
                {group.title}
              </option>
            ))}
          </select>
        </div>

        {/* Multiple sizes */}
        <fieldset>
          <legend className={label}>Available pack sizes</legend>

          <p className="mb-3 text-xs text-[#7a8470]">
            Select every size available for this product.
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PACK_SIZES.map((size) => {
              const checked = f.sizes.includes(size);

              return (
                <label
                  key={size}
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors ${
                    checked
                      ? "border-[#3f4a24] bg-[#eef2e5] text-[#2f381b]"
                      : "border-[#cfd5bf] text-[#566049] hover:bg-[#f8f9f5]"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSize(size)}
                    className="size-4 accent-[#3f4a24]"
                  />
                  <span>{size}</span>
                </label>
              );
            })}
          </div>

          <p className="mt-3 text-sm text-[#566049]">
            Selected sizes:{" "}
            {f.sizes.length > 0 ? f.sizes.join(", ") : "None"}
          </p>
        </fieldset>

        {/* Description */}
        <div>
          <label htmlFor="description" className={label}>
            Description
          </label>

          <textarea
            id="description"
            name="description"
            value={f.description}
            onChange={updateField}
            rows={4}
            maxLength={500}
            placeholder="Describe the freshness, aroma, and quality of this spice."
            className={input}
          />

          <p className="mt-1 text-right text-xs text-[#7a8470]">
            {f.description.length}/500
          </p>
        </div>

        {/* Feedback */}
        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {saved && (
          <p
            role="status"
            className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800"
          >
            Product added successfully!
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-[#3f4a24] px-6 py-3.5 font-semibold text-white transition hover:bg-[#2f381b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving product..." : "Save product"}
        </button>
      </form>

      {/* Live preview */}
      <aside className="xl:sticky xl:top-8 xl:self-start">
        <p className="mb-3 text-sm font-medium text-[#566049]">
          Product preview
        </p>

        <div className="overflow-hidden rounded-3xl border border-[#e3e8dc] bg-white shadow-lg">
          <div className="flex aspect-square items-center justify-center bg-[#e6ebdc]">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt=""
                className="h-full w-full object-contain p-4"
              />
            ) : (
              <p className="text-sm text-[#7a8470]">Product image</p>
            )}
          </div>

          <div className="p-5">
            <h3 className="text-lg font-bold text-[#2f381b]">
              {f.name || "Product name"}
            </h3>

            <p className="mt-2 whitespace-pre-wrap text-sm text-[#566049]">
              {f.description || "Product description"}
            </p>

            <p className="mt-4 text-sm font-semibold text-[#2f381b]">
              Available sizes
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {f.sizes.length ? (
                f.sizes.map((size) => (
                  <span
                    key={size}
                    className="rounded-full border border-[#cfd5bf] bg-[#f4f6ee] px-3 py-1 text-xs text-[#2f381b]"
                  >
                    {size}
                  </span>
                ))
              ) : (
                <span className="text-sm text-[#7a8470]">
                  No sizes selected
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
