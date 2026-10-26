
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { adminService } from "@/app/services/adminService";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

type Product = {
  _id: string;
  name: string;
  description: string;
  group?: string;
  image: string;
  sizes?: string[] | string;
};

function parseSizes(sizes?: string[] | string): string {
  if (Array.isArray(sizes)) {
    return sizes.join(", ");
  }

  if (typeof sizes === "string") {
    try {
      const parsed = JSON.parse(sizes);
      if (Array.isArray(parsed)) {
        return parsed.join(", ");
      }
    } catch {
      // Use the original string if it is not JSON.
    }

    return sizes;
  }

  return "";
}

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [group, setGroup] = useState("whole");
  const [sizes, setSizes] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const token = sessionStorage.getItem("token");

        if (!token) {
          throw new Error("Please log in as an admin.");
        }

        const result = await adminService.getProduct(token, productId);

        const data: Product | null = result?.product ?? result;

        if (!data || !data._id) {
          throw new Error("Product not found.");
        }

        if (!active) return;

        setProduct(data);
        setName(data.name || "");
        setDescription(data.description || "");
        setGroup(data.group || "whole");
        setSizes(parseSizes(data.sizes));

        if (data.image) {
          setImagePreview(`${API_URL}/uploads/${data.image}`);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load product."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (productId) {
      loadProduct();
    }

    return () => {
      active = false;
    };
  }, [productId]);

  useEffect(() => {
    if (!image) return;

    const objectUrl = URL.createObjectURL(image);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!product) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in as an admin.");
      }

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("group", group);

      const sizeArray = sizes
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean);

      formData.append("sizes", JSON.stringify(sizeArray));

      // Send a new image only if the admin selected one.
      if (image) {
        formData.append("image", image);
      } else {
        // Keep the existing image filename.
        formData.append("image", product.image || "");
      }

      await adminService.updateProduct(token, productId, formData);

      setSuccess("Product updated successfully.");

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl p-8 text-center text-[#566049]">
        Loading product details...
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-2xl border border-red-200 bg-white p-6">
          <p className="text-red-600">{error}</p>
          <Link
            href="/admin/products"
            className="mt-4 inline-block font-semibold text-[#3f4a24] underline"
          >
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a432a]">
            Dhavam Spices Admin
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#2f381b] sm:text-4xl">
            Edit Product
          </h1>

          <p className="mt-2 text-sm text-[#566049]">
            Update product information, sizes, or image.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="rounded-full border border-[#dfe3d0] px-5 py-2.5 text-sm font-semibold text-[#3f4a24] transition hover:bg-[#e6ebdc]"
        >
          ← Back to products
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-[#e3e8dc] bg-white p-5 shadow-sm sm:p-8"
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-[#2f381b]"
          >
            Product Name
          </label>

          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className="w-full rounded-xl border border-[#dfe3d0] px-4 py-3 outline-none transition focus:border-[#3f4a24] focus:ring-2 focus:ring-[#3f4a24]/15"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-[#2f381b]"
          >
            Description
          </label>

          <textarea
            id="description"
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product"
            className="w-full resize-y rounded-xl border border-[#dfe3d0] px-4 py-3 outline-none transition focus:border-[#3f4a24] focus:ring-2 focus:ring-[#3f4a24]/15"
          />
        </div>

        <div>
          <label
            htmlFor="group"
            className="mb-2 block text-sm font-semibold text-[#2f381b]"
          >
            Product Category
          </label>

          <select
            id="group"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="w-full rounded-xl border border-[#dfe3d0] bg-white px-4 py-3 outline-none focus:border-[#3f4a24] focus:ring-2 focus:ring-[#3f4a24]/15"
          >
            <option value="whole">Whole Spices</option>
            <option value="powder">Spice Powders</option>
            <option value="combo">Spice Combos</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="sizes"
            className="mb-2 block text-sm font-semibold text-[#2f381b]"
          >
            Available Sizes
          </label>

          <input
            id="sizes"
            type="text"
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            placeholder="50g, 100g, 250g"
            className="w-full rounded-xl border border-[#dfe3d0] px-4 py-3 outline-none transition focus:border-[#3f4a24] focus:ring-2 focus:ring-[#3f4a24]/15"
          />

          <p className="mt-2 text-xs text-[#7a8470]">
            Separate sizes with commas, for example: 50g, 100g, 250g.
          </p>
        </div>

        <div>
          <label
            htmlFor="image"
            className="mb-3 block text-sm font-semibold text-[#2f381b]"
          >
            Product Image
          </label>

          {imagePreview ? (
            <div className="relative mb-4 h-56 w-full overflow-hidden rounded-2xl border border-[#e3e8dc] bg-[#e6ebdc] sm:w-72">
              <Image
                src={imagePreview}
                alt="Product preview"
                fill
                unoptimized
                className="object-contain p-4"
                sizes="288px"
              />
            </div>
          ) : (
            <div className="mb-4 flex h-40 w-full items-center justify-center rounded-2xl border border-dashed border-[#dfe3d0] bg-[#f7f8f3] text-sm text-[#7a8470] sm:w-72">
              No image available
            </div>
          )}

          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="block w-full text-sm text-[#566049] file:mr-4 file:rounded-full file:border-0 file:bg-[#e6ebdc] file:px-4 file:py-2.5 file:font-semibold file:text-[#3f4a24] hover:file:bg-[#dce3cf]"
          />

          <p className="mt-2 text-xs text-[#7a8470]">
            Choose a new image only if you want to replace the current one.
          </p>
        </div>

        <div className="border-t border-[#e3e8dc] pt-5">
          <p className="mb-5 break-all text-xs text-[#7a8470]">
            Product ID: {product._id}
          </p>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/products"
              className="rounded-full border border-[#dfe3d0] px-6 py-3 text-center text-sm font-semibold text-[#3f4a24] transition hover:bg-[#f7f8f3]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#3f4a24] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#2f381b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
