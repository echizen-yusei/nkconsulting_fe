import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const STRIPE_CSP = `
              default-src 'self';
              script-src 'self' 'unsafe-inline' https://js.stripe.com https://*.js.stripe.com https://maps.googleapis.com;
              frame-src https://js.stripe.com https://*.js.stripe.com https://hooks.stripe.com;
              connect-src 'self' https://api.stripe.com https://js.stripe.com https://maps.googleapis.com https://api.nk-consulting.jp https://api.nk-consulting-stg.bunbu.tech;
              img-src 'self' data: https://*.stripe.com https://api.nk-consulting.jp https://api.nk-consulting-stg.bunbu.tech;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              object-src 'none';
            `.replace(/\s+/g, " ");

const HEADER_CSP = [
  {
    key: "Content-Security-Policy",
    value: STRIPE_CSP,
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/payment",
        headers: HEADER_CSP,
      },
      {
        source: "/user/membership-information/upgrade-plan",
        headers: HEADER_CSP,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "api.nk-consulting-stg.bunbu.tech",
      },
      {
        protocol: "https",
        hostname: "api.nk-consulting.jp",
      },
    ],
    qualities: [70, 75, 80],
  },
};

const withNextIntl = createNextIntlPlugin("./src/locales/request.ts");
export default withNextIntl(nextConfig);
