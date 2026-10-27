
"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Save,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

type Product = {
  _id: string;
  name: string;
  description: string;
  group?: string;
  image: string;
  sizes?: string[] | string;
};

function parseSizes(value: Product["sizes"]): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value !== "string" || !value.trim()) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.map(String);
    }
  } catch {
    // Support comma-separated sizes too.
  }

  return value
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean);
}

export default function EditProductClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params.id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [group, setGroup] = useState("whole");
  const [sizesText, setSizesText] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in as an admin.");
      }

      const response = await fetch(
        `${API_URL}/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Unable to load product."
        );
      }

      const product: Product = data?.product ?? data;

      if (!product?._id) {
        throw new Error("Product details were not found.");
      }

      setName(product.name ?? "");
      setDescription(product.description ?? "");
      setGroup(product.group ?? "whole");
      setSizesText(parseSizes(product.sizes).join(", "));
      setExistingImage(product.image ?? "");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load product."
      );
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void loadProduct();
  }, [loadProduct]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in as an admin.");
      }

      const sizes = sizesText
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("group", group);
      formData.append("sizes", JSON.stringify(sizes));

      // Keep the current image unless a new image is selected.
      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        formData.append("image", existingImage);
      }

      const response = await fetch(
        `${API_URL}/product/${productId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Failed to update product."
        );
      }

      setSuccess("Product updated successfully.");

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update product."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full min-w-0 rounded-xl border border-[#dfe3d0] bg-white px-4 py-3 text-sm text-[#2f381b] outline-none transition placeholder:text-gray-400 focus:border-[#687746] focus:ring-2 focus:ring-[#687746]/15";

  const labelClass =
    "block text-sm font-semibold text-[#2f381b]";

  if (loading) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-[#3f4a24]" />
        <p className="text-sm text-[#566049]">Loading product details...</p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-5xl">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-[#566049] transition hover:text-[#9a432a]"
        >
          <ArrowLeft size={17} />
          Back to products
        </Link>

        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a432a]">
            Product management
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#2f381b] sm:text-3xl">
            Edit Product
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#566049] sm:text-base">
            Update the product details, available sizes, or product image.
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-[#e3e8dc] bg-white shadow-sm"
      >
        <div className="space-y-6 p-4 sm:p-6 md:p-8">
          <div>
            <label htmlFor="product-name" className={labelClass}>
              Product name
            </label>

            <input
              id="product-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
              placeholder="Enter product name"
              required
              maxLength={150}
            />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={inputClass}
              placeholder="Describe your product"
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="group" className={labelClass}>
                Product group
              </label>

              <select
                id="group"
                value={group}
                onChange={(event) => setGroup(event.target.value)}
                className={inputClass}
                required
              >
                <option value="whole">Whole</option>
                <option value="powder">Powder</option>
              </select>
            </div>

            <div>
              <label htmlFor="sizes" className={labelClass}>
                Available sizes
              </label>

              <input
                id="sizes"
                value={sizesText}
                onChange={(event) => setSizesText(event.target.value)}
                className={inputClass}
                placeholder="100g, 250g, 500g"
              />

              <p className="mt-2 text-xs leading-5 text-[#7a8470]">
                Separate sizes with commas.
              </p>
            </div>
          </div>

          <div>
            <label className={labelClass}>Product image</label>

            <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-[180px_minmax(0,1fr)]">
              <div className="relative flex min-h-[180px] items-center justify-center overflow-hidden rounded-xl border border-[#e3e8dc] bg-[#f7f8f3] p-3">
                {imageFile ? (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="New product preview"
                    className="max-h-52 w-full object-contain"
                  />
                ) : existingImage ? (
                  <Image
                    src={`${API_URL}/uploads/${existingImage.replace(/^\/?uploads\//, "")}`}
                    alt={name || "Current product image"}
                    width={240}
                    height={240}
                    unoptimized
                    className="max-h-52 w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#7a8470]">
                    <ImagePlus size={30} />
                    <span className="text-xs">No image available</span>
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-col items-start justify-center">
                <p className="text-sm font-medium text-[#2f381b]">
                  {imageFile ? imageFile.name : "Current product image"}
                </p>

                <p className="mt-2 text-sm leading-6 text-[#7a8470]">
                  Choose a new image only if you want to replace the existing
                  one. Otherwise, the current image will be kept.
                </p>

                <label
                  htmlFor="product-image"
                  className="mt-4 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#dfe3d0] px-4 py-2 text-sm font-semibold text-[#3f4a24] transition hover:bg-[#f4f6ee]"
                >
                  <ImagePlus size={17} />
                  Choose image
                </label>

                <input
                  id="product-image"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (file) {
                      setImageFile(file);
                    }
                  }}
                />

                {imageFile && (
                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    className="mt-3 text-sm font-medium text-[#9a432a] hover:underline"
                  >
                    Keep current image instead
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-[#edf0e4] bg-[#fafbf8] p-4 sm:flex-row sm:items-center sm:justify-end sm:px-8 sm:py-5">
          <Link
            href="/admin/products"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#dfe3d0] bg-white px-6 py-3 text-sm font-semibold text-[#566049] transition hover:bg-[#f4f6ee]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#3f4a24] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2f381b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Saving changes...
              </>
            ) : (
              <>
                <Save size={17} />
                Save changes
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
