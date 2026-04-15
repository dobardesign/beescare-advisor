"use client"

import { useState } from "react"
import { Globe, MapPin, Leaf } from "lucide-react"
import type { Lang } from "@/lib/language"
import { track } from "@/lib/analytics"

// ─── Store data ───────────────────────────────────────────────────────────────

interface Store {
  name: string
  address: string
}

const STORES: Record<string, Store[]> = {
  beograd: [
    { name: "Market Zdravlja",                  address: "Vatroslava Jagića 4, Vračar" },
    { name: "Biomarket zdrava hrana",            address: "Dečanska 21, Stari grad" },
    { name: "Zdrava hrana Bio Store",            address: "Jedanaeste Krajiške Divizije 68, Rakovica" },
    { name: "Aerodrom Nikola Tesla — Dufry",     address: "Aerodrom Beograd 59, Surčin" },
    { name: "Zdrava hrana Maffin 43",            address: "Bulevar Oslobođenja 63, Autokomanda" },
    { name: "Apoteka Zdravković",                address: "Uroša Martinovića 21, Novi Beograd" },
    { name: "Apoteka Zdravković",                address: "Svetosavska 95, Novi Banovci" },
    { name: "Apoteka Zdravković",                address: "Grčka 36, Stari Banovci" },
    { name: "Apoteka Zdravković",                address: "Mačvanska 15, Vračar" },
    { name: "Apoteka Zdravković",                address: "Pere Velimirovića 30b, Rakovica" },
    { name: "Apoteka Zdravković",                address: "Milutina Milankovića 34, Novi Beograd" },
    { name: "Zdrava hrana Healthy Jungle",       address: "Bulevar Despota Stefana 34a, Stari Grad" },
    { name: "Zdrava Hrana Milbo Premium",        address: "Bulevar Oslobođenja 63, Vračar" },
    { name: "Zdrava Hrana Srećni suncokret",     address: "Bulevar Zorana Đinđića 130, Novi Beograd" },
    { name: "Apoteka Beladona",                  address: "Saše Simeunovića 4, Voždovac" },
    { name: "Apoteka Srce",                      address: "Omladinskih brigada 86Ž, Novi Beograd" },
  ],
  kragujevac: [
    { name: "Apoteka DAR",  address: "Kralja Aleksandra I Karađorđevića 102" },
    { name: "Y BIO SHOP",   address: "Daničićeva 120" },
  ],
  novi_sad: [
    { name: "Nut Shop", address: "Dunavska 10, Stari Grad" },
  ],
  subotica: [
    { name: "Bio Box", address: "Matka Vukovića 9, Centar" },
  ],
  vranje: [
    { name: "Apoteka Beladona", address: "Kralja Stevana Prvovenčanog 32" },
  ],
  nis: [
    { name: "Apoteka Beladona",   address: "Zetska 4" },
    { name: "Apoteka Beladona",   address: "Kosovke devojke 37" },
    { name: "Apoteka Beladona",   address: "Vojvode Tankosića 32" },
    { name: "Apoteka Diomed S",   address: "Studenička 65" },
  ],
  bujanovac: [
    { name: "Apoteka Beladona", address: "Karađorđa Petrovića 215" },
  ],
}

const CITY_LABELS: Record<string, { sr: string; en: string }> = {
  beograd:    { sr: "Beograd",    en: "Belgrade" },
  kragujevac: { sr: "Kragujevac", en: "Kragujevac" },
  novi_sad:   { sr: "Novi Sad",   en: "Novi Sad" },
  subotica:   { sr: "Subotica",   en: "Subotica" },
  vranje:     { sr: "Vranje",     en: "Vranje" },
  nis:        { sr: "Niš",        en: "Niš" },
  bujanovac:  { sr: "Bujanovac",  en: "Bujanovac" },
}

// ─── Copy ─────────────────────────────────────────────────────────────────────

const COPY = {
  title:           { sr: "Gde kupiti",                                   en: "Where to buy" },
  online:          { sr: "Online prodavnica",                            en: "Online store" },
  onlineSub:       { sr: "Dostava u roku od 5 dana",                    en: "Delivery within 5 days" },
  cityLabel:       { sr: "Pronađi prodavnicu u svome gradu",            en: "Find a store in your city" },
  dropdownDefault: { sr: "Izaberi grad",                                 en: "Select city" },
  noStores:        { sr: "Nema prodajnih mesta u ovom gradu",            en: "No stores in this city" },
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WhereToBuyProps {
  lang: Lang
  source?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export function WhereToBuy({ lang, source = "chat" }: WhereToBuyProps) {
  const [selectedCity, setSelectedCity] = useState("")

  const t = (key: keyof typeof COPY) => COPY[key][lang]

  const stores = selectedCity ? (STORES[selectedCity] ?? []) : []

  function handleCityChange(city: string) {
    setSelectedCity(city)
    if (city) {
      track("city_selected", { city, source, lang })
    }
  }

  function handleOnlineClick() {
    track("online_store_clicked", { source, lang })
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Top divider ─────────────────────────────────────────────── */}
      <div className="border-t border-border-subtle w-full" />

      {/* ── Title ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <Leaf size={16} color="#c2986b" aria-hidden="true" />
        <h2 className="text-h2 font-sans font-medium leading-headline text-text-primary">
          {t("title")}
        </h2>
      </div>

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
      <div className="flex flex-col gap-3">
        <label className="text-paragraph-s font-sans font-medium leading-paragraph text-text-secondary">
          {t("cityLabel")}
        </label>

        {/* Native select styled to match design system */}
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

        {/* ── Store cards ─────────────────────────────────────────── */}
        {selectedCity && (
          stores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stores.map((store, i) => (
                <div
                  key={i}
                  className="bg-background-default border border-border-subtle rounded-alert px-3.5 py-3 flex items-start gap-2.5"
                >
                  <MapPin
                    size={14}
                    className="shrink-0 mt-0.5 text-border-brand"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <p className="text-label-m font-sans font-medium leading-label text-text-primary">
                      {store.name}
                    </p>
                    <p className="text-paragraph-s font-sans leading-paragraph text-text-secondary">
                      {store.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-paragraph-s font-sans leading-paragraph text-text-muted">
              {t("noStores")}
            </p>
          )
        )}
      </div>

    </div>
  )
}
