"use client"

import { useState } from "react"
import { Globe, MapPin, LocateFixed, Loader2, ExternalLink } from "lucide-react"
import type { Lang } from "@/lib/language"
import { track } from "@/lib/analytics"

// ─── Store data ───────────────────────────────────────────────────────────────

interface Store {
  name: string
  address: string
  lat: number
  lon: number
}

interface NearestStore extends Store {
  distanceKm: number
}

const STORES: Record<string, Store[]> = {
  beograd: [
    { name: "Market Zdravlja",                address: "Vatroslava Jagića 4, Vračar",                         lat: 44.7988, lon: 20.4721 },
    { name: "Biomarket zdrava hrana",          address: "Dečanska 21, Stari grad",                             lat: 44.8125, lon: 20.4612 },
    { name: "Zdrava hrana Bio Store",          address: "Jedanaeste Krajiške Divizije 68, Rakovica",           lat: 44.7721, lon: 20.4234 },
    { name: "Aerodrom Nikola Tesla — Dufry",   address: "Aerodrom Beograd 59, Surčin",                        lat: 44.8184, lon: 20.2910 },
    { name: "Zdrava hrana Maffin 43",          address: "Bulevar Oslobođenja 63, Autokomanda",                 lat: 44.7856, lon: 20.4712 },
    { name: "Apoteka Zdravković",              address: "Uroša Martinovića 21, Novi Beograd",                  lat: 44.8065, lon: 20.4234 },
    { name: "Apoteka Zdravković",              address: "Svetosavska 95, Novi Banovci",                        lat: 44.9234, lon: 20.3456 },
    { name: "Apoteka Zdravković",              address: "Grčka 36, Stari Banovci",                             lat: 44.9123, lon: 20.3234 },
    { name: "Apoteka Zdravković",              address: "Mačvanska 15, Vračar",                                lat: 44.7934, lon: 20.4756 },
    { name: "Apoteka Zdravković",              address: "Pere Velimirovića 30b, Rakovica",                     lat: 44.7689, lon: 20.4123 },
    { name: "Apoteka Zdravković",              address: "Milutina Milankovića 34, Novi Beograd",               lat: 44.8134, lon: 20.4012 },
    { name: "Zdrava hrana Healthy Jungle",     address: "Bulevar Despota Stefana 34a, Stari Grad",             lat: 44.8178, lon: 20.4634 },
    { name: "Zdrava Hrana Milbo Premium",      address: "Bulevar Oslobođenja 63, Vračar",                      lat: 44.7867, lon: 20.4698 },
    { name: "Zdrava Hrana Srećni suncokret",   address: "Bulevar Zorana Đinđića 130, Novi Beograd",            lat: 44.8267, lon: 20.3934 },
    { name: "Apoteka Beladona",                address: "Saše Simeunovića 4, Voždovac",                        lat: 44.7712, lon: 20.4912 },
    { name: "Apoteka Srce",                    address: "Omladinskih brigada 86Ž, Novi Beograd",               lat: 44.8089, lon: 20.4156 },
  ],
  kragujevac: [
    { name: "Apoteka DAR",  address: "Kralja Aleksandra I Karađorđevića 102",  lat: 44.0134, lon: 20.9178 },
    { name: "Y BIO SHOP",   address: "Daničićeva 120",                          lat: 44.0089, lon: 20.9234 },
  ],
  novi_sad: [
    { name: "Nut Shop",  address: "Dunavska 10, Stari Grad",  lat: 45.2512, lon: 19.8478 },
  ],
  subotica: [
    { name: "Bio Box",  address: "Matka Vukovića 9, Centar",  lat: 46.1001, lon: 19.6678 },
  ],
  vranje: [
    { name: "Apoteka Beladona",  address: "Kralja Stevana Prvovenčanog 32",  lat: 42.5512, lon: 21.9001 },
  ],
  nis: [
    { name: "Apoteka Beladona",   address: "Zetska 4",                   lat: 43.3234, lon: 21.8956 },
    { name: "Apoteka Beladona",   address: "Kosovke devojke 37",          lat: 43.3189, lon: 21.9012 },
    { name: "Apoteka Beladona",   address: "Vojvode Tankosića 32",        lat: 43.3156, lon: 21.8934 },
    { name: "Apoteka Diomed S",   address: "Studenička 65",               lat: 43.3267, lon: 21.9089 },
  ],
  bujanovac: [
    { name: "Apoteka Beladona",  address: "Karađorđa Petrovića 215",  lat: 42.4612, lon: 21.7723 },
  ],
}

const ALL_STORES: Store[] = Object.values(STORES).flat()

const CITY_LABELS: Record<string, { sr: string; en: string }> = {
  beograd:    { sr: "Beograd",    en: "Belgrade" },
  kragujevac: { sr: "Kragujevac", en: "Kragujevac" },
  novi_sad:   { sr: "Novi Sad",   en: "Novi Sad" },
  subotica:   { sr: "Subotica",   en: "Subotica" },
  vranje:     { sr: "Vranje",     en: "Vranje" },
  nis:        { sr: "Niš",        en: "Niš" },
  bujanovac:  { sr: "Bujanovac",  en: "Bujanovac" },
}

// ─── Geo helpers ──────────────────────────────────────────────────────────────

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R    = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function getMapsUrl(name: string, address: string) {
  return `https://www.google.com/maps/search/${encodeURIComponent(`${name} ${address}`)}`
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

const COPY = {
  title:           { sr: "Gde kupiti",                                    en: "Where to buy" },
  online:          { sr: "Online prodavnica",                             en: "Online store" },
  onlineSub:       { sr: "Dostava u roku od 5 dana",                     en: "Delivery within 5 days" },
  cityLabel:       { sr: "Pronađi prodavnicu u svome gradu",             en: "Find a store in your city" },
  dropdownDefault: { sr: "Izaberi grad",                                  en: "Select city" },
  noStores:        { sr: "Nema prodajnih mesta u ovom gradu",             en: "No stores in this city" },
  findNearest:     { sr: "Pronađi najbližu prodavnicu",                  en: "Find nearest store" },
  findingLocation: { sr: "Tražimo najbliže prodavnice...",               en: "Finding nearest stores..." },
  locationDenied:  { sr: "Dozvoli pristup lokaciji u browseru",          en: "Allow location access in your browser" },
  nearestTitle:    { sr: "Najbliže prodavnice",                          en: "Nearest stores" },
  openMaps:        { sr: "Otvori na mapi →",                             en: "Open in maps →" },
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WhereToBuyProps {
  lang: Lang
  source?: string
}

// ─── Sub-component: store card ────────────────────────────────────────────────

function StoreCard({
  store,
  distanceKm,
  openMapsLabel,
}: {
  store: Store
  distanceKm?: number
  openMapsLabel: string
}) {
  return (
    <div className="bg-background-default border border-border-subtle rounded-alert px-3.5 py-3 flex flex-col gap-2">
      {/* Name + optional distance */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-label-m font-sans font-medium leading-label text-text-primary">
          {store.name}
        </p>
        {distanceKm !== undefined && (
          <span className="text-label-s font-sans leading-label text-border-brand whitespace-nowrap shrink-0">
            {distanceKm < 1
              ? `${Math.round(distanceKm * 1000)} m`
              : `${Math.round(distanceKm * 10) / 10} km`}
          </span>
        )}
      </div>

      {/* Address */}
      <div className="flex items-start gap-1.5">
        <MapPin size={13} className="shrink-0 mt-0.5 text-border-brand" aria-hidden="true" />
        <p className="text-paragraph-s font-sans leading-paragraph text-text-secondary">
          {store.address}
        </p>
      </div>

      {/* Maps link */}
      <a
        href={getMapsUrl(store.name, store.address)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-label-s font-sans font-medium leading-label text-border-brand no-underline hover:underline underline-offset-2 transition-colors duration-150 self-start"
      >
        {openMapsLabel}
      </a>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function WhereToBuy({ lang, source = "chat" }: WhereToBuyProps) {
  const [selectedCity, setSelectedCity]       = useState("")
  const [nearestStores, setNearestStores]     = useState<NearestStore[] | null>(null)
  const [geoLoading, setGeoLoading]           = useState(false)
  const [geoError, setGeoError]               = useState("")

  const t = (key: keyof typeof COPY) => COPY[key][lang]

  const cityStores = selectedCity ? (STORES[selectedCity] ?? []) : []

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleCityChange(city: string) {
    setSelectedCity(city)
    if (city) track("city_selected", { city, source, lang })
  }

  function handleOnlineClick() {
    track("online_store_clicked", { source, lang })
  }

  function handleFindNearest() {
    if (!navigator.geolocation) {
      setGeoError(t("locationDenied"))
      return
    }

    setGeoLoading(true)
    setGeoError("")
    track("nearest_store_requested", { source, lang })

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: userLat, longitude: userLon } = coords

        const ranked: NearestStore[] = ALL_STORES
          .map(store => ({
            ...store,
            distanceKm: getDistance(userLat, userLon, store.lat, store.lon),
          }))
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, 3)

        setNearestStores(ranked)
        setGeoLoading(false)

        if (ranked.length > 0) {
          track("nearest_store_found", {
            nearest_store: ranked[0].name,
            distance_km: Math.round(ranked[0].distanceKm * 10) / 10,
            lang,
          })
        }
      },
      () => {
        setGeoError(t("locationDenied"))
        setGeoLoading(false)
      },
      { timeout: 8000 },
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5">

      {/* ── Top divider ─────────────────────────────────────────────── */}
      <div className="border-t border-border-subtle w-full" />

      {/* ── Title ───────────────────────────────────────────────────── */}
      <h2 className="text-h2 font-sans font-medium leading-headline text-text-primary">
        {t("title")}
      </h2>

      {/* ── Online store ────────────────────────────────────────────── */}
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <Globe size={16} className="text-text-muted" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-0.5">
          <a
            href="https://beescare.rs/proizvodi/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOnlineClick}
            className="text-label-m font-sans font-medium leading-label text-border-brand no-underline hover:underline underline-offset-2 transition-colors duration-150"
          >
            {t("online")}
          </a>
          <span className="text-label-s font-sans leading-label text-text-muted">
            {t("onlineSub")}
          </span>
        </div>
      </div>

      {/* ── Inner divider ───────────────────────────────────────────── */}
      <div className="border-t border-border-subtle w-full" />

      {/* ── City finder ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <p className="text-paragraph-s font-sans font-medium leading-paragraph text-text-secondary">
          {t("cityLabel")}
        </p>

        {/* City dropdown */}
        <select
          value={selectedCity}
          onChange={e => handleCityChange(e.target.value)}
          className="w-full md:w-auto border border-border-subtle rounded-alert bg-background-default px-3 py-2.5 text-paragraph-s font-sans text-text-primary focus:outline-none focus:border-border-brand transition-colors duration-150 cursor-pointer appearance-none pr-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238c8885' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
          }}
        >
          <option value="">{t("dropdownDefault")}</option>
          {Object.keys(STORES).map(cityKey => (
            <option key={cityKey} value={cityKey}>
              {CITY_LABELS[cityKey][lang]}
            </option>
          ))}
        </select>

        {/* City store cards */}
        {selectedCity && (
          cityStores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cityStores.map((store, i) => (
                <StoreCard
                  key={i}
                  store={store}
                  openMapsLabel={t("openMaps")}
                />
              ))}
            </div>
          ) : (
            <p className="text-paragraph-s font-sans leading-paragraph text-text-muted">
              {t("noStores")}
            </p>
          )
        )}
      </div>

      {/* ── Inner divider ───────────────────────────────────────────── */}
      <div className="border-t border-border-subtle w-full" />

      {/* ── Geolocation ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">

        {/* "Find nearest" button */}
        <button
          type="button"
          onClick={handleFindNearest}
          disabled={geoLoading}
          className="inline-flex items-center gap-2 self-start border border-button-outline-border rounded-pill px-4 py-2 text-label-m font-sans font-medium leading-label text-text-primary hover:bg-interaction-hover active:bg-interaction-pressed transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {geoLoading ? (
            <Loader2 size={14} className="animate-spin text-text-muted" aria-hidden="true" />
          ) : (
            <LocateFixed size={14} className="text-border-brand" aria-hidden="true" />
          )}
          {geoLoading ? t("findingLocation") : t("findNearest")}
        </button>

        {/* Geo error */}
        {geoError && (
          <p className="text-paragraph-s font-sans leading-paragraph text-text-muted">
            {geoError}
          </p>
        )}

        {/* Nearest stores result */}
        {nearestStores && nearestStores.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-label-m font-sans font-medium leading-label text-text-secondary">
              {t("nearestTitle")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {nearestStores.map((store, i) => (
                <StoreCard
                  key={i}
                  store={store}
                  distanceKm={store.distanceKm}
                  openMapsLabel={t("openMaps")}
                />
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
