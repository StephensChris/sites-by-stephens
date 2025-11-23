export default function Page() {
  const host = typeof headers !== "undefined" ? headers().get("host") : "";
  const subdomain = host?.split(".")?.[0] || "";
  const isMain = host?.endsWith("sitesbystephens.com") || host?.includes("vercel.app");

  return (
    <main style={{ padding: "5rem", textAlign: "center", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: "3rem" }}>
        {isMain ? "sitesbystephens.com – main site" : `${subdomain}.sitesbystephens.com`}
      </h1>
      <p style={{ fontSize: "2rem", marginTop: "3rem" }}>
        {isMain ? "Wildcard ready!" : "Your subdomain works perfectly!"}
      </p>
      <p style={{ marginTop: "2rem" }}>
        {isMain && "Try → https://sweetsbysami.sitesbystephens.com"}
      </p>
    </main>
  );
}

export const dynamic = "force-dynamic";