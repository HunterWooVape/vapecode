"use server";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type ActionResult = { success: true; message: string } | { success: false; error: string };

// Newsletter subscription
export async function subscribeNewsletter(formData: FormData): Promise<ActionResult> {
  try {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const buyerType = String(formData.get("buyerType") ?? "");
    const state = String(formData.get("state") ?? "");
    const interestedCategories = String(formData.get("interestedCategories") ?? "");
    const is21Plus = formData.get("is21Plus") === "on";

    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid business email." };
    }
    if (!is21Plus) {
      return { success: false, error: "You must confirm you are 21+ to subscribe." };
    }

    // Beehiiv integration (optional)
    const beehiivPubId = process.env.BEEHIIV_PUBLICATION_ID;
    if (beehiivPubId) {
      try {
        await fetch(`https://api.beehiiv.com/v2/publications/${beehiivPubId}/subscriptions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.BEEHIIV_API_KEY ?? ""}`
          },
          body: JSON.stringify({
            email,
            reactivate_existing: false,
            send_welcome_email: true,
            utm_source: "vape-wholesale-discount-tracker",
            custom_fields: [
              { name: "buyer_type", value: buyerType },
              { name: "state", value: state },
              { name: "interested_categories", value: interestedCategories }
            ]
          })
        });
      } catch {
        // Beehiiv failure is non-blocking; still try Supabase
      }
    }

    // Supabase fallback/primary storage
    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("newsletter_subscribers").upsert(
        {
          email,
          buyer_type: buyerType,
          state,
          interested_categories: interestedCategories,
          is_21_plus: is21Plus,
          consent_text: "I am 21+ and agree to receive wholesale discount emails. I can unsubscribe at any time."
        },
        { onConflict: "email" }
      );
      if (error) {
        return { success: false, error: error.message };
      }
    }

    return {
      success: true,
      message: beehiivPubId
        ? "Subscribed! Check your inbox for a welcome email."
        : "Subscribed! Your email has been saved."
    };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Something went wrong." };
  }
}

// Quote match form
export async function submitQuoteMatch(formData: FormData): Promise<ActionResult> {
  try {
    const businessName = String(formData.get("businessName") ?? "").trim();
    const businessEmail = String(formData.get("businessEmail") ?? "").trim().toLowerCase();
    const state = String(formData.get("state") ?? "").trim();
    const monthlyPurchaseVolume = String(formData.get("monthlyPurchaseVolume") ?? "");
    const productCategories = String(formData.get("productCategories") ?? "");
    const licenseStatus = String(formData.get("licenseStatus") ?? "");
    const notes = String(formData.get("notes") ?? "");
    const partnerConsent = formData.get("partnerConsent") === "on";

    if (!businessName || !businessEmail || !state) {
      return { success: false, error: "Please fill in all required fields." };
    }
    if (!businessEmail.includes("@")) {
      return { success: false, error: "Please enter a valid business email." };
    }
    if (!partnerConsent) {
      return { success: false, error: "You must agree to partner contact." };
    }

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("quote_requests").insert({
        business_name: businessName,
        business_email: businessEmail,
        state,
        monthly_purchase_volume: monthlyPurchaseVolume,
        product_categories: productCategories,
        license_status: licenseStatus,
        notes,
        partner_contact_consent: partnerConsent,
        consent_text:
          "I agree that selected wholesale partners may contact me about relevant offers.",
        review_status: "new"
      });
      if (error) {
        return { success: false, error: error.message };
      }
    }

    return {
      success: true,
      message:
        "Quote request received. If your request matches current wholesale partners, you will be contacted within 3-5 business days."
    };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Something went wrong." };
  }
}

// Submit coupon/deal source
export async function submitOfferSource(formData: FormData): Promise<ActionResult> {
  try {
    const merchantName = String(formData.get("merchantName") ?? "").trim();
    const code = String(formData.get("code") ?? "").trim();
    const sourceUrl = String(formData.get("sourceUrl") ?? "").trim();
    const details = String(formData.get("details") ?? "").trim();
    const complianceConfirmed = formData.get("complianceConfirmed") === "on";

    if (!merchantName || !sourceUrl || !details) {
      return { success: false, error: "Please fill in all required fields." };
    }
    if (!complianceConfirmed) {
      return { success: false, error: "You must confirm compliance." };
    }

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from("source_pages").insert({
        url: sourceUrl,
        domain: new URL(sourceUrl).hostname.replace(/^www\./, ""),
        page_title: merchantName,
        anchor_text: code || undefined,
        raw_offer_text: details,
        review_status: "new"
      });
      if (error) {
        return { success: false, error: error.message };
      }
    }

    return {
      success: true,
      message:
        "Source submitted for review. Our team will verify it within 3 business days. Thank you for contributing!"
    };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Something went wrong." };
  }
}
