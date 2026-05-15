export const site = {
  name: "Little Champ Junior",
  brandLine: "Online • IIT mentors",
  domain: "littlechampclasses.com",
  tagline: "The Ultimate Playground for Active Brains",
  description:
    "Live, interactive classes from 1st–8th school readiness, maths, English, Science and hands-on activities led by caring IITians and NITians.",
  playfulLittleChampLogoVersion: 2,
  heroBannerSrc: "/hero-banner.svg",
  /** Home hero circle — full-bleed illustration inside rings. */
  heroCircleImageSrc:
    "/Exploring%20knowledge%20through%20interactive%20learning.png",
  contactEmail: "littlechampclasses@gmail.com",
  /** National 10-digit Indian mobile for counsellor / support (display via `formatIndianMobileDisplay`, dial via `tel:+91…`). */
  counsellorPhoneNational10: "9453503369",
  counsellorModalTitle: "Talk to a counsellor",
  counsellorModalSubtitle:
    "Have doubts? Our support team will be happy to assist you!",
  counsellorSupportImageSrc: "/counsellor-support.webp",
} as const;

export type NavItem = { label: string; href: string };

/** Footer & nav items that open the in-app book-demo flow instead of navigating. */
export type FooterOrActionLink = NavItem | { label: string; openBookDemo: true };

/** CuriousJr-style primary nav */
export const mainNav: NavItem[] = [
  { label: "School Curriculum", href: "/programs/after-school" },
  { label: "Learn English", href: "/programs/english" },
  { label: "Learn Maths", href: "/programs/maths" },
  // { label: "Activity Kits", href: "/programs/activity-kits" },
  { label: "Contact Us", href: `tel:+91${site.counsellorPhoneNational10}` },
];

export const footerNav: { title: string; links: FooterOrActionLink[] }[] = [
  {
    title: "Programs",
    links: [
      { label: "School Curriculum", href: "/programs/after-school" },
      { label: "Learn English", href: "/programs/english" },
      { label: "Learn Maths", href: "/programs/maths" },
      // { label: "Activity Kits", href: "/programs/activity-kits" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Demo classes (₹9)", openBookDemo: true },
      { label: "Practice tests", href: "/tests" },
      { label: "My dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "Contact", href: `mailto:${site.contactEmail}` },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "/policies/terms" },
      { label: "Privacy", href: "/policies/privacy" },
    ],
  },
];
