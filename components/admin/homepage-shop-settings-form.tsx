"use client";

import { Save, Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { siteSettingsSchema } from "@/lib/validations";
import type { SiteSettings } from "@/lib/site-settings";
import { formatMAD } from "@/lib/utils";

type ProductOption = {
  id: number;
  images: string[];
  isActive: boolean;
  name: string;
  price: number;
};

type HomepageShopSettingsFormProps = {
  initialSettings: SiteSettings;
  productOptions: ProductOption[];
};

export function HomepageShopSettingsForm({
  initialSettings,
  productOptions,
}: HomepageShopSettingsFormProps) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [bannerMessagesText, setBannerMessagesText] = useState(
    initialSettings.banner.messages.join("\n"),
  );
  const [saving, setSaving] = useState(false);

  const activeProducts = useMemo(
    () => productOptions.filter((product) => product.isActive),
    [productOptions],
  );

  const handleSave = async () => {
    const bannerMessages = bannerMessagesText
      .split("\n")
      .map((message) => message.trim())
      .filter((message) => message.length > 0);

    if (bannerMessages.length === 0) {
      toast.error("Add at least one banner message.");
      return;
    }

    const payload: SiteSettings = {
      ...settings,
      banner: {
        ...settings.banner,
        messages: bannerMessages,
      },
    };

    setSaving(true);

    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const raw: unknown = await response.json();

      if (!response.ok) {
        const errorMessage =
          typeof raw === "object" &&
          raw !== null &&
          "message" in raw &&
          typeof raw.message === "string"
            ? raw.message
            : "Failed to update homepage settings.";
        throw new Error(errorMessage);
      }

      const data = siteSettingsSchema.parse(raw);

      setSettings(data);
      setBannerMessagesText(data.banner.messages.join("\n"));
      toast.success("Homepage and shop settings updated.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const toggleProduct = (productId: number, checked: boolean) => {
    setSettings((current) => {
      const nextProductIds = checked
        ? [...current.newArrivals.productIds, productId]
        : current.newArrivals.productIds.filter((id) => id !== productId);

      return {
        ...current,
        newArrivals: {
          ...current.newArrivals,
          productIds: nextProductIds,
        },
      };
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold">
          <Settings2 className="h-4 w-4" />
          Homepage & Shop Settings
        </div>
        <CardTitle>Homepage & Shop Settings</CardTitle>
        <CardDescription>
          Control the announcement bar, hero, new arrivals block, and the mobile
          shop pagination behavior from one place.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <section className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
              Banner
            </h3>
            <p className="text-sm text-muted">
              Show or hide the black announcement bar and cycle through multiple
              messages.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-bg/60 px-4 py-3">
            <Switch
              checked={settings.banner.enabled}
              onCheckedChange={(checked) =>
                setSettings((current) => ({
                  ...current,
                  banner: {
                    ...current.banner,
                    enabled: checked,
                  },
                }))
              }
            />
            <span className="text-sm font-medium text-brand">
              {settings.banner.enabled ? "Banner visible" : "Banner hidden"}
            </span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="banner-messages">Messages (one per line)</Label>
            <Textarea
              id="banner-messages"
              onChange={(event) => setBannerMessagesText(event.target.value)}
              placeholder="Enjoy free shipping on all U.S. orders"
              value={bannerMessagesText}
            />
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
              Hero
            </h3>
            <p className="text-sm text-muted">
              Edit the hero image URL, headline, and both stacked buttons.
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero-background-url">Background Image URL</Label>
              <Input
                id="hero-background-url"
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      backgroundImageUrl: event.target.value,
                    },
                  }))
                }
                value={settings.hero.backgroundImageUrl}
              />
            </div>
            <ImageUploadField
              label="Upload Hero Background"
              max={1}
              onChange={(urls) =>
                setSettings((current) => ({
                  ...current,
                  hero: {
                    ...current.hero,
                    backgroundImageUrl: urls[0] ?? "",
                  },
                }))
              }
              single
              value={
                settings.hero.backgroundImageUrl
                  ? [settings.hero.backgroundImageUrl]
                  : []
              }
            />
            <div className="space-y-2">
              <Label htmlFor="hero-headline">Headline</Label>
              <Input
                id="hero-headline"
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      headline: event.target.value,
                    },
                  }))
                }
                value={settings.hero.headline}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hero-primary-label">Primary Button Label</Label>
                <Input
                  id="hero-primary-label"
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      hero: {
                        ...current.hero,
                        primaryButtonLabel: event.target.value,
                      },
                    }))
                  }
                  value={settings.hero.primaryButtonLabel}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-primary-link">Primary Button Link</Label>
                <Input
                  id="hero-primary-link"
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      hero: {
                        ...current.hero,
                        primaryButtonLink: event.target.value,
                      },
                    }))
                  }
                  value={settings.hero.primaryButtonLink}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-secondary-label">Secondary Button Label</Label>
                <Input
                  id="hero-secondary-label"
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      hero: {
                        ...current.hero,
                        secondaryButtonLabel: event.target.value,
                      },
                    }))
                  }
                  value={settings.hero.secondaryButtonLabel}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-secondary-link">Secondary Button Link</Label>
                <Input
                  id="hero-secondary-link"
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      hero: {
                        ...current.hero,
                        secondaryButtonLink: event.target.value,
                      },
                    }))
                  }
                  value={settings.hero.secondaryButtonLink}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
              New Arrivals
            </h3>
            <p className="text-sm text-muted">
              Choose how many newest products to show, or override the block with
              a manual selection.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-arrivals-mode">Display Mode</Label>
              <Select
                onValueChange={(value) =>
                  setSettings((current) => ({
                    ...current,
                    newArrivals: {
                      ...current.newArrivals,
                      mode: value === "manual" ? "manual" : "latest",
                    },
                  }))
                }
                value={settings.newArrivals.mode}
              >
                <SelectTrigger id="new-arrivals-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Newest products</SelectItem>
                  <SelectItem value="manual">Manual product picks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-arrivals-count">Count</Label>
              <Input
                id="new-arrivals-count"
                min={1}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    newArrivals: {
                      ...current.newArrivals,
                      count: Number(event.target.value) || 1,
                    },
                  }))
                }
                type="number"
                value={settings.newArrivals.count}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Manual Product Picks</Label>
            <ScrollArea className="h-64 rounded-lg border border-border bg-bg/40">
              <div className="space-y-3 p-4">
                {activeProducts.map((product) => (
                  <label
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-3 py-2 transition hover:border-border hover:bg-surface"
                    key={product.id}
                  >
                    <Checkbox
                      checked={settings.newArrivals.productIds.includes(product.id)}
                      onCheckedChange={(checked) =>
                        toggleProduct(product.id, checked === true)
                      }
                    />
                    <span className="space-y-1">
                      <span className="block text-sm font-medium text-brand">
                        {product.name}
                      </span>
                      <span className="block text-xs uppercase tracking-[0.14em] text-muted">
                        #{product.id} · {formatMAD(product.price)}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </ScrollArea>
            <p className="text-xs text-muted">
              Manual picks are used only when the display mode is set to manual.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
              Shop Page
            </h3>
            <p className="text-sm text-muted">
              Control the mobile column count and the number of products loaded
              per page.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="shop-products-per-page">Products Per Page</Label>
              <Input
                id="shop-products-per-page"
                min={1}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    shop: {
                      ...current.shop,
                      productsPerPage: Number(event.target.value) || 1,
                    },
                  }))
                }
                type="number"
                value={settings.shop.productsPerPage}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shop-mobile-columns">Mobile Columns</Label>
              <Select
                onValueChange={(value) =>
                  setSettings((current) => ({
                    ...current,
                    shop: {
                      ...current.shop,
                      mobileColumns: value === "1" ? 1 : 2,
                    },
                  }))
                }
                value={String(settings.shop.mobileColumns)}
              >
                <SelectTrigger id="shop-mobile-columns">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 column</SelectItem>
                  <SelectItem value="2">2 columns</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button disabled={saving} onClick={handleSave} type="button">
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
