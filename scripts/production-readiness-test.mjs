const BASE = process.env.TEST_BASE_URL || "http://localhost:3002";

const PRODUCT_ROUTES = [
  { slug: "fruits-veggies", id: "fruits-veggies", variantId: "pack-2" },
  { slug: "shilajit-sea-moss", id: "shilajit-seamoss", variantId: "pack-2" },
  { slug: "sea-moss", id: "sea-moss", variantId: "pack-1" },
  { slug: "shilajit-resin", id: "shilajit-resin", variantId: "pack-1" },
  { slug: "beet-root-gummies", id: "beet-root-gummies", variantId: "pack-1" },
];

const results = [];
let criticalFailures = 0;

function pass(name, detail = "") {
  results.push({ status: "PASS", name, detail });
}

function fail(name, detail = "") {
  results.push({ status: "FAIL", name, detail });
  criticalFailures++;
}

async function fetchText(path) {
  const res = await fetch(`${BASE}${path}`);
  const text = await res.text();
  return { res, text };
}

function checkAlternatingBackgrounds(html, pageName) {
  const matches = [...html.matchAll(/<section class="(bg-tm-(?:white|off-white))"/g)];
  const bgs = matches.map((m) => m[1]);
  if (bgs.length === 0) {
    fail(`${pageName}: section backgrounds`, "No section backgrounds found");
    return;
  }
  for (let i = 1; i < bgs.length; i++) {
    if (bgs[i] === bgs[i - 1]) {
      fail(
        `${pageName}: alternating backgrounds`,
        `Consecutive ${bgs[i]} at sections ${i} and ${i + 1}`,
      );
      return;
    }
  }
  const invalid = bgs.filter((b) => b !== "bg-tm-white" && b !== "bg-tm-off-white");
  if (invalid.length) {
    fail(`${pageName}: background colors`, `Unexpected: ${invalid.join(", ")}`);
    return;
  }
  pass(`${pageName}: alternating backgrounds`, bgs.join(" → "));
}

async function testHomepage() {
  const { res, text } = await fetchText("/");
  if (!res.ok) {
    fail("Homepage HTTP", `${res.status}`);
    return;
  }
  pass("Homepage HTTP", "200");

  const sections = [
    "Shop &amp; Save",
    "Choose the products that fit you",
    "Why TM NATURALS",
    "Inside TM NATURALS",
    "Simple Formulas. Clear Ingredients.",
    "Our Approach",
    "About TM NATURALS",
    "Get In Touch",
    "Questions? Start Here.",
  ];
  for (const s of sections) {
    if (!text.includes(s)) fail("Homepage section", `Missing: ${s}`);
    else pass("Homepage section", s);
  }

  if (text.includes("View Product Details")) pass("Homepage product detail CTAs");
  else fail("Homepage product detail CTAs", "Missing View Product Details");

  for (const p of PRODUCT_ROUTES) {
    const href = `/products/${p.slug}`;
    if (text.includes(href)) pass("Homepage product link", href);
    else fail("Homepage product link", `Missing ${href}`);
  }

  if (text.includes("inline-flex h-11 w-12 shrink-0 items-center justify-center")) {
    pass("Homepage quantity centering classes");
  } else {
    fail("Homepage quantity centering classes", "Centered quantity box not found");
  }

  if (text.includes("snap-x snap-mandatory")) pass("Homepage carousel snap");
  else fail("Homepage carousel snap", "Missing snap classes");
}

async function testProductPage(route) {
  const path = `/products/${route.slug}`;
  const { res, text } = await fetchText(path);
  if (!res.ok) {
    fail(`${path} HTTP`, `${res.status}`);
    return;
  }
  pass(`${path} HTTP`, "200");

  const required = [
    "Everyday Formula",
    "Product Information",
    "Product Overview",
    "Inside TM NATURALS",
    "What's In The Formula",
    "How to Use",
    "Questions? Start Here.",
    "You Might Also Like",
    "Explore More From TM NATURALS",
    "Add to Cart",
    "Choose Your Pack",
    "Subtotal",
    "Secure checkout powered by Stripe",
    "mt-4 h-1 w-16 rounded-full bg-tm-orange",
    "inline-flex h-11 w-12 shrink-0 items-center justify-center",
  ];
  for (const r of required) {
    if (!text.includes(r)) fail(`${path} content`, `Missing: ${r}`);
    else pass(`${path} content`, r);
  }

  checkAlternatingBackgrounds(text, path);

  if (route.slug === "fruits-veggies") {
    if (text.includes("lg:grid-cols-2 lg:gap-16") && text.includes("FRUITS") === false) {
      // title is "Fruits" in data, not FRUITS uppercase in HTML necessarily
    }
    if (text.includes("Fruits") && text.includes("Veggies") && text.includes("lg:grid-cols-2")) {
      pass("Fruits & Veggies dual-column layout");
    } else {
      fail("Fruits & Veggies dual-column layout");
    }
  }
}

async function testStripeCheckout(productId, variantId, label) {
  const res = await fetch(`${BASE}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: [{ productId, variantId, quantity: 1 }],
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    fail(`Stripe checkout: ${label}`, `${res.status} ${data.error || JSON.stringify(data)}`);
    return;
  }
  if (!data.url || !String(data.url).includes("checkout.stripe.com")) {
    fail(`Stripe checkout: ${label}`, `Invalid URL: ${data.url || "none"}`);
    return;
  }
  const stripePage = await fetch(data.url, { method: "HEAD", redirect: "follow" });
  if (stripePage.status >= 400) {
    fail(`Stripe hosted page: ${label}`, `HTTP ${stripePage.status}`);
    return;
  }
  pass(`Stripe checkout: ${label}`, "Session created + Stripe URL reachable");
}

async function testCheckoutUrls() {
  const res = await fetch(`${BASE}/api/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://darkcyan-chicken-420345.hostingersite.com",
    },
    body: JSON.stringify({
      items: [{ productId: "fruits-veggies", variantId: "pack-2", quantity: 1 }],
    }),
  });
  const data = await res.json();
  if (data.url?.startsWith("https://checkout.stripe.com")) {
    pass("Stripe checkout URL format");
  } else {
    fail("Stripe checkout URL format", data.url || "no url");
  }
}

async function testRelatedLinks() {
  for (const route of PRODUCT_ROUTES) {
    const { text } = await fetchText(`/products/${route.slug}`);
    const matches = [...text.matchAll(/href="(\/products\/[^"]+)"/g)];
    const hrefs = [...new Set(matches.map((m) => m[1]))];
    for (const href of hrefs) {
      const { res } = await fetchText(href);
      if (res.ok) pass("Related product link", `${route.slug} → ${href}`);
      else fail("Related product link", `${href} returned ${res.status}`);
    }
  }
}

async function testStaticAssets() {
  const assets = [
    "/images/tm-naturals-logo.png",
    "/images/fruits-veggies.png",
    "/images/sea-moss.png",
    "/images/shilajit-seamoss.png",
    "/images/shilajit-resin.png",
    "/images/beet-root-gummies.png",
  ];
  for (const asset of assets) {
    const res = await fetch(`${BASE}${asset}`, { method: "HEAD" });
    if (res.ok) pass("Static asset", asset);
    else fail("Static asset", `${asset} ${res.status}`);
  }
}

async function main() {
  console.log(`Testing production server at ${BASE}\n`);
  try {
    await testHomepage();
    for (const route of PRODUCT_ROUTES) {
      await testProductPage(route);
    }
    await testRelatedLinks();
    await testStaticAssets();
    await testCheckoutUrls();
    for (const route of PRODUCT_ROUTES) {
      await testStripeCheckout(route.id, route.variantId, route.slug);
    }
  } catch (err) {
    fail("Test runner", err instanceof Error ? err.message : String(err));
  }

  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL");
  console.log(`\n=== SUMMARY: ${passed} passed, ${failed.length} failed ===\n`);
  if (failed.length) {
    console.log("FAILURES:");
    for (const f of failed) console.log(`  ✗ ${f.name}: ${f.detail}`);
    process.exit(1);
  }
  console.log("All critical automated tests passed.");
}

main();
