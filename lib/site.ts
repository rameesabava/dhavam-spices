export const SITE = {
  name: "Dhavam Spices",
  legalName: "Dhavam Spices",
  owner: "Shiyas A",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://dhavamspices.com",
  email: "dhavamspices@gmail.com",
  description:
    "Premium, 100% pure and unadulterated farm-direct spices and masalas from Chennai. Fresh whole cardamom, black pepper, cloves, cinnamon, star anise, and finely ground spice powders.",
  phones: [
    { display: "+91 63830 73503", tel: "+916383073503" },
    { display: "+91 81481 23417", tel: "+918148123417" },
  ],
  whatsapp: "916383073503",
  address: {
    streetAddress: "Casagrand Northern Star",
    addressLocality: "Madhavaram, Chennai",
    addressRegion: "Tamil Nadu",
    postalCode: "600110",
    addressCountry: "IN",
  },
  socials: {
    facebook: "https://www.facebook.com/profile.php?id=61595939693155",
    instagram: "https://www.instagram.com/dhavam_spices",
  },
};

export const waLink = (text: string) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
