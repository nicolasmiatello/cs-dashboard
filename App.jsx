import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

/* ═══════════════════════════════════════════════════════════════════════════
   DATA — ARGENTINA FILL RATE
   ═══════════════════════════════════════════════════════════════════════════ */

const BOTTLER_COLORS = {
  femsa: "#E03E52",
  lee: "#CDC4AA",
  andina: "#F59E0B",
  arca: "#E87722",
  arg: "#E4AEB1",
};
const BM = { Femsa: BOTTLER_COLORS.femsa, Lee: BOTTLER_COLORS.lee, Andina: BOTTLER_COLORS.andina, Arca: BOTTLER_COLORS.arca };

const TR = {
  "TOTAL CANAL": [
    { m: "Ene'25", F: 85.6, L: 85.9, A: 78.7, AR: 83.3, T: 81.6 }, { m: "Feb'25", F: 89.7, L: 87.9, A: 79.6, AR: 86.9, T: 83.4 },
    { m: "Mar'25", F: 88.8, L: 91.7, A: 72.0, AR: 81.8, T: 78.6 }, { m: "Abr'25", F: 85.9, L: 90.5, A: 80.5, AR: 88.2, T: 83.9 },
    { m: "May'25", F: 89.2, L: 92.0, A: 86.1, AR: 86.3, T: 87.3 }, { m: "Jun'25", F: 93.8, L: 93.8, A: 87.9, AR: 89.4, T: 90.0 },
    { m: "Jul'25", F: 90.8, L: 91.6, A: 89.6, AR: 88.8, T: 89.9 }, { m: "Ago'25", F: 88.5, L: 92.5, A: 90.9, AR: 90.8, T: 90.2 },
    { m: "Sep'25", F: 84.4, L: 91.8, A: 82.5, AR: 90.0, T: 85.1 }, { m: "Oct'25", F: 85.0, L: 92.9, A: 86.0, AR: 84.6, T: 85.8 },
    { m: "Nov'25", F: 85.7, L: 91.2, A: 87.0, AR: 85.2, T: 86.5 }, { m: "Dic'25", F: 85.3, L: 93.8, A: 82.1, AR: 85.1, T: 84.3 },
    { m: "Ene'26", F: 86.5, L: 89.2, A: 81.6, AR: 79.0, T: 83.9 },
    { m: "Feb'26", F: 86.9, L: 89.8, A: 87.5, AR: 88.1, T: 87.4 },
    { m: "Mar'26", F: 84.9, L: 90.6, A: 90.4, AR: 88.4, T: 87.5 },
    { m: "Abr'26", F: 86.3, L: 91.4, A: 89.0, AR: 85.5, T: 87.3 },
    { m: "May'26", F: 88.9, L: 89.7, A: 91.9, AR: 86.8, T: 89.8 },
    { m: "Jun'26", F: 92.1, L: 89.7, A: 91.6, AR: 85.8, T: 90.6 },
    { m: "Jul'26", F: 87.3, L: 90.6, A: 90.7, AR: 87.6, T: 89.0 },
  ],
  GDN: [
    { m: "Ene'25", F: 83.5, L: 88.0, A: 82.0, AR: 82.0, T: 83.0 }, { m: "Feb'25", F: 87.0, L: 90.0, A: 84.0, AR: 85.0, T: 85.5 },
    { m: "Mar'25", F: 86.0, L: 92.0, A: 79.0, AR: 83.0, T: 83.0 }, { m: "Abr'25", F: 84.5, L: 91.0, A: 81.5, AR: 86.0, T: 84.0 },
    { m: "May'25", F: 88.0, L: 93.0, A: 85.0, AR: 87.0, T: 87.5 }, { m: "Jun'25", F: 92.0, L: 94.5, A: 87.0, AR: 89.0, T: 90.5 },
    { m: "Jul'25", F: 90.0, L: 92.5, A: 88.5, AR: 88.0, T: 89.5 }, { m: "Ago'25", F: 87.0, L: 93.0, A: 89.0, AR: 90.0, T: 89.5 },
    { m: "Sep'25", F: 83.0, L: 92.0, A: 82.0, AR: 89.5, T: 85.0 }, { m: "Oct'25", F: 84.0, L: 93.5, A: 85.0, AR: 84.0, T: 85.5 },
    { m: "Nov'25", F: 84.5, L: 92.0, A: 86.0, AR: 85.0, T: 86.0 }, { m: "Dic'25", F: 84.0, L: 93.5, A: 82.0, AR: 84.0, T: 84.0 },
    { m: "Ene'26", F: 85.9, L: 90.0, A: 83.7, AR: 85.8, T: 85.4 },
    { m: "Feb'26", F: 87.1, L: 88.5, A: 92.6, AR: 91.2, T: 89.9 },
    { m: "Mar'26", F: 88.1, L: 90.7, A: 91.0, AR: 89.2, T: 89.5 },
    { m: "Abr'26", F: 84.8, L: 89.5, A: 87.5, AR: 85.2, T: 85.8 },
    { m: "May'26", F: 86.1, L: 86.2, A: 91.8, AR: 85.1, T: 87.3 },
    { m: "Jun'26", F: 90.1, L: 87.3, A: 88.1, AR: 87.3, T: 88.2 },
    { m: "Jul'26", F: 87.3, L: 86.8, A: 92.4, AR: 86.5, T: 88.7 },
  ],
  CRF: [
    { m: "Ene'25", F: 83.0, L: 87.0, A: 81.0, AR: 71.0, T: 81.6 }, { m: "Feb'25", F: 86.5, L: 89.0, A: 82.0, AR: 75.0, T: 82.5 },
    { m: "Mar'25", F: 84.0, L: 90.5, A: 75.0, AR: 72.0, T: 79.0 }, { m: "Abr'25", F: 83.5, L: 89.0, A: 80.0, AR: 76.0, T: 82.0 },
    { m: "May'25", F: 87.0, L: 91.0, A: 85.0, AR: 78.0, T: 85.0 }, { m: "Jun'25", F: 91.5, L: 92.5, A: 86.5, AR: 80.0, T: 88.5 },
    { m: "Jul'25", F: 90.8, L: 91.8, A: 88.2, AR: 87.1, T: 89.8 }, { m: "Ago'25", F: 86.5, L: 91.5, A: 89.0, AR: 80.5, T: 87.0 },
    { m: "Sep'25", F: 83.5, L: 90.0, A: 82.5, AR: 80.0, T: 84.0 }, { m: "Oct'25", F: 84.0, L: 92.0, A: 85.0, AR: 75.0, T: 84.5 },
    { m: "Nov'25", F: 84.5, L: 91.0, A: 85.5, AR: 74.0, T: 84.5 }, { m: "Dic'25", F: 84.5, L: 92.0, A: 83.5, AR: 73.0, T: 83.5 },
    { m: "Ene'26", F: 86.0, L: 88.6, A: 86.5, AR: 74.4, T: 85.3 },
    { m: "Feb'26", F: 85.1, L: 89.0, A: 88.2, AR: 87.9, T: 86.7 },
    { m: "Mar'26", F: 85.1, L: 89.0, A: 88.2, AR: 87.9, T: 86.7 },
    { m: "Abr'26", F: 89.2, L: 88.1, A: 86.6, AR: 87.6, T: 88.2 },
    { m: "May'26", F: 89.3, L: 90.3, A: 91.6, AR: 89.3, T: 90.1 },
    { m: "Jun'26", F: 91.9, L: 85.6, A: 87.8, AR: 89.7, T: 90.1 },
    { m: "Jul'26", F: 85.2, L: 91.4, A: 88.9, AR: 89.0, T: 87.1 },
  ],
  CENCOSUD: [
    { m: "Ene'25", F: 88.0, L: 88.0, A: 76.0, AR: 78.0, T: 82.7 }, { m: "Jun'25", F: 93.5, L: 93.5, A: 83.0, AR: 84.5, T: 89.5 },
    { m: "Sep'25", F: 88.5, L: 92.0, A: 79.5, AR: 84.0, T: 85.5 }, { m: "Dic'25", F: 91.0, L: 93.0, A: 78.5, AR: 80.5, T: 85.0 },
    { m: "Ene'26", F: 92.1, L: 90.1, A: 77.9, AR: 79.3, T: 84.1 },
    { m: "Feb'26", F: 93.6, L: 84.7, A: 89.2, AR: 91.8, T: 87.5 },
    { m: "Mar'26", F: 94.8, L: 89.9, A: 92.7, AR: 89.5, T: 92.8 },
    { m: "Abr'26", F: 91.4, L: 85.1, A: 92.0, AR: 92.7, T: 90.8 },
    { m: "May'26", F: 88.9, L: 89.1, A: 90.8, AR: 88.1, T: 89.6 },
    { m: "Jun'26", F: 93.6, L: 92.8, A: 96.2, AR: 89.8, T: 94.0 },
    { m: "Jul'26", F: 94.6, L: 90.8, A: 90.3, AR: 88.6, T: 91.5 },
  ],
  "LA ANONIMA": [{ m: "Ene'25", F: null, L: null, A: 76.0, AR: null, T: 76.0 }, { m: "Ene'26", F: 97.8, L: null, A: 78.3, AR: null, T: 78.4 }, { m: "Feb'26", F: 77.4, L: null, A: 84.0, AR: 90.1, T: 84.0 }, { m: "Mar'26", F: 90.2, L: null, A: 89.5, AR: 90.1, T: 89.5 }, { m: "Abr'26", F: 96.7, L: null, A: 87.1, AR: 74.0, T: 86.3 }, { m: "May'26", F: 84.5, L: null, A: 93.1, AR: 61.8, T: 93.1 }, { m: "Jun'26", F: 90.6, L: null, A: 93.9, AR: 53.7, T: 88.6 }, { m: "Jul'26", F: 94.3, L: null, A: 92.4, AR: 76.2, T: 92.4 }],
  DIA: [{ m: "Ene'26", F: 84.7, L: null, A: null, AR: null, T: 84.7 }, { m: "Feb'26", F: 85.3, L: null, A: null, AR: null, T: 85.3 }, { m: "Mar'26", F: 77.7, L: 94.2, A: null, AR: null, T: 79.3 }, { m: "Abr'26", F: 77.7, L: 94.2, A: null, AR: null, T: 79.3 }, { m: "May'26", F: null, L: 90.7, A: null, AR: null, T: 90.7 }, { m: "Jun'26", F: null, L: 93.8, A: null, AR: null, T: 93.8 }, { m: "Jul'26", F: null, L: 91.9, A: null, AR: null, T: 91.9 }],
};

const YTD = {
  "TOTAL CANAL": { F: 87.5, L: 90.1, A: 88.5, AR: 86.0, T: 87.8 },
  GDN: { F: 87.2, L: 88.5, A: 89.5, AR: 87.5, T: 88.2 },
  CRF: { F: 87.7, L: 89.1, A: 88.3, AR: 85.8, T: 87.8 },
  CENCOSUD: { F: 92.8, L: 88.0, A: 89.3, AR: 90.2, T: 90.4 },
  "LA ANONIMA": { F: 80.0, A: 87.9, AR: 68.2, T: 86.7 },
  DIA: { F: 81.9, L: 93.5, T: 83.1 },
};

const LS = [
  { k: "F", lb: "Femsa", c: BOTTLER_COLORS.femsa },
  { k: "L", lb: "Reg. Lee", c: BOTTLER_COLORS.lee },
  { k: "A", lb: "Andina", c: BOTTLER_COLORS.andina },
  { k: "AR", lb: "Arca", c: BOTTLER_COLORS.arca },
  { k: "T", lb: "ARG", c: BOTTLER_COLORS.arg },
];

const BAR_DATA = {
  ARG: [{ n: "GDN", a: 88.7, b: 88.2 }, { n: "CRF", a: 87.1, b: 90.1 }, { n: "Cencosud", a: 91.5, b: 94.0 }, { n: "La Anonima", a: 92.4, b: 88.6 }, { n: "Dia", a: 91.9, b: 93.8 }],
  FEMSA: [{ n: "GDN", a: 87.3, b: 90.1 }, { n: "CRF", a: 85.2, b: 91.9 }, { n: "Cencosud", a: 94.6, b: 93.6 }, { n: "La Anonima", a: 94.3, b: 90.6 }, { n: "Dia", a: null, b: null }],
  LEE: [{ n: "GDN", a: 86.8, b: 87.3 }, { n: "CRF", a: 91.4, b: 85.6 }, { n: "Cencosud", a: 90.8, b: 92.8 }, { n: "La Anonima", a: null, b: null }, { n: "Dia", a: 91.9, b: 93.8 }],
  ANDINA: [{ n: "GDN", a: 92.4, b: 88.1 }, { n: "CRF", a: 88.9, b: 87.8 }, { n: "Cencosud", a: 90.3, b: 96.2 }, { n: "La Anonima", a: 92.4, b: 93.9 }, { n: "Dia", a: null, b: null }],
  ARCA: [{ n: "GDN", a: 86.5, b: 87.3 }, { n: "CRF", a: 89.0, b: 89.7 }, { n: "Cencosud", a: 88.6, b: 89.8 }, { n: "La Anonima", a: 76.2, b: 53.7 }, { n: "Dia", a: null, b: null }],
};

const RNK = [
  { c: "Cencosud", f: 91.5, p: 94.0, b: { Femsa: 94.6, Andina: 90.3, Lee: 90.8, Arca: 88.6 } },
  { c: "La Anonima", f: 92.4, p: 88.6, b: { Femsa: 94.3, Andina: 92.4, Arca: 76.2 } },
  { c: "Dia", f: 91.9, p: 93.8, b: { Lee: 91.9 } },
  { c: "GDN", f: 88.7, p: 88.2, b: { Femsa: 87.3, Andina: 92.4, Lee: 86.8, Arca: 86.5 } },
  { c: "CRF", f: 87.1, p: 90.1, b: { Femsa: 85.2, Andina: 88.9, Lee: 91.4, Arca: 89.0 } },
].sort((a, b) => b.f - a.f);

const DLT = [{ n: "Andina", d: 1.1, c: BOTTLER_COLORS.andina }, { n: "Lee", d: -1.0, c: BOTTLER_COLORS.lee }, { n: "ARG", d: -0.9, c: BOTTLER_COLORS.arg }, { n: "Arca", d: -1.2, c: BOTTLER_COLORS.arca }, { n: "Femsa", d: -3.5, c: BOTTLER_COLORS.femsa }];

const BYTD = [
  { n: "Reg. Lee", v: 90.1, c: BOTTLER_COLORS.lee, s: { GDN: 88.5, CRF: 89.1, Cencosud: 88.0, Dia: 93.5 } },
  { n: "Andina", v: 88.5, c: BOTTLER_COLORS.andina, s: { GDN: 89.5, CRF: 88.3, Cencosud: 89.3, "La An.": 87.9 } },
  { n: "ARG Total", v: 87.8, c: BOTTLER_COLORS.arg, s: { GDN: 88.2, CRF: 87.8, Cencosud: 90.4, "La An.": 86.7, Dia: 83.1 } },
  { n: "Femsa", v: 87.5, c: BOTTLER_COLORS.femsa, s: { GDN: 87.2, CRF: 87.7, Cencosud: 92.8, "La An.": 80.0, Dia: 81.9 } },
  { n: "Arca", v: 86.0, c: BOTTLER_COLORS.arca, s: { GDN: 87.5, CRF: 85.8, Cencosud: 90.2, "La An.": 68.2 } },
];
const CYTD = [
  { n: "Cencosud", v: 90.4, c: "#E8002D", s: { Femsa: 92.8, Andina: 89.3, Lee: 88.0, Arca: 90.2 } },
  { n: "GDN", v: 88.2, c: "#E8002D", s: { Femsa: 87.2, Andina: 89.5, Lee: 88.5, Arca: 87.5 } },
  { n: "CRF", v: 87.8, c: "#E8002D", s: { Femsa: 87.7, Andina: 88.3, Lee: 89.1, Arca: 85.8 } },
  { n: "La Anonima", v: 86.7, c: "#E8002D", s: { Femsa: 80.0, Andina: 87.9, Arca: 68.2 } },
  { n: "Dia", v: 83.1, c: "#E8002D", s: { Femsa: 81.9, Lee: 93.5 } },
];

// Category data
const CATS = ["Aguas Plain", "Aguas Saborizadas", "Energizantes", "Gaseosas", "Isotónicas", "Jugos"];
const BOTS = ["Femsa", "Andina", "Lee", "Arca"];
const CLIENTS = ["Cencosud", "GDN", "CRF", "La Anonima"];

const CAT_FR = {
  Cencosud: {
    ene: {
      Cencosud: { AP: 92.4, AS: 69.5, EN: 64.8, GA: 87.1, IS: 91.9, JU: 74.5, TOT: 84.1 },
      Andina: { AP: 78.8, AS: 68.2, EN: 54.9, GA: 83.9, IS: 91.9, JU: 63.9, TOT: 77.9 },
      Arca: { AP: 92.5, AS: 29.3, EN: 95.2, GA: 82.9, IS: 94.1, JU: 88.5, TOT: 79.3 },
      Lee: { AP: 90.3, AS: 94.3, EN: 70.2, GA: 90.4, IS: 87.1, JU: 92.2, TOT: 90.1 },
      Femsa: { AP: 95.8, AS: 92.7, EN: 84.5, GA: 91.8, IS: 92.3, JU: 89.2, TOT: 92.1 },
    },
    feb: {
      Cencosud: { AP: 89.6, AS: 73.4, EN: 81.3, GA: 90.2, IS: 94.1, JU: 83.6, TOT: 87.9 },
      Andina: { AP: 90.5, AS: 79.5, EN: 79.9, GA: 92.7, IS: 95.0, JU: 80.1, TOT: 89.2 },
      Arca: { AP: 89.7, AS: 60.0, EN: 97.0, GA: 85.1, IS: 93.1, JU: 91.8, TOT: 84.8 },
      Lee: { AP: 86.8, AS: 96.6, EN: 72.1, GA: 93.6, IS: 89.4, JU: 83.9, TOT: 91.8 },
    },
    mar: {
      Andina: { AP: 91.2, AS: 90.2, EN: 94.0, GA: 92.6, IS: 93.9, JU: 93.8 },
      Arca:   { AP: 95.0, AS: 80.4, EN: 98.6, GA: 89.4, IS: 87.1, JU: 93.1 },
      Femsa:  { AP: 96.8, AS: 94.5, EN: 97.5, GA: 94.4, IS: 90.0, JU: 96.7 },
      Lee:    { AP: 94.7, AS: 95.3, EN: 85.3, GA: 90.2, IS: 89.0, JU: 75.5 },
    },
    abr: {
      Andina: { AP: 91.1, AS: 93.3, EN: 93.2, GA: 92.0, IS: 94.1, JU: 91.5 },
      Arca:   { AP: 92.4, AS: 91.1, EN: 95.9, GA: 83.5, IS: 88.2, JU: 84.9 },
      Femsa:  { AP: 98.3, AS: 86.6, EN: 92.7, GA: 89.9, IS: 84.4, JU: 96.8 },
      Lee:    { AP: 95.6, AS: 96.1, EN: 98.1, GA: 94.5, IS: 91.9, JU: 71.9 },
    },
    may: {
      Andina: { AP: 93.9, AS: 91.6, EN: 94.4, GA: 90.7, IS: 87.0, JU: 90.8 },
      Arca:   { AP: 89.8, AS: 79.2, EN: 94.8, GA: 89.9, IS: 87.7, JU: 86.1 },
      Femsa:  { AP: 88.7, AS: 90.5, EN: 89.0, GA: 88.8, IS: 91.9, JU: 88.3 },
      Lee:    { AP: 92.8, AS: 93.3, EN: 97.4, GA: 88.6, IS: 78.0, JU: 77.4 },
    },
    jun: {
      Andina: { AP: 98.0, AS: 94.6, EN: 96.6, GA: 96.4, IS: 93.9, JU: 95.0 },
      Arca:   { AP: 92.9, AS: 82.8, EN: 98.5, GA: 93.3, IS: 93.4, JU: 92.8 },
      Femsa:  { AP: 93.4, AS: 94.9, EN: 97.4, GA: 93.3, IS: 95.6, JU: 93.5 },
      Lee:    { AP: 97.3, AS: 99.5, EN: 95.6, GA: 91.4, IS: 72.7, JU: 66.1 },
    },
    jul: {
      Andina: { AP: 87.2, AS: 92.6, EN: 95.6, GA: 90.5, IS: 83.6, JU: 86.0, TOT: 90.3, ISv: 93.2, DOH: 22.2 },
      Arca:   { AP: 91.5, AS: 80.9, EN: 99.2, GA: 90.9, IS: 88.2, JU: 93.4, TOT: 90.8, ISv: 92.2, DOH: 15.6 },
      Femsa:  { AP: 92.3, AS: 95.5, EN: 94.0, GA: 94.7, IS: 98.4, JU: 95.7, TOT: 94.6, ISv: 94.2, DOH: 20.2 },
      Lee:    { AP: 72.4, AS: 98.1, EN: 100.0, GA: 87.9, IS: 86.0, JU: 92.6, TOT: 88.6, ISv: 93.3, DOH: 21.4 },
    },
  },
  GDN: {
    ene: {
      Femsa:  { AP: 77.7, AS: 88.8, EN: 79.2, GA: 86.5, IS: 87.2, JU: 71.6 },
      Andina: { AP: 73.9, AS: 82.9, EN: 89.1, GA: 84.3, IS: 92.1, JU: 76.5 },
      Lee:    { AP: 82.6, AS: 98.0, EN: 85.2, GA: 88.4, IS: 86.0, JU: 95.7 },
      Arca:   { AP: 90.1, AS: 98.0, EN: 84.4, GA: 86.2, IS: 89.6, JU: 94.7 },
    },
    feb: {
      Femsa:  { AP: 84.5, AS: 93.5, EN: 55.7, GA: 74.1, IS: 45.6, JU: 63.4 },
      Andina: { AP: 95.2, AS: 90.8, EN: 86.3, GA: 93.6, IS: 94.3, JU: 89.6 },
      Lee:    { AP: 77.1, AS: 95.8, EN: 100.0, GA: 91.1, IS: 98.8, JU: 70.4 },
      Arca:   { AP: 95.2, AS: 93.1, EN: 91.8, GA: 90.4, IS: 95.9, JU: 92.8 },
    },
    mar: {
      Femsa:  { AP: 92.5, AS: 97.5, EN: 84.8, GA: 79.2, IS: 67.0, JU: 69.1 },
      Andina: { AP: 91.7, AS: 97.5, EN: 90.0, GA: 91.7, IS: 91.5, JU: 89.5 },
      Lee:    { AP: 97.6, AS: 99.3, EN: 96.0, GA: 90.9, IS: 96.7, JU: 97.9 },
      Arca:   { AP: 97.5, AS: 91.2, EN: 99.5, GA: 91.8, IS: 91.2, JU: 88.6 },
    },
    abr: {
      Femsa:  { AP: 75.0, AS: 97.3, EN: 68.6, GA: 68.5, IS: 56.1, JU: 78.6 },
      Andina: { AP: 89.2, AS: 86.0, EN: 84.3, GA: 88.1, IS: 79.2, JU: 87.0 },
      Lee:    { AP: 86.8, AS: 92.3, EN: 74.9, GA: 90.7, IS: 74.2, JU: 74.2 },
      Arca:   { AP: 90.9, AS: 84.2, EN: 90.8, GA: 84.4, IS: 90.3, JU: 85.2 },
    },
    may: {
      Femsa:  { AP: 94.7, AS: 79.8, EN: 99.5, GA: 89.1, IS: 99.8, JU: 97.0 },
      Andina: { AP: 80.3, AS: 90.3, EN: 92.5, GA: 91.8, IS: 89.0, JU: 93.2 },
      Lee:    { AP: 82.9, AS: 69.1, EN: 84.8, GA: 91.4, IS: 74.9, JU: 66.4 },
      Arca:   { AP: 97.7, AS: 83.4, EN: 97.5, GA: 83.8, IS: 82.0, JU: 84.0 },
    },
    jun: {
      Femsa:  { AP: 90.9, AS: 91.1, EN: 97.7, GA: 87.8, IS: 98.6, JU: 91.8 },
      Andina: { AP: 93.5, AS: 94.8, EN: 94.4, GA: 89.4, IS: 92.5, JU: 95.1 },
      Lee:    { AP: 94.0, AS: 95.4, EN: 100.0, GA: 88.9, IS: 70.3, JU: 69.3 },
      Arca:   { AP: 94.5, AS: 95.1, EN: 93.0, GA: 85.0, IS: 94.7, JU: 87.9 },
    },
    jul: {
      Femsa:  { AP: 98.3, AS: 99.9, EN: 86.4, GA: 86.7, IS: 97.2, JU: 75.4, TOT: 86.7, ISv: 97.3, DOH: 52.4 },
      Andina: { AP: 78.4, AS: 95.7, EN: 94.0, GA: 91.2, IS: 100.0, JU: 88.0, TOT: 92.4, ISv: 93.8, DOH: 42.0 },
      Lee:    { AP: 92.8, AS: 95.1, EN: 100.0, GA: 83.1, IS: 100.0, JU: 96.3, TOT: 86.8, ISv: 96.3, DOH: 51.5 },
      Arca:   { AP: 95.0, AS: 91.8, EN: 99.9, GA: 91.2, IS: 99.8, JU: 98.2, TOT: 86.5, ISv: 94.9, DOH: 39.1 },
    },
  },
  CRF: {
    ene: {
      Femsa:  { AP: 91.7, AS: 92.4, EN: 87.5, GA: 83.8, IS: 79.6, JU: 84.4 },
      Andina: { AP: 78.3, AS: 76.7, EN: 89.5, GA: 88.9, IS: 85.2, JU: 78.9 },
      Lee:    { AP: 89.6, AS: 85.6, EN: 94.0, GA: 88.1, IS: 79.5, JU: 94.6 },
      Arca:   { AP: 97.9, AS: 77.9, EN: 89.4, GA: 67.0, IS: 90.1, JU: 91.1 },
    },
    feb: {
      Femsa:  { AP: 94.8, AS: 95.0, EN: 95.5, GA: 88.4, IS: 46.1, JU: 78.7 },
      Andina: { AP: 86.1, AS: 79.8, EN: 81.5, GA: 90.0, IS: 90.4, JU: 82.2 },
      Lee:    { AP: 93.7, AS: 95.8, EN: 91.7, GA: 89.3, IS: 98.1, JU: 73.6 },
      Arca:   { AP: 96.2, AS: 90.0, EN: 84.0, GA: 85.8, IS: 92.4, JU: 90.6 },
    },
    mar: {
      Femsa:  { AP: 93.9, AS: 83.7, EN: 87.6, GA: 81.4, IS: 60.7, JU: 95.1 },
      Andina: { AP: 92.4, AS: 92.8, EN: 89.1, GA: 91.4, IS: 91.6, JU: 91.2 },
      Lee:    { AP: 94.4, AS: 95.1, EN: 89.3, GA: 92.0, IS: 80.1, JU: 93.0 },
      Arca:   { AP: 85.7, AS: 88.7, EN: 83.0, GA: 78.5, IS: 93.0, JU: 92.1 },
    },
    abr: {
      Femsa:  { AP: 92.1, AS: 97.9, EN: 89.4, GA: 90.6, IS: 80.7, JU: 76.3 },
      Andina: { AP: 91.7, AS: 93.2, EN: 85.2, GA: 71.5, IS: 91.1, JU: 94.4 },
      Lee:    { AP: 87.7, AS: 95.1, EN: 89.2, GA: 90.0, IS: 72.8, JU: 85.2 },
      Arca:   { AP: 97.3, AS: 94.3, EN: 84.4, GA: 96.4, IS: 90.0, JU: 87.2 },
    },
    may: {
      Femsa:  { AP: 89.9, AS: 96.4, EN: 88.7, GA: 86.6, IS: 82.2, JU: 92.4 },
      Andina: { AP: 93.8, AS: 94.9, EN: 91.1, GA: 91.5, IS: 95.0, JU: 88.8 },
      Lee:    { AP: 92.8, AS: 96.7, EN: 90.7, GA: 91.8, IS: 72.0, JU: 95.7 },
      Arca:   { AP: 93.3, AS: 87.9, EN: 89.1, GA: 90.9, IS: 84.5, JU: 98.4 },
    },
    jun: {
      Femsa:  { AP: 91.9, AS: 96.9, EN: 95.1, GA: 91.3, IS: 94.5, JU: 83.7 },
      Andina: { AP: 90.9, AS: 90.5, EN: 53.1, GA: 88.8, IS: 84.9, JU: 90.1 },
      Lee:    { AP: 78.6, AS: 72.5, EN: 94.8, GA: 89.4, IS: 64.5, JU: 64.6 },
      Arca:   { AP: 95.5, AS: 91.2, EN: 97.0, GA: 88.1, IS: 93.2, JU: 91.6 },
    },
    jul: {
      Femsa:  { AP: 92.8, AS: 96.4, EN: 89.0, GA: 91.0, IS: 79.0, JU: 73.6, TOT: 90.1, ISv: 92.0, DOH: 16.0 },
      Andina: { AP: 91.1, AS: 95.1, EN: 82.9, GA: 88.9, IS: 80.6, JU: 89.9, TOT: 88.9, ISv: 93.7, DOH: 19.8 },
      Lee:    { AP: 83.8, AS: 94.8, EN: 94.5, GA: 91.0, IS: 96.0, JU: 90.9, TOT: 91.4, ISv: 91.3, DOH: 25.3 },
      Arca:   { AP: 88.9, AS: 91.5, EN: 93.4, GA: 89.0, IS: 84.1, JU: 90.0, TOT: 89.0, ISv: 92.2, DOH: 16.6 },
    },
  },
  "La Anonima": {
    ene: {
      Femsa:  { AP: 76.8, AS: 67.7, EN: 73.8, GA: 70.9, IS: 80.0, JU: 45.5 },
      Andina: { AP: 71.5, AS: 73.7, EN: 79.9, GA: 83.9, IS: 82.2, JU: 60.8 },
      Arca:   { AP: 31.0, AS: 88.7, EN: 76.9, GA: 61.1, IS: 100.0, JU: 79.3 },
    },
    feb: {
      Femsa:  { AP: 95.6, AS: 73.6, EN: 100.0, GA: 84.4, IS: 68.6, JU: 84.8 },
      Andina: { AP: 85.3, AS: 84.3, EN: 85.6,  GA: 92.7, IS: 100.0, JU: 70.9 },
      Arca:   { AP: 90.0, AS: 82.2, EN: 77.4,  GA: 75.3, IS: 100.0, JU: 82.3 },
    },
    mar: {
      Femsa:  { AP: 95.5, AS: 72.5, EN: 94.7, GA: 94.4, IS: 73.7, JU: 80.0 },
      Andina: { AP: 88.6, AS: 82.5, EN: 89.4, GA: 88.6, IS: 89.3, JU: 85.0 },
      Arca:   { AP: 90.3, AS: 85.2, EN: 84.7, GA: 91.8, IS: 100.0, JU: 79.9 },
    },
    abr: {
      Femsa:  { AP: 95.7, AS: 87.9, EN: 88.6, GA: 98.3, IS: 100.0, JU: 97.6 },
      Andina: { AP: 87.7, AS: 92.0, EN: 92.6, GA: 86.9, IS: 96.2,  JU: 87.9 },
      Arca:   { AP: 91.4, AS: 61.7, EN: 95.9, GA: 74.0, IS: 79.5,  JU: 71.9 },
    },
    may: {
      Femsa:  { AP: 97.0, AS: 57.3, EN: 100.0, GA: 88.1, IS: 100.0, JU: 31.2 },
      Andina: { AP: 88.6, AS: 95.1, EN: 94.5,  GA: 90.6, IS: 83.7,  JU: 92.8 },
      Arca:   { AP: 81.3, AS: 74.3, EN: 88.3,  GA: 57.9, IS: 78.4,  JU: 74.4 },
    },
    jun: {
      Femsa:  { AP: 94.9, AS: 81.7, EN: 100.0, GA: 93.6, IS: 100.0, JU: 78.4 },
      Andina: { AP: 90.2, AS: 93.7, EN: 94.3,  GA: 90.1, IS: 89.2,  JU: 90.1 },
      Arca:   { AP: 69.2, AS: 44.6, EN: 47.7,  GA: 55.0, IS: 30.5,  JU: 61.2 },
    },
    jul: {
      Femsa:  { AP: 100.0, AS: 75.0, EN: 100.0, GA: 96.1, IS: 100.0, JU: 77.4, TOT: 94.3, ISv: 97.8, DOH: 18.1 },
      Andina: { AP: 74.7,  AS: 82.2, EN: 83.1,  GA: 81.9, IS: 80.7,  JU: 77.6, TOT: 81.2, ISv: 96.6, DOH: 14.5 },
      Arca:   { AP: 82.2,  AS: 67.9, EN: 69.1,  GA: 76.0, IS: 73.2,  JU: 77.9, TOT: 76.3, ISv: 96.7, DOH: 20.8 },
    },
  },
}

const CAT_IS = {
  Cencosud: {
    ene: {
      Cencosud: { AP: 91.4, AS: 89.7, EN: 91.4, GA: 89.2, IS: 95.8, JU: 89.4, TOT: 90.2 },
      Andina: { AP: 91.7, AS: 89.2, EN: 89.6, GA: 90.0, IS: 97.8, JU: 90.6, TOT: 90.7 },
      Arca: { AP: 94.1, AS: 85.2, EN: 95.7, GA: 90.6, IS: 97.4, JU: 91.2, TOT: 90.8 },
      Femsa: { AP: 90.4, AS: 90.8, EN: 92.8, GA: 86.6, IS: 92.3, JU: 84.8, TOT: 88.3 },
      Lee: { AP: 89.9, AS: 95.9, EN: 88.9, GA: 91.3, IS: 97.2, JU: 90.5, TOT: 92.1 },
    },
    feb: {
      Cencosud: { AP: 91.5, AS: 90.5, EN: 93.4, GA: 90.8, IS: 95.0, JU: 90.9, TOT: 91.3 },
      Andina: { AP: 92.7, AS: 90.5, EN: 93.3, GA: 91.3, IS: 97.5, JU: 91.1, TOT: 91.8 },
      Arca: { AP: 92.4, AS: 88.6, EN: 94.8, GA: 92.1, IS: 95.7, JU: 92.5, TOT: 92.0 },
      Femsa: { AP: 91.0, AS: 90.1, EN: 94.0, GA: 89.6, IS: 90.1, JU: 89.1, TOT: 90.1 },
      Lee: { AP: 87.6, AS: 95.0, EN: 89.9, GA: 90.2, IS: 98.4, JU: 90.6, TOT: 91.6 },
    },
    mar: {
      Andina: { AP: 92.0, AS: 90.7, EN: 87.4, GA: 91.9, IS: 97.6, JU: 91.5 },
      Arca:   { AP: 95.0, AS: 94.3, EN: 96.1, GA: 93.4, IS: 97.1, JU: 93.5 },
      Femsa:  { AP: 93.3, AS: 90.5, EN: 94.8, GA: 91.2, IS: 90.6, JU: 90.8 },
      Lee:    { AP: 87.5, AS: 94.5, EN: 91.5, GA: 89.9, IS: 97.9, JU: 90.7 },
    },
    abr: {
      Andina: { AP: 93.3, AS: 92.3, EN: 90.8, GA: 92.5, IS: 98.0, JU: 92.7 },
      Arca:   { AP: 95.1, AS: 94.7, EN: 96.4, GA: 90.7, IS: 98.5, JU: 91.9 },
      Femsa:  { AP: 93.7, AS: 87.9, EN: 96.5, GA: 90.7, IS: 95.3, JU: 90.0 },
      Lee:    { AP: 88.4, AS: 94.5, EN: 91.5, GA: 89.1, IS: 94.8, JU: 89.8 },
    },
    may: {
      Andina: { AP: 95.1, AS: 93.8, EN: 93.8, GA: 92.2, IS: 97.4, JU: 93.1 },
      Arca:   { AP: 94.6, AS: 94.7, EN: 95.2, GA: 90.3, IS: 97.9, JU: 90.7 },
      Femsa:  { AP: 91.0, AS: 88.9, EN: 94.4, GA: 88.8, IS: 95.4, JU: 90.4 },
      Lee:    { AP: 87.1, AS: 91.8, EN: 88.2, GA: 89.1, IS: 90.6, JU: 88.9 },
    },
    jun: {
      Andina: { AP: 95.2, AS: 94.1, EN: 94.5, GA: 92.6, IS: 97.9, JU: 93.1 },
      Arca:   { AP: 95.3, AS: 93.3, EN: 97.4, GA: 90.0, IS: 97.8, JU: 91.6 },
      Femsa:  { AP: 93.3, AS: 91.8, EN: 95.5, GA: 92.6, IS: 96.1, JU: 90.1 },
      Lee:    { AP: 88.8, AS: 97.4, EN: 90.8, GA: 93.6, IS: 90.1, JU: 89.8 },
    },
    jul: {
      Andina: { AP: 94.8, AS: 94.0, EN: 95.4, GA: 91.7, IS: 97.8, JU: 92.6, TOT: 93.2 },
      Arca:   { AP: 94.6, AS: 96.9, EN: 95.5, GA: 84.1, IS: 97.1, JU: 91.5, TOT: 88.5 },
      Femsa:  { AP: 93.8, AS: 94.0, EN: 96.7, GA: 94.6, IS: 96.1, JU: 91.8, TOT: 94.2 },
      Lee:    { AP: 88.8, AS: 97.4, EN: 91.9, GA: 94.0, IS: 90.6, JU: 91.8, TOT: 93.3 },
    },
  },
  GDN: {
    ene: {
      Femsa:  { AP: 93.3, AS: 88.7, EN: 83.1, GA: 80.5, IS: 71.7, JU: 84.6 },
      Andina: { AP: 94.1, AS: 85.6, EN: 93.8, GA: 81.2, IS: 97.4, JU: 93.1 },
      Lee:    { AP: 96.0, AS: 98.4, EN: 89.6, GA: 93.0, IS: 95.9, JU: 95.4 },
      Arca:   { AP: 99.0, AS: 98.4, EN: 99.4, GA: 99.0, IS: 99.0, JU: 96.7 },
    },
    feb: {
      Femsa:  { AP: 96.4, AS: 93.5, EN: 91.1, GA: 86.8, IS: 93.4, JU: 91.0 },
      Andina: { AP: 97.5, AS: 87.1, EN: 96.9, GA: 85.8, IS: 97.8, JU: 93.5 },
      Lee:    { AP: 97.8, AS: 99.3, EN: 97.5, GA: 93.6, IS: 98.8, JU: 98.3 },
      Arca:   { AP: 98.5, AS: 90.9, EN: 99.5, GA: 91.4, IS: 98.2, JU: 92.1 },
    },
    mar: {
      Femsa:  { AP: 96.4, AS: 93.5, EN: 88.0, GA: 84.4, IS: 90.7, JU: 89.2 },
      Andina: { AP: 97.5, AS: 95.5, EN: 96.9, GA: 85.8, IS: 96.2, JU: 93.5 },
      Lee:    { AP: 97.8, AS: 99.3, EN: 96.0, GA: 93.6, IS: 96.6, JU: 97.9 },
      Arca:   { AP: 98.5, AS: 99.3, EN: 99.5, GA: 88.6, IS: 89.2, JU: 90.8 },
    },
    abr: {
      Femsa:  { AP: 96.8, AS: 92.7, EN: 92.7, GA: 80.4, IS: 91.1, JU: 91.6 },
      Andina: { AP: 97.7, AS: 97.3, EN: 97.1, GA: 89.9, IS: 91.5, JU: 97.1 },
      Lee:    { AP: 98.6, AS: 98.5, EN: 93.8, GA: 89.5, IS: 96.0, JU: 95.5 },
      Arca:   { AP: 97.9, AS: 92.7, EN: 99.4, GA: 89.9, IS: 96.8, JU: 96.4 },
    },
    may: {
      Femsa:  { AP: 90.4, AS: 88.8, EN: 96.3, GA: 76.4, IS: 93.5, JU: 92.7 },
      Andina: { AP: 93.4, AS: 99.4, EN: 98.0, GA: 92.2, IS: 90.8, JU: 97.9 },
      Lee:    { AP: 100.0, AS: 97.8, EN: 97.3, GA: 95.5, IS: 100.0, JU: 89.7 },
      Arca:   { AP: 98.8, AS: 89.9, EN: 99.9, GA: 88.1, IS: 92.8, JU: 96.8 },
    },
    jun: {
      Femsa:  { AP: 89.3, AS: 91.3, EN: 98.3, GA: 86.2, IS: 96.9, JU: 92.1 },
      Andina: { AP: 97.6, AS: 99.7, EN: 99.8, GA: 93.8, IS: 97.7, JU: 98.7 },
      Lee:    { AP: 98.8, AS: 100.0, EN: 100.0, GA: 95.8, IS: 99.0, JU: 90.8 },
      Arca:   { AP: 99.3, AS: 89.9, EN: 99.8, GA: 85.0, IS: 98.3, JU: 98.5 },
    },
  },
  CRF: {
    ene: {
      Femsa: { AP: 96.4, AS: 98.1, EN: 88.5, GA: 90.5, IS: 87.6, JU: 90.5 },
      Andina: { AP: 94.1, AS: 90.2, EN: 94.5, GA: 91.1, IS: 94.1, JU: 90.0 },
      Lee: { AP: 98.9, AS: 98.1, EN: 98.5, GA: 95.2, IS: 98.6, JU: 95.3 },
      Arca: { AP: 96.6, AS: 88.4, EN: 95.3, GA: 87.0, IS: 98.6, JU: 93.5 },
    },
    feb: {
      Femsa: { AP: 93.5, AS: 96.9, EN: 93.9, GA: 90.7, IS: 92.5, JU: 92.6 },
      Andina: { AP: 91.1, AS: 89.9, EN: 90.6, GA: 87.8, IS: 92.5, JU: 87.7 },
      Lee: { AP: 95.6, AS: 96.5, EN: 97.5, GA: 90.9, IS: 96.9, JU: 92.5 },
      Arca: { AP: 94.6, AS: 92.6, EN: 88.3, GA: 87.8, IS: 95.3, JU: 90.6 },
    },
    mar: {
      Femsa:  { AP: 95.2, AS: 92.2, EN: 94.0, GA: 91.3, IS: 91.7, JU: 90.8 },
      Andina: { AP: 94.4, AS: 93.3, EN: 91.5, GA: 89.7, IS: 94.0, JU: 91.0 },
      Lee:    { AP: 98.5, AS: 96.9, EN: 98.2, GA: 92.9, IS: 98.0, JU: 91.5 },
      Arca:   { AP: 94.8, AS: 93.3, EN: 97.0, GA: 89.2, IS: 89.7, JU: 89.6 },
    },
    abr: {
      Femsa:  { AP: 95.4, AS: 96.2, EN: 91.3, GA: 93.8, IS: 95.1, JU: 91.6 },
      Andina: { AP: 94.7, AS: 93.8, EN: 92.1, GA: 87.4, IS: 89.4, JU: 90.7 },
      Lee:    { AP: 90.3, AS: 98.2, EN: 96.4, GA: 93.2, IS: 99.1, JU: 88.6 },
      Arca:   { AP: 92.0, AS: 95.2, EN: 91.5, GA: 85.5, IS: 94.5, JU: 95.1 },
    },
    may: {
      Femsa:  { AP: 89.2, AS: 95.6, EN: 91.0, GA: 86.2, IS: 89.7, JU: 91.0 },
      Andina: { AP: 95.5, AS: 95.8, EN: 94.2, GA: 89.7, IS: 93.2, JU: 90.6 },
      Lee:    { AP: 95.5, AS: 94.9, EN: 90.4, GA: 87.8, IS: 96.3, JU: 85.6 },
      Arca:   { AP: 96.7, AS: 96.5, EN: 94.9, GA: 88.0, IS: 97.4, JU: 94.7 },
    },
    jun: {
      Femsa:  { AP: 85.2, AS: 95.1, EN: 92.4, GA: 89.4, IS: 96.6, JU: 84.1 },
      Andina: { AP: 95.7, AS: 96.6, EN: 91.3, GA: 88.6, IS: 93.2, JU: 92.6 },
      Lee:    { AP: 96.9, AS: 95.8, EN: 92.4, GA: 89.7, IS: 97.7, JU: 87.2 },
      Arca:   { AP: 96.6, AS: 94.7, EN: 93.4, GA: 86.2, IS: 95.8, JU: 94.8 },
    },
    jul: {
      Femsa:  { AP: 91.5, AS: 96.8, EN: 92.8, GA: 94.0, IS: 88.8, JU: 84.4, TOT: 92.0 },
      Andina: { AP: 96.8, AS: 97.9, EN: 89.2, GA: 91.3, IS: 98.4, JU: 95.8, TOT: 93.7 },
      Lee:    { AP: 93.2, AS: 92.6, EN: 92.0, GA: 90.5, IS: 96.8, JU: 88.5, TOT: 91.3 },
      Arca:   { AP: 93.2, AS: 93.8, EN: 93.3, GA: 89.1, IS: 96.7, JU: 93.7, TOT: 92.2 },
    },
  },
  "La Anonima": {
    ene: {
      Femsa:  { AP: 68.6, AS: 86.0, EN: 97.1, GA: 79.4, IS: 76.7, JU: 71.1 },
      Andina: { AP: 84.5, AS: 87.0, EN: 85.2, GA: 88.8, IS: 89.2, JU: 81.8 },
      Arca:   { AP: 90.0, AS: 92.4, EN: 97.0, GA: 92.5, IS: 94.7, JU: 92.3 },
    },
    feb: {
      Femsa:  { AP: 84.4, AS: 97.2, EN: 66.7, GA: 92.9, IS: 100.0, JU: 89.3 },
      Andina: { AP: 88.8, AS: 87.7, EN: 87.6, GA: 89.6, IS: 89.1, JU: 84.8 },
      Arca:   { AP: 83.3, AS: 89.4, EN: 36.1, GA: 91.8, IS: 88.6, JU: 83.2 },
    },
    mar: {
      Femsa:  { AP: 98.3, AS: 92.9, EN: 86.2, GA: 96.9, IS: 81.1, JU: 87.1 },
      Andina: { AP: 96.3, AS: 95.5, EN: 92.3, GA: 95.5, IS: 96.1, JU: 92.2 },
      Arca:   { AP: 93.8, AS: 98.1, EN: 96.0, GA: 97.0, IS: 99.0, JU: 97.3 },
    },
    abr: {
      Femsa:  { AP: 97.7, AS: 86.3, EN: 95.6, GA: 95.0, IS: 96.3, JU: 96.3 },
      Andina: { AP: 97.9, AS: 97.0, EN: 97.6, GA: 98.2, IS: 99.6, JU: 97.0 },
      Arca:   { AP: 94.4, AS: 97.8, EN: 97.8, GA: 96.4, IS: 96.0, JU: 97.4 },
    },
    may: {
      Femsa:  { AP: 93.2, AS: 90.0, EN: 96.3, GA: 99.0, IS: 97.6, JU: 96.4 },
      Andina: { AP: 98.5, AS: 99.4, EN: 97.2, GA: 96.2, IS: 97.2, JU: 82.8 },
      Arca:   { AP: 98.1, AS: 95.1, EN: 97.2, GA: 96.1, IS: 97.4, JU: 97.4 },
    },
    jun: {
      Femsa:  { AP: 97.2, AS: 100.0, EN: 90.0, GA: 94.2, IS: 100.0, JU: 98.2 },
      Andina: { AP: 98.4, AS: 96.0,  EN: 96.4, GA: 95.1, IS: 96.2,  JU: 95.3 },
      Arca:   { AP: 95.6, AS: 96.9,  EN: 98.7, GA: 94.0, IS: 97.6,  JU: 96.4 },
    },
    jul: {
      Femsa:  { AP: 100.0, AS: 98.0, EN: 95.6, GA: 98.0, IS: 100.0, JU: 96.3, TOT: 97.8 },
      Andina: { AP: 97.9,  AS: 97.3, EN: 96.7, GA: 96.0, IS: 97.6,  JU: 96.4, TOT: 96.6 },
      Arca:   { AP: 94.4,  AS: 97.7, EN: 98.4, GA: 94.8, IS: 99.1,  JU: 97.7, TOT: 96.7 },
    },
  },
};

const CAT_DOH = {
  Cencosud: {
    ene: {
      Cencosud: { AP: 18.6, AS: 22.4, EN: 35.4, GA: 16.6, IS: 26.3, JU: 30.9, TOT: 19.2 },
      Andina: { AP: 28.8, AS: 26.0, EN: 32.0, GA: 18.3, IS: 28.7, JU: 33.5, TOT: 21.3 },
      Arca: { AP: 12.3, AS: 16.4, EN: 34.7, GA: 13.4, IS: 23.5, JU: 25.0, TOT: 16.0 },
      Femsa: { AP: 17.1, AS: 22.3, EN: 41.1, GA: 16.5, IS: 24.4, JU: 32.3, TOT: 18.9 },
      Lee: { AP: 23.6, AS: 22.6, EN: 33.2, GA: 14.9, IS: 28.5, JU: 26.6, TOT: 17.3 },
    },
    feb: {
      Cencosud: { AP: 19.6, AS: 21.7, EN: 43.7, GA: 15.6, IS: 26.0, JU: 31.0, TOT: 18.6 },
      Andina: { AP: 38.2, AS: 28.5, EN: 46.5, GA: 19.1, IS: 28.1, JU: 36.0, TOT: 23.0 },
      Arca: { AP: 10.9, AS: 14.0, EN: 35.1, GA: 9.8, IS: 19.4, JU: 27.0, TOT: 13.1 },
      Femsa: { AP: 17.9, AS: 21.3, EN: 44.9, GA: 14.6, IS: 25.0, JU: 28.0, TOT: 17.2 },
      Lee: { AP: 25.5, AS: 21.8, EN: 42.6, GA: 16.7, IS: 37.8, JU: 27.2, TOT: 19.2 },
    },
    mar: {
      Andina: { AP: 49.3, AS: 35.8, EN: 44.0, GA: 21.4, IS: 32.5, JU: 40.8 },
      Arca:   { AP: 12.3, AS: 15.8, EN: 38.7, GA: 12.6, IS: 27.3, JU: 29.8 },
      Femsa:  { AP: 21.0, AS: 23.7, EN: 45.9, GA: 15.4, IS: 30.5, JU: 24.4 },
      Lee:    { AP: 28.3, AS: 26.3, EN: 58.3, GA: 20.0, IS: 40.9, JU: 32.1 },
    },
    abr: {
      Andina: { AP: 51.3, AS: 38.8, EN: 55.5, GA: 21.0, IS: 42.9, JU: 45.7 },
      Arca:   { AP: 12.0, AS: 16.7, EN: 37.2, GA: 11.8, IS: 30.8, JU: 30.9 },
      Femsa:  { AP: 23.9, AS: 28.1, EN: 53.9, GA: 17.4, IS: 47.0, JU: 32.4 },
      Lee:    { AP: 39.0, AS: 28.2, EN: 61.4, GA: 20.2, IS: 55.1, JU: 39.2 },
    },
    may: {
      Andina: { AP: 58.1, AS: 44.6, EN: 61.6, GA: 19.4, IS: 58.9, JU: 48.4 },
      Arca:   { AP: 13.5, AS: 18.9, EN: 56.4, GA: 12.1, IS: 33.7, JU: 29.1 },
      Femsa:  { AP: 22.9, AS: 28.7, EN: 64.2, GA: 17.2, IS: 54.0, JU: 33.0 },
      Lee:    { AP: 49.4, AS: 29.8, EN: 85.5, GA: 20.8, IS: 64.3, JU: 40.7 },
    },
    jun: {
      Andina: { AP: 64.5, AS: 40.4, EN: 66.4, GA: 18.7, IS: 73.2, JU: 49.4 },
      Arca:   { AP: 15.6, AS: 16.8, EN: 50.2, GA: 10.5, IS: 59.7, JU: 28.7 },
      Femsa:  { AP: 25.2, AS: 24.9, EN: 63.5, GA: 17.2, IS: 43.1, JU: 30.5 },
      Lee:    { AP: 46.8, AS: 27.5, EN: 78.4, GA: 18.6, IS: 53.1, JU: 37.8 },
    },
    jul: {
      Andina: { AP: 59.9, AS: 40.9, EN: 61.3, GA: 16.5, IS: 49.9, JU: 48.3, TOT: 22.2 },
      Arca:   { AP: 15.1, AS: 19.6, EN: 44.6, GA: 11.8, IS: 48.5, JU: 29.4, TOT: 15.6 },
      Femsa:  { AP: 25.9, AS: 28.1, EN: 55.1, GA: 16.3, IS: 60.9, JU: 35.2, TOT: 20.2 },
      Lee:    { AP: 42.8, AS: 27.6, EN: 77.1, GA: 16.9, IS: 66.0, JU: 34.8, TOT: 21.4 },
    },
  },
  GDN: {
    ene: {
      Femsa:  { AP: 39.6, AS: 11.2, EN: 28.4, GA: 24.6, IS: 27.4, JU: 38.9 },
      Andina: { AP: 54.4, AS: 31.1, EN: 31.8, GA: 21.3, IS: 34.9, JU: 35.7 },
      Lee:    { AP: 44.1, AS: 35.9, EN: 62.7, GA: 28.0, IS: 33.7, JU: 47.7 },
      Arca:   { AP: 28.6, AS: 21.9, EN: 31.2, GA: 76.1, IS: 35.4, JU: 19.2 },
    },
    feb: {
      Femsa:  { AP: 49.2, AS: 11.0, EN: 35.5, GA: 27.4, IS: 34.3, JU: 42.6 },
      Andina: { AP: 63.8, AS: 37.9, EN: 32.5, GA: 19.6, IS: 33.9, JU: 32.3 },
      Lee:    { AP: 65.5, AS: 36.4, EN: 72.8, GA: 29.6, IS: 33.3, JU: 48.5 },
      Arca:   { AP: 27.7, AS: 20.2, EN: 32.6, GA: 16.6, IS: 28.4, JU: 33.6 },
    },
    mar: {
      Femsa:  { AP: 49.2, AS: 10.0, EN: 35.5, GA: 27.4, IS: 34.3, JU: 42.0 },
      Andina: { AP: 63.8, AS: 37.9, EN: 32.5, GA: 19.6, IS: 33.9, JU: 32.3 },
      Lee:    { AP: 65.5, AS: 36.4, EN: 72.8, GA: 29.6, IS: 33.3, JU: 48.5 },
      Arca:   { AP: 27.7, AS: 20.2, EN: 31.2, GA: 15.9, IS: 28.4, JU: 33.6 },
    },
    abr: {
      Femsa:  { AP: 49.9, AS: 23.9, EN: 30.6, GA: 26.2, IS: 41.3, JU: 29.0 },
      Andina: { AP: 67.1, AS: 38.8, EN: 42.5, GA: 22.5, IS: 30.4, JU: 39.2 },
      Lee:    { AP: 61.6, AS: 32.1, EN: 55.4, GA: 32.2, IS: 45.4, JU: 47.7 },
      Arca:   { AP: 24.1, AS: 22.6, EN: 33.1, GA: 17.8, IS: 27.8, JU: 26.9 },
    },
    may: {
      Femsa:  { AP: 52.3, AS: 36.8, EN: 38.0, GA: 21.8, IS: 45.6, JU: 36.6 },
      Andina: { AP: 90.2, AS: 40.8, EN: 37.9, GA: 23.7, IS: 42.8, JU: 31.4 },
      Lee:    { AP: 78.6, AS: 30.5, EN: 78.7, GA: 29.7, IS: 58.4, JU: 38.9 },
      Arca:   { AP: 20.5, AS: 23.3, EN: 37.0, GA: 14.9, IS: 35.5, JU: 23.8 },
    },
    jun: {
      Femsa:  { AP: 46.6, AS: 34.3, EN: 33.0, GA: 22.1, IS: 40.6, JU: 35.6 },
      Andina: { AP: 99.9, AS: 35.1, EN: 30.0, GA: 20.1, IS: 45.2, JU: 27.8 },
      Lee:    { AP: 69.9, AS: 26.9, EN: 64.3, GA: 27.4, IS: 60.1, JU: 40.6 },
      Arca:   { AP: 17.6, AS: 20.5, EN: 32.3, GA: 11.8, IS: 31.5, JU: 20.2 },
    },
  },
  CRF: {
    ene: {
      Femsa:  { AP: 16.8, AS: 17.8, EN: 20.9, GA: 16.2, IS: 13.7, JU: 18.2 },
      Andina: { AP: 21.9, AS: 23.8, EN: 21.5, GA: 15.8, IS: 16.7, JU: 17.2 },
      Lee:    { AP: 21.6, AS: 20.9, EN: 30.0, GA: 25.7, IS: 27.0, JU: 28.7 },
      Arca:   { AP: 14.1, AS: 18.2, EN: 23.4, GA: 17.0, IS: 18.1, JU: 17.9 },
    },
    feb: {
      Femsa:  { AP: 16.6, AS: 18.5, EN: 22.1, GA: 13.9, IS: 13.1, JU: 21.2 },
      Andina: { AP: 19.8, AS: 21.1, EN: 18.1, GA: 12.0, IS: 15.3, JU: 16.7 },
      Lee:    { AP: 29.6, AS: 26.7, EN: 33.9, GA: 22.8, IS: 26.8, JU: 26.2 },
      Arca:   { AP: 13.1, AS: 19.5, EN: 19.0, GA: 15.8, IS: 13.8, JU: 17.4 },
    },
    mar: {
      Femsa:  { AP: 17.2, AS: 18.5, EN: 27.0, GA: 17.5, IS: 15.5, JU: 21.1 },
      Andina: { AP: 25.4, AS: 25.4, EN: 18.6, GA: 16.3, IS: 19.2, JU: 19.1 },
      Lee:    { AP: 40.5, AS: 29.7, EN: 44.6, GA: 27.6, IS: 36.2, JU: 34.7 },
      Arca:   { AP: 15.3, AS: 24.8, EN: 24.5, GA: 19.5, IS: 14.6, JU: 18.5 },
    },
    abr: {
      Femsa:  { AP: 16.3, AS: 23.7, EN: 28.5, GA: 14.8, IS: 28.6, JU: 27.9 },
      Andina: { AP: 25.5, AS: 24.0, EN: 28.0, GA: 16.0, IS: 16.1, JU: 17.1 },
      Lee:    { AP: 37.6, AS: 31.5, EN: 45.7, GA: 26.5, IS: 47.1, JU: 31.9 },
      Arca:   { AP: 17.8, AS: 22.6, EN: 22.7, GA: 14.6, IS: 20.2, JU: 16.7 },
    },
    may: {
      Femsa:  { AP: 15.5, AS: 21.8, EN: 28.2, GA: 12.2, IS: 25.4, JU: 34.8 },
      Andina: { AP: 34.5, AS: 27.3, EN: 38.8, GA: 16.5, IS: 23.9, JU: 18.9 },
      Lee:    { AP: 52.2, AS: 32.0, EN: 48.1, GA: 27.4, IS: 69.8, JU: 35.2 },
      Arca:   { AP: 19.1, AS: 22.1, EN: 38.6, GA: 12.9, IS: 27.4, JU: 16.8 },
    },
    jun: {
      Femsa:  { AP: 16.3, AS: 19.4, EN: 23.5, GA: 12.0, IS: 38.8, JU: 29.9 },
      Andina: { AP: 42.1, AS: 29.2, EN: 45.6, GA: 15.0, IS: 30.6, JU: 18.7 },
      Lee:    { AP: 51.7, AS: 32.1, EN: 42.1, GA: 24.6, IS: 47.8, JU: 26.8 },
      Arca:   { AP: 16.0, AS: 19.0, EN: 36.8, GA: 13.0, IS: 27.0, JU: 15.1 },
    },
    jul: {
      Femsa:  { AP: 17.4, AS: 20.4, EN: 25.0, GA: 12.8, IS: 31.8, JU: 23.5, TOT: 16.0 },
      Andina: { AP: 40.6, AS: 29.4, EN: 40.3, GA: 16.3, IS: 30.9, JU: 25.9, TOT: 19.8 },
      Lee:    { AP: 43.9, AS: 28.4, EN: 35.7, GA: 22.8, IS: 53.8, JU: 27.5, TOT: 25.3 },
      Arca:   { AP: 15.6, AS: 21.9, EN: 32.9, GA: 12.9, IS: 84.2, JU: 21.0, TOT: 16.6 },
    },
  },
  "La Anonima": {
    ene: {
      Femsa:  { AP: 6.5,  AS: 14.0, EN: 14.4, GA: 10.6, IS: 14.5, JU: 16.5 },
      Andina: { AP: 10.8, AS: 11.5, EN: 11.1, GA: 12.0, IS: 13.3, JU: 10.9 },
      Arca:   { AP: 14.5, AS: 24.8, EN: 18.0, GA: 24.2, IS: 21.3, JU: 16.8 },
    },
    feb: {
      Femsa:  { AP: 20.0, AS: 17.6, EN: 10.8, GA: 12.8, IS: 21.8, JU: 13.1 },
      Andina: { AP: 11.6, AS: 11.7, EN: 13.1, GA: 13.4, IS: 12.5, JU: 11.9 },
      Arca:   { AP: 10.1, AS: 14.3, EN: 23.2, GA: 15.5, IS: 11.4, JU: 21.1 },
    },
    mar: {
      Femsa:  { AP: 35.6, AS: 26.7, EN: 31.9, GA: 21.5, IS: 59.5, JU: 46.6 },
      Andina: { AP: 27.7, AS: 18.2, EN: 27.5, GA: 15.5, IS: 20.4, JU: 14.5 },
      Arca:   { AP: 34.5, AS: 37.5, EN: 35.3, GA: 18.6, IS: 102.8, JU: 49.2 },
    },
    abr: {
      Femsa:  { AP: 14.2, AS: 18.7, EN: 24.0, GA: 36.9, IS: 18.9, JU: 23.3 },
      Andina: { AP: 33.7, AS: 22.7, EN: 25.0, GA: 102.4, IS: 21.1, JU: 28.1 },
      Arca:   { AP: 13.7, AS: 22.7, EN: 19.3, GA: 33.7,  IS: 38.1, JU: 29.7 },
    },
    may: {
      Femsa:  { AP: 15.5, AS: 9.2,  EN: 16.3, GA: 34.0, IS: 22.4, JU: 22.2 },
      Andina: { AP: 34.0, AS: 20.5, EN: 20.2, GA: 17.4, IS: 24.4, JU: 18.7 },
      Arca:   { AP: 24.1, AS: 31.5, EN: 33.1, GA: 22.7, IS: 67.6, JU: 34.4 },
    },
    jun: {
      Femsa:  { AP: 12.1, AS: 44.2, EN: 10.6, GA: 10.1, IS: 25.1, JU: 26.2 },
      Andina: { AP: 37.0, AS: 12.5, EN: 18.1, GA: 10.6, IS: 22.3, JU: 15.4 },
      Arca:   { AP: 20.3, AS: 28.6, EN: 28.5, GA: 18.3, IS: 40.9, JU: 25.7 },
    },
    jul: {
      Femsa:  { AP: 78.3, AS: 25.1, EN: 19.5, GA: 14.8, IS: 40.8, JU: 51.8, TOT: 18.1 },
      Andina: { AP: 27.7, AS: 20.2, EN: 18.6, GA: 12.3, IS: 26.4, JU: 18.6, TOT: 14.5 },
      Arca:   { AP: 25.5, AS: 39.7, EN: 48.9, GA: 16.1, IS: 64.4, JU: 31.7, TOT: 20.8 },
    },
  },
}

const CAT_KEYS = { AP: "Aguas Plain", AS: "Aguas Sabor.", EN: "Energizantes", GA: "Gaseosas", IS: "Isotónicas", JU: "Jugos" };
const CAT_ORDER = ["AP", "AS", "EN", "GA", "IS", "JU"];

/* ═══════════════════════════════════════════════════════════════════════════
   BOTTLER TABS — metadata + loss-tree / points suggestions
   ═══════════════════════════════════════════════════════════════════════════ */

const BOT_META = {
  Femsa:  { cKey: "F",  barKey: "FEMSA",  color: BOTTLER_COLORS.femsa,  label: "Femsa" },
  Lee:    { cKey: "L",  barKey: "LEE",    color: BOTTLER_COLORS.lee,    label: "Reg. Lee" },
  Andina: { cKey: "A",  barKey: "ANDINA", color: BOTTLER_COLORS.andina, label: "Andina" },
  Arca:   { cKey: "AR", barKey: "ARCA",   color: BOTTLER_COLORS.arca,   label: "Arca" },
};
const TAB_TO_BOT = { bot_femsa: "Femsa", bot_lee: "Lee", bot_andina: "Andina", bot_arca: "Arca" };

// Average category fill rate for a bottler across all clients, for a given month
function bottlerCatFR(botName, mes) {
  const acc = { AP: [], AS: [], EN: [], GA: [], IS: [], JU: [] };
  Object.keys(CAT_FR).forEach(client => {
    const md = CAT_FR[client] && CAT_FR[client][mes] && CAT_FR[client][mes][botName];
    if (md) CAT_ORDER.forEach(ck => { if (md[ck] != null) acc[ck].push(md[ck]); });
  });
  const out = {};
  CAT_ORDER.forEach(ck => { out[ck] = acc[ck].length ? acc[ck].reduce((a, b) => a + b, 0) / acc[ck].length : null; });
  return out;
}

// Build the default (data-derived) loss tree + suggested month points for a bottler
function computeBotSuggestions(name) {
  const meta = BOT_META[name];
  const totalRow = TR["TOTAL CANAL"][TR["TOTAL CANAL"].length - 1];
  const frJun = totalRow[meta.cKey];
  const frYTD = YTD["TOTAL CANAL"][meta.cKey];
  const target = 98;
  const catFR = bottlerCatFR(name, "jul");
  const gaps = CAT_ORDER.map(ck => ({ ck, gap: Math.max(0, target - (catFR[ck] == null ? target : catFR[ck])) }));
  const sumGap = gaps.reduce((a, g) => a + g.gap, 0);
  const totalLoss = Math.max(0, +(target - frJun).toFixed(2));
  let tree = gaps
    .map((g, i) => ({ id: "c" + i, label: CAT_KEYS[g.ck], pp: +(sumGap > 0 ? totalLoss * g.gap / sumGap : 0).toFixed(2), src: "dato", cat: g.ck }))
    .filter(c => c.pp > 0.05)
    .sort((a, b) => b.pp - a.pp);
  if (tree.length === 0) tree = [{ id: "c0", label: "Pérdida total", pp: totalLoss, src: "dato" }];

  const bar = BAR_DATA[meta.barKey] || [];
  const withB = bar.filter(x => x.b != null);
  const best = withB.length ? withB.reduce((a, b) => (b.b > a.b ? b : a)) : null;
  const worst = withB.length ? withB.reduce((a, b) => (b.b < a.b ? b : a)) : null;
  const dltObj = DLT.find(d => d.n === name);
  const catEntries = CAT_ORDER.map(ck => ({ ck, v: catFR[ck] })).filter(x => x.v != null);
  const wc = catEntries.length ? catEntries.reduce((a, b) => (b.v < a.v ? b : a)) : null;
  const bc = catEntries.length ? catEntries.reduce((a, b) => (b.v > a.v ? b : a)) : null;

  const points = [];
  points.push({ id: "p0", src: "auto", text: `FR Jul'26: ${frJun.toFixed(1)}%${dltObj ? ` (${dltObj.d >= 0 ? "+" : ""}${dltObj.d}pp vs Jul'25)` : ""}. YTD 2026: ${frYTD.toFixed(1)}%.` });
  if (best) points.push({ id: "p1", src: "auto", text: `Mejor cliente: ${best.n} ${best.b.toFixed(1)}%.` });
  if (worst) points.push({ id: "p2", src: "auto", text: `Cliente a atender: ${worst.n} ${worst.b.toFixed(1)}%.` });
  if (wc && bc) points.push({ id: "p3", src: "auto", text: `Categoría más baja: ${CAT_KEYS[wc.ck]} ${wc.v.toFixed(1)}% · más alta: ${CAT_KEYS[bc.ck]} ${bc.v.toFixed(1)}%.` });
  return { target, tree, points };
}

/* ═══════════════════════════════════════════════════════════════════════════
   REAL LOSS-TREE DATA (por motivo de no entrega). Andina = Junio 2026.
   Los demás bottlers quedan null hasta recibir su detalle.
   ═══════════════════════════════════════════════════════════════════════════ */

const REASON_COLS = [
  { k: "fd", lb: "Falta Disp." },
  { k: "pa", lb: "Ped. Anul." },
  { k: "lp", lb: "Lista Prec." },
  { k: "pt", lb: "Planif/Transp." },
  { k: "ot", lb: "Otros" },
  { k: "sk", lb: "SKU N/D" },
];

// Color scales for No Fill Rate (loss %) — higher = worse
function nofrColor(v) {
  if (v == null) return "transparent";
  if (v <= 0.05) return "rgba(130,130,130,.12)";
  if (v < 1) return "rgba(74,222,128,.20)";
  if (v < 2) return "rgba(251,146,60,.22)";
  if (v < 4) return "rgba(234,88,12,.28)";
  return "rgba(220,38,38,.35)";
}
function nofrText(v) {
  if (v == null) return V.gray700;
  if (v <= 0.05) return V.gray500;
  if (v < 1) return "#22C55E";
  if (v < 2) return "#FB923C";
  if (v < 4) return "#EA580C";
  return "#EF4444";
}

const BOT_LOSS = {
  Andina: {
    month: "Julio 2026",
    base: 100,
    cols: [
      { k: "fd", lb: "Falta Disp." },
      { k: "pa", lb: "Ped. Anul." },
      { k: "lp", lb: "Lista Prec." },
      { k: "pt", lb: "Planif/Transp." },
      { k: "ot", lb: "Otros" },
      { k: "sk", lb: "SKU N/D" },
    ],
    total: { fr: 90.7, nofr: 9.3, bne: 125204, bp: 981253, be: 856048 },
    reasons: [
      { lb: "Falta de Disponibilidad", short: "Falta Disp.", key: "fd", bne: 44287, nofr: 3.27 },
      { lb: "Planificación/Transporte", short: "Planif/Transp.", key: "pt", bne: 26520, nofr: 1.96 },
      { lb: "Pedido Anulado/Rechazado", short: "Ped. Anul.", key: "pa", bne: 23533, nofr: 1.74 },
      { lb: "Lista de Precios", short: "Lista Prec.", key: "lp", bne: 20311, nofr: 1.52 },
      { lb: "Otros", short: "Otros", key: "ot", bne: 10554, nofr: 0.80 },
      { lb: "SKU No disponible", short: "SKU N/D", key: "sk", bne: 0, nofr: 0.0 },
    ],
    chains: [
      { lb: "Carrefour", color: "#5BA8FF", fr: 88.9, nofr: 11.1, bne: 37945, bp: 340499, r: { fd: 3.7, pa: 2.0, lp: 0.8, pt: 1.8, ot: 2.8, sk: 0.0 } },
      { lb: "Chango Más", color: "#E8802D", fr: 92.4, nofr: 7.6, bne: 7122, bp: 93263, r: { fd: 1.7, pa: 1.2, lp: 2.0, pt: 2.4, ot: 0.3, sk: 0.0 } },
      { lb: "La Anónima", color: "#9E9E9E", fr: 92.5, nofr: 7.5, bne: 25882, bp: 343549, r: { fd: 6.0, pa: 0.0, lp: 0.4, pt: 1.2, ot: 0.0, sk: 0.0 } },
      { lb: "Cencosud", color: "#7CB342", fr: 90.3, nofr: 9.7, bne: 24672, bp: 253087, r: { fd: 1.5, pa: 0.0, lp: 4.7, pt: 3.5, ot: 0.0, sk: 0.0 } },
    ],
    topSku: {
      reason: "Falta de Disponibilidad",
      note: "Mayor impacto: Lata del Mundial (CC Zero Ed. Limitada 473X6), ya solicitada la baja en cadenas. TOP 10 concentra ~35% del BNE por disponibilidad.",
      items: [
        { ean: "7790895643286", mat: "CC ZERO Ed Limitada Mundial 473X6", bne: 2380, pct: 6.44 },
        { ean: "7790895005794", mat: "COCA COLA PET 2500X6 RED", bne: 1796, pct: 4.86 },
        { ean: "7790895648571", mat: "SCHWP TONICA S/AZU.LAT310X6", bne: 1077, pct: 2.91 },
        { ean: "7790895001451", mat: "COCA-COLA LIGHT 1.5L BT PET C N 1X6", bne: 883, pct: 2.39 },
        { ean: "7790895068164", mat: "Coca-Cola RED RET 2,5L 1x8", bne: 805, pct: 2.18 },
        { ean: "7790895068096", mat: "CC Sin Azúcar 2.5l x6PET", bne: 771, pct: 2.09 },
        { ean: "7790895002304", mat: "FANTA NAR SIN AZUC 1,5X6", bne: 746, pct: 2.02 },
        { ean: "7790895005312", mat: "COCA COLA LIGHT PET 2250 X 6", bne: 684, pct: 1.85 },
        { ean: "7790895009846", mat: "CEPITA HF DURAZNO DELICIOSO 1LT X 6", bne: 624, pct: 1.69 },
        { ean: "7790895067570", mat: "CC SIN AZÚCAR 2.25LT X 6", bne: 604, pct: 1.63 },
      ],
    },
    points: [
      { tag: "Falta de Disponibilidad", color: "#EF4444", title: "Principal motivo — 3.3pp · 44.287 bultos", text: "La Lata del Mundial (CC Zero Ed. Limitada 473X6) lidera el BNE. También impactaron CC 2,5L Retornable (6.3%), CC Vid 237ml (3.0%) y Schweppes Tónica Lata (4.4%) — estos 5 representan el 25% de los faltantes del bottler." },
      { tag: "Planif/Transporte · Cencosud", color: "#FB923C", title: "Cencosud — 3.5pp por Planif/Transporte", text: "De los 8.876 BNE: 6.198 (70%) por 'pedidos no atendidos' y 2.251 (25%) por 'sin programación de transporte'. Cencosud tomó la lista 3 días después de la fecha dada." },
      { tag: "Planif/Transporte · Chango Más", color: "#FB923C", title: "Chango Más — órdenes fuera de calendarización", text: "En Chango Más, órdenes de compra ingresadas fuera de la calendarización de pedidos generaron BNE por Planif/Transporte (2.4pp)." },
      { tag: "Lista de Precios · Cencosud", color: "#FB923C", title: "Cencosud — lista tomada 3 días tarde (4.7pp)", text: "Lista de Precios fue el segundo motivo más fuerte en Cencosud. La demora en la toma de lista impactó directamente en 11.894 bultos no entregados." },
      { tag: "Lista de Precios · Chango Más", color: "#FB923C", title: "Chango Más — nuevos formatos de lista", text: "En Chango Más, las políticas de lista y los nuevos formatos para su toma generaron demoras en la aprobación (2.0pp)." },
      { tag: "La Anónima", color: "#22C55E", title: "La Anónima — faltantes y rechazos de tiendas", text: "El principal motivo fue falta de disponibilidad (9%): CC 473 Mundial, Fanta 1,5L, CC Sin Azúcar 2,25L, CC Light 1,5L y Sprite 1,5L representan el 20% del BNE. El segundo motivo fueron rechazos por parte de las tiendas." },
    ],
  },
  Lee: {
    month: "Julio 2026",
    base: 100,
    cols: [
      { k: "fd", lb: "Falta Disp." },
      { k: "pa", lb: "Ped. Anul." },
      { k: "co", lb: "Créditos/Otros" },
      { k: "pt", lb: "Planif/Transp." },
    ],
    total: { fr: 90.6, nofr: 9.4, bne: 13535, bp: 144274, be: 130739 },
    reasons: [
      { lb: "Falta de Disponibilidad", short: "Falta Disp.", key: "fd", bne: 8468, nofr: 5.9 },
      { lb: "Planificación/Transporte", short: "Planif/Transp.", key: "pt", bne: 1992, nofr: 1.4 },
      { lb: "Pedido Anulado/Rechazado", short: "Ped. Anul.", key: "pa", bne: 1778, nofr: 1.2 },
      { lb: "Créditos/Otros", short: "Créditos/Otros", key: "co", bne: 1297, nofr: 0.9 },
    ],
    chains: [
      { lb: "GDN · Chango Más", color: "#E8802D", fr: 86.8, nofr: 13.2, bne: 1173, bp: 8902, r: { fd: 5.3, pa: 3.2, co: 1.8, pt: 2.9 } },
      { lb: "Cencosud", color: "#7CB342", fr: 88.8, nofr: 11.2, bne: 3632, bp: 32568, r: { fd: 9.1, pa: 0.4, co: 1.2, pt: 0.5 } },
      { lb: "Carrefour", color: "#5BA8FF", fr: 91.4, nofr: 8.6, bne: 6510, bp: 75404, r: { fd: 3.9, pa: 1.6, co: 1.0, pt: 2.1 } },
      { lb: "Dia Argentina", color: "#E1122A", fr: 91.9, nofr: 8.1, bne: 2220, bp: 27400, r: { fd: 7.7, pa: 0.4, co: 0.0, pt: 0.0 } },
    ],
    topSku: {
      reason: "Falta de Disponibilidad",
      note: "Faltantes concentrados en artículos clave de Coca-Cola. Solo 5 artículos suman el 48.8% del BNE por disponibilidad.",
      items: [
        { ean: "7790895000997", mat: "COCA COLA 2250CC PETX6", pct: 20.8 },
        { ean: "7790895006418", mat: "COCA COLA 3000CC PETX6", pct: 11.4 },
        { ean: "7790895067587", mat: "COCA COLA ZERO 354CC LATAX6", pct: 6.2 },
        { ean: "7790895007057", mat: "DUOPACK CCO-SPO 2250 X8", pct: 5.9 },
        { ean: "7790895000447", mat: "SPRITE LIMA LIMON 1500CC PETX8", pct: 4.6, obs: "Solo de Dia" },
      ],
    },
    subBreakdowns: [
      {
        title: "Pedido Rechazado — sub-causas",
        note: "Entre vencimiento corto y sobre stock en tiendas suman el 84% de los rechazos del mes.",
        rows: [
          { lb: "Vencimiento corto", pct: 67.5, color: "#EF4444" },
          { lb: "Sobre stock cliente", pct: 16.7, color: "#FB923C" },
        ],
      },
      {
        title: "Planif/Transporte — sub-causa principal",
        note: "Gran cantidad de pedidos con errores, concentrados principalmente en Carrefour.",
        rows: [
          { lb: "Error en el pedido", pct: 75.5, color: "#EF4444" },
        ],
      },
    ],
    points: [
      { tag: "Falta de Disponibilidad", color: "#EF4444", title: "Principal motivo — 5.9pp · 8.468 bultos", text: "Faltantes en artículos clave de Coca-Cola. Solo 5 SKUs concentran el 48.8% del BNE por disponibilidad: CC 2250cc, CC 3000cc, CC Zero 354cc, Duopack CCO-SPO y Sprite Lima Limón (exclusivo de Dia)." },
      { tag: "Falta Disp. · Cencosud", color: "#EF4444", title: "Cencosud — 9.1pp de No FR por disponibilidad", text: "El 50% del BNE por disponibilidad en Cencosud: CC 2,25L (665 BNE · 22.5%), Duopack (262 BNE · 8.9%), Schweppes Tónica 1,5L (202 BNE · 6.8%), CC Zero 2,25L (180 BNE · 6.1%) y CC 1,5L (168 BNE · 5.7%)." },
      { tag: "Falta Disp. · Chango Más", color: "#EF4444", title: "Chango Más — disponibilidad de alta rotación (5.3pp)", text: "El principal motivo en Chango Más es falta de disponibilidad por productos de alta rotación." },
      { tag: "Planif/Transp. · Carrefour", color: "#FB923C", title: "Carrefour — errores en pedidos (2.1pp)", text: "Errores en el grabado de OC generaron BNE en Carrefour. Principales SKUs afectados: CC 2,25L (28%), CC Zero 2,25L (12%), CC 1,5L (8%) y Sprite 2,25L (4%)." },
      { tag: "Pedido Rechazado", color: "#FB923C", title: "Rechazos — 1.2pp · vencimiento corto y sobre stock", text: "Vencimiento corto (67.5%) y sobre stock en tiendas (16.7%) explican el 84% de los rechazos. En Chango Más, productos con fecha corta fueron rechazados directamente en tiendas." },
    ],
  },
  Arca: {
    month: "Julio 2026",
    base: 100,
    cols: [
      { k: "fd", lb: "Falta Disp." },
      { k: "pa", lb: "Ped. Anul." },
      { k: "lp", lb: "Lista Prec." },
      { k: "co", lb: "Créd/Otros" },
      { k: "pt", lb: "Planif/Transp." },
    ],
    total: { fr: 87.6, nofr: 12.4, bne: 48986, bp: 396776, be: 347750 },
    reasons: [
      { lb: "Falta de Disponibilidad", short: "Falta Disp.", key: "fd", bne: 18649, nofr: 4.70 },
      { lb: "Pedido Anulado/Rechazado", short: "Ped. Anul.", key: "pa", bne: 15070, nofr: 3.80 },
      { lb: "Lista de Precios", short: "Lista Prec.", key: "lp", bne: 11677, nofr: 2.90 },
      { lb: "Planificación/Transporte", short: "Planif/Transp.", key: "pt", bne: 2818, nofr: 0.70 },
      { lb: "Créditos/Otros", short: "Créd/Otros", key: "co", bne: 813, nofr: 0.20 },
    ],
    chains: [
      { lb: "La Anónima", color: "#9E9E9E", fr: 76.2, nofr: 23.8, bne: 9398, bp: 39493, r: { fd: 8.9, pa: 7.6, lp: 2.1, co: 0.0, pt: 5.2 } },
      { lb: "Chango Más", color: "#E8802D", fr: 86.5, nofr: 13.5, bne: 13817, bp: 102347, r: { fd: 4.8, pa: 3.0, lp: 5.5, co: 0.2, pt: 0.0 } },
      { lb: "Carrefour", color: "#5BA8FF", fr: 89.0, nofr: 11.0, bne: 13974, bp: 127319, r: { fd: 3.4, pa: 4.4, lp: 2.1, co: 0.5, pt: 0.6 } },
      { lb: "Cencosud", color: "#7CB342", fr: 90.8, nofr: 7.2, bne: 11798, bp: 127618, r: { fd: 4.6, pa: 2.7, lp: 2.0, co: 0.0, pt: 0.0 } },
    ],
    topSku: {
      reason: "Falta de Disponibilidad",
      note: "El TOP 10 concentra el 60% del BNE por disponibilidad. Dualpacks 2.25L son los más afectados, liderado por CC+Sprite y CC+Coca Zero.",
      items: [
        { ean: "7790895006890", mat: "Dualpack Coca-Cola+Sprite F 2.25L Pet6B", bne: 1422, pct: 10.08 },
        { ean: "7790895648915", mat: "Dualpack Coca-Cola+Coca Zero 2.25L Pet6B", bne: 1356, pct: 9.61 },
        { ean: "7790895000829", mat: "Sprite F LS 500 ml NR Pet 6B", bne: 1262, pct: 8.95 },
        { ean: "7790895002656", mat: "Coca-Cola 375 ml NR Pet 6B", bne: 1066, pct: 7.56 },
        { ean: "7790895640025", mat: "Powerade Mountain Blast 500 ml NR Pet 6B", bne: 631, pct: 4.47 },
        { ean: "7790895011559", mat: "Fanta Naranja 375 ml NR Pet 6B", bne: 620, pct: 4.40 },
        { ean: "7790895651397", mat: "Dual Coca-Cola+Sprite 3L NR Pet 6B", bne: 597, pct: 4.23 },
        { ean: "7790895650833", mat: "Coca-Cola 600 ml NR Pet 12B", bne: 587, pct: 4.16 },
        { ean: "7790895641220", mat: "Aquarius Uva Verde 1.5 Lts. NR Pet 6B", bne: 505, pct: 3.58 },
        { ean: "7790895650949", mat: "Dualpack Coca-Cola+Sprite 1.5L NR Pet6B", bne: 460, pct: 3.26 },
      ],
    },
    subBreakdowns: [
      {
        title: "Falta Disponibilidad — sub-causas",
        rows: [
          { lb: "Sin stock en planta", pct: 14.56, color: "#EF4444" },
          { lb: "No disponible", pct: 13.69, color: "#FB923C" },
        ],
      },
      {
        title: "Pedido Rechazado — sub-causas",
        rows: [
          { lb: "Error de grabación", pct: 8.42, color: "#EF4444" },
          { lb: "Bebida con fecha corta", pct: 7.63, color: "#FB923C" },
          { lb: "Sin recepción supermercado", pct: 5.41, color: "#F59E0B" },
          { lb: "No recibe", pct: 4.31, color: "#A78BFA" },
        ],
      },
      {
        title: "Lista de Precios — sub-causa principal",
        rows: [
          { lb: "Diferencia de precios", pct: 36.61, color: "#EF4444" },
        ],
      },
    ],
    points: [
      { tag: "Falta de Disponibilidad", color: "#EF4444", title: "Principal motivo — 4.7pp · 18.649 bultos", text: "Dualpacks 2.25L lideran: CC+Sprite (10.1%) y CC+Coca Zero (9.6%). Sub-causas: sin stock en planta (14.6%) y no disponible (13.7%)." },
      { tag: "Falta Disp. · Cencosud", color: "#EF4444", title: "Cencosud — el 50% del BNE son Dualpacks y CC 375cc", text: "En Cencosud, el 50% del BNE por disponibilidad corresponde a Dualpacks y Coca-Cola 375cc (1.855 BNE)." },
      { tag: "Pedido Rechazado · Cencosud", color: "#FB923C", title: "Cencosud — 62% de rechazos por fecha corta", text: "De 3.393 BNE de rechazos en Cencosud, 2.093 BNE (62%) fue por fecha corta de vencimiento." },
      { tag: "Lista de Precios · Cencosud", color: "#FB923C", title: "Cencosud — lista tomada días después de la fecha dada", text: "2.505 BNE en Cencosud por Lista de Precios: la lista fue tomada días después de la fecha dada." },
      { tag: "Lista de Precios · Chango Más", color: "#FB923C", title: "Chango Más — 5.5pp por políticas de lista y demoras", text: "En Chango Más, políticas de CH+ y demoras/errores en la toma de lista generaron 5.629 BNE (5.5pp de No FR)." },
      { tag: "Pedido Rechazado · Chango Más", color: "#FB923C", title: "Chango Más — rechazos por forzados y devoluciones", text: "Forzados emitidos y aprobados por casa central generaron rechazos. Las tiendas no quisieron recibir pedidos por devoluciones pendientes de retirar." },
      { tag: "La Anónima", color: "#22C55E", title: "La Anónima — FR 76.2%, mejorando vs meses anteriores", text: "Mejora en entregas por mejor coordinación en sistemas y pedidos, e incorporación de tiendas nuevas (compradas a Libertad). El motivo principal sigue siendo falta de disponibilidad." },
    ],
  },
  Femsa: {
    month: "Julio 2026",
    base: 100,
    cols: [
      { k: "fd", lb: "Falta Disp." },
      { k: "pa", lb: "Ped. Anul." },
      { k: "pt", lb: "Planif/Transp." },
      { k: "sk", lb: "SKU N/D" },
    ],
    total: { fr: 90.9, nofr: 9.1, bne: 69627, bp: 765640, be: 696014 },
    reasons: [
      { lb: "Pedido Anulado/Rechazado", short: "Ped. Anul.", key: "pa", bne: 34228, nofr: 4.8 },
      { lb: "Planificación/Transporte", short: "Planif/Transp.", key: "pt", bne: 19835, nofr: 2.8 },
      { lb: "Falta de Disponibilidad", short: "Falta Disp.", key: "fd", bne: 14551, nofr: 2.0 },
      { lb: "Sku no Disponible", short: "SKU N/D", key: "sk", bne: 1013, nofr: 0.1 },
    ],
    chains: [
      { lb: "GDN · Chango Más", color: "#E8802D", fr: 86.7, nofr: 13.3, bne: 6077, bp: 45804, r: { fd: 3.9, pa: 6.8, pt: 2.6, sk: 0.0 } },
      { lb: "Carrefour", color: "#5BA8FF", fr: 90.1, nofr: 9.9, bne: 54270, bp: 549041, r: { fd: 2.2, pa: 2.6, pt: 0.2, sk: 0.2 } },
      { lb: "Cencosud", color: "#7CB342", fr: 94.6, nofr: 5.4, bne: 9280, bp: 170795, r: { fd: 0.4, pa: 3.1, pt: 1.9, sk: 0.0 } },
      { lb: "La Anónima", color: "#9E9E9E", fr: 94.3, nofr: 5.7, bne: 23, bp: 407, r: { fd: 5.7, pa: 0.0, pt: 0.0, sk: 0.0 } },
    ],
    topSku: {
      reason: "menor disponibilidad",
      pctLabel: "% No FR",
      note: "La disponibilidad representa el 16.1% del No FR total. Cepita Naranja HF lidera con notable distancia (54.5% del motivo).",
      items: [
        { ean: "", mat: "CEPITA NARANJA HF 995X6 (7 P)", pct: 54.51 },
        { ean: "", mat: "COCA-COLA P 2.25 X8", pct: 6.60 },
        { ean: "", mat: "CEPITA DURAZNO HF 995X6 (7 P)", pct: 5.11 },
        { ean: "", mat: "CC ZERO 600MLX6", pct: 3.79 },
        { ean: "", mat: "SP FX 220 x8", pct: 3.16 },
        { ean: "", mat: "CC LATA 220x8", pct: 2.95 },
        { ean: "", mat: "CC ZERO LAT 220X8", pct: 2.32 },
        { ean: "", mat: "AQ MANZ 2.25X6", pct: 1.87 },
        { ean: "", mat: "BENEDICTINO C/GAS 1.5LX6", pct: 1.46 },
        { ean: "", mat: "SW591X6 C/G (6P)", pct: 1.37 },
      ],
    },
    subBreakdowns: [
      {
        title: "Pedido Rechazado — sub-causas",
        rows: [
          { lb: "Pedido mal elaborado", pct: 29.6, color: "#EF4444" },
          { lb: "Fecha vencim. corta", pct: 17.8, color: "#FB923C" },
          { lb: "No coincide OC", pct: 14.8, color: "#F59E0B" },
          { lb: "Producto cambiado", pct: 10.5, color: "#A78BFA" },
          { lb: "Sin lugar en cliente", pct: 9.5, color: "#60A5FA" },
        ],
      },
      {
        title: "Planif/Transporte — sub-causas",
        rows: [
          { lb: "Anulación transporte", pct: 73.0, color: "#EF4444" },
          { lb: "Demoras", pct: 15.2, color: "#FB923C" },
          { lb: "Producto dañado en ruta", pct: 6.1, color: "#F59E0B" },
        ],
      },
    ],
    points: [
      { tag: "Ped. Rechazado · Carrefour", color: "#EF4444", title: "Carrefour — CD con problemas de pedidos mal elaborados", text: "El CD tuvo problemas con OCs mal elaboradas, fechas cortas de vencimiento y menor recepción que la requerida. Los SKUs CC 2,25L (12%), CC Zero 2,25L (10%), CC 600ml (5%) y Bidón Benedictino (5%) representan más del 30% del No FR de este motivo en Carrefour." },
      { tag: "Ped. Rechazado · Cencosud", color: "#EF4444", title: "Cencosud — 5.308 BNE por Pedidos Mal Elaborados y OC Incorrectas", text: "El motivo de No FR más fuerte en Cencosud fue Pedido Anulado/Rechazado: 971 BNE (26.5%) por 'Pedidos Mal Elaborados' y 822 BNE (22.5%) por 'Órdenes Incorrectas'." },
      { tag: "Planif/Transp. · Carrefour", color: "#FB923C", title: "Carrefour — anulaciones de transporte (51% del motivo)", text: "La anulación de transporte concentra el 73% del motivo total; Carrefour representa el 51% de esas anulaciones. También hubo demoras (15%) y productos dañados en ruta (6%)." },
      { tag: "Planif/Transp. · Cencosud", color: "#FB923C", title: "Cencosud — 1.230 BNE por anulación de transporte", text: "De Planif/Transporte en Cencosud: 1.230 BNE fueron por anulación de transporte." },
      { tag: "Falta de Disponibilidad", color: "#FB923C", title: "Disponibilidad — 2.0pp · Cepita Naranja HF lidera (54.5%)", text: "Cepita Naranja HF es el SKU con mayor falta de disponibilidad (54.5% del motivo). Le siguen CC P 2.25 X8 (13.9%), Cepita Durazno HF (13.9%), CC Zero 600ml y SP FX 220x8." },
      { tag: "GDN · Chango Más", color: "#EF4444", title: "Chango Más — FR 86.7% · OC bajo drop y faltantes de 600cc", text: "Principal motivo: Pedidos rechazados por OC bajo drop (6.8pp). Segundo motivo: faltantes de alta rotación, en especial productos de 600cc." },
    ],
  },
};

/* ═══════════════════════════════════════════════════════════════════════════
   F1 RACE HTML GENERATOR
   ═══════════════════════════════════════════════════════════════════════════ */

function getF1HTML(dk) {
  const bg=dk?'#000':'#f0f0f0', hbg=dk?'#000':'#fff', htxt=dk?'#fff':'#111', hsub=dk?'rgba(255,255,255,.5)':'#888';
  const cbg=dk?'#0d0d0d':'#f4f4f4', cbrdr=dk?'#222':'#ddd', btnbg=dk?'#1a1a1a':'#fff', btnbrdr=dk?'#333':'#ccc', btntxt=dk?'#ccc':'#555';
  const spdbg=dk?'#111':'#e8e8e8', gsA=dk?'#1a0000':'#f5e6e6', gsB=dk?'#220000':'#edd8d8';
  const gsDot=dk?'rgba(255,255,255,.04)':'rgba(204,0,0,.06)', wm=dk?'rgba(255,255,255,.03)':'rgba(204,0,0,.04)';
  const rdA=dk?'#1a1a1a':'#e0e0e0', rdB=dk?'#222':'#d5d5d5', lane=dk?'rgba(255,255,255,.06)':'rgba(0,0,0,.08)';
  const stB=dk?'#333':'#ccc', fnB=dk?'#111':'#ddd', grid=dk?'rgba(255,255,255,.04)':'rgba(0,0,0,.06)', gridTxt=dk?'#444':'#999';
  const cockpit=dk?'#0c0c0c':'#333', wheel=dk?'#111':'#444', shadow=dk?6:3;
  const lapCol=dk?'rgba(255,255,255,.8)':'#555', f1txt=dk?'rgba(255,255,255,.15)':'rgba(0,0,0,.08)';
  const chkA=dk?'#fff':'#E8002D', chkB=dk?'#000':'#fff';
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:${bg};color:${htxt};font-family:'Barlow Condensed',sans-serif;overflow:hidden}.header{background:${hbg};padding:12px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #E8002D;position:relative}.header::before{content:'';position:absolute;left:0;right:0;height:3px;background:repeating-linear-gradient(90deg,${chkA} 0,${chkA} 8px,${chkB} 8px,${chkB} 16px);top:0}.header h1{font-size:22px;font-weight:900;letter-spacing:4px;text-transform:uppercase;color:${htxt}}.header .sub{font-size:10px;color:${hsub};letter-spacing:3px}canvas#raceCanvas{display:block;width:100%}.controls{background:${cbg};border-top:1px solid ${cbrdr};padding:12px 20px;display:flex;align-items:center;gap:8px;justify-content:center}.btn{background:${btnbg};border:1.5px solid ${btnbrdr};border-radius:8px;color:${btntxt};font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;padding:8px 16px;cursor:pointer;transition:all .15s;letter-spacing:1px;text-transform:uppercase}.btn:hover{border-color:#E8002D;color:${dk?'#fff':'#E8002D'}}.btn.active{background:rgba(232,0,45,${dk?'.2':'.1'});border-color:#E8002D;color:${dk?'#ff3333':'#E8002D'}}.btn.primary{background:#E8002D;border-color:#E8002D;color:#fff;font-size:14px;padding:8px 24px}.btn.primary:hover{background:#ff1744}.speed-btns{display:flex;gap:2px;background:${spdbg};border:1px solid ${btnbrdr};border-radius:6px;padding:2px}.speed-btns .btn{border:none;border-radius:4px;padding:5px 10px;font-size:10px}.speed-btns .btn.active{background:#E8002D;color:#fff}</style></head><body>
<div class="header"><div><h1>🏁 Fill Rate Grand Prix · Argentina</h1><div class="sub">Coca-Cola · Temporada 2026 · <span id="lapLabel" style="color:${lapCol}">YTD Jul'26</span></div></div><div style="font-size:28px;color:${f1txt};letter-spacing:6px;font-weight:900">F1</div></div>
<div><div><canvas id="raceCanvas" width="1060" height="380"></canvas><div class="controls"><button class="btn" onclick="doReset()">↺ RESET</button><button class="btn" onclick="prevLap()">◀</button><button class="btn primary" id="btnPlay" onclick="togglePlay()">▶ START</button><button class="btn" onclick="nextLap()">▶</button><div class="speed-btns"><button class="btn active" onclick="setSpeed(1500,this)">1x</button><button class="btn" onclick="setSpeed(800,this)">2x</button><button class="btn" onclick="setSpeed(350,this)">5x</button></div></div></div></div>
<script>
const RACE_DATA=[{mes:"Ene'26",FEMSA:86.5,LEE:89.2,ANDINA:81.6,ARCA:79.0},{mes:"Feb'26",FEMSA:86.7,LEE:89.5,ANDINA:84.3,ARCA:84.0},{mes:"Mar'26",FEMSA:86.1,LEE:89.9,ANDINA:86.1,ARCA:85.6},{mes:"Abr'26",FEMSA:86.1,LEE:90.2,ANDINA:86.7,ARCA:85.6},{mes:"May'26",FEMSA:86.5,LEE:90.2,ANDINA:87.5,ARCA:85.8},{mes:"Jun'26",FEMSA:87.1,LEE:90.1,ANDINA:88.1,ARCA:85.6},{mes:"Jul'26",FEMSA:87.3,LEE:90.1,ANDINA:88.5,ARCA:86.0}];
const CARS=[{key:"FEMSA",label:"Femsa",color:"#E03E52",accent:"#f06070",num:"04"},{key:"LEE",label:"Reginald Lee",color:"#CDC4AA",accent:"#ddd6c0",num:"01"},{key:"ANDINA",label:"Andina",color:"#F59E0B",accent:"#FBBF24",num:"11"},{key:"ARCA",label:"Arca",color:"#E87722",accent:"#f09050",num:"44"}];
const canvas=document.getElementById('raceCanvas'),ctx=canvas.getContext('2d');let CW,CH;function resize(){const w=canvas.parentElement.clientWidth;CW=w;CH=Math.round(w*0.40);canvas.width=CW;canvas.height=CH;canvas.style.height=CH+'px'}resize();window.addEventListener('resize',()=>{resize();drawScene()});let currentLap=0,playing=false,playInterval=null,speed=1500,carPositions={},targetPositions={},animFrame=null;CARS.forEach(c=>{carPositions[c.key]=0;targetPositions[c.key]=0});const ML=0.16,MR=0.05,LANE_TOP=0.18,LANE_TOTAL=0.64;function getLaneY(i){const h=CH*LANE_TOTAL/4;return CH*LANE_TOP+i*h+h/2}function getX(p){return CW*ML+p*CW*(1-ML-MR)}function frToProgress(fr){return Math.max(0,Math.min(1,(fr-65)/35))}function drawScene(){ctx.clearRect(0,0,CW,CH);drawGrandstands();drawRoad();drawStartLine();drawFinishLine();drawGridLines();drawCars()}
function drawGrandstands(){const rows=4,h=CH*LANE_TOP;for(let r=0;r<rows;r++){const rh=h/rows,y=r*rh;ctx.fillStyle=r%2===0?'${gsA}':'${gsB}';ctx.fillRect(0,y,CW,rh-1);ctx.fillStyle='${gsDot}';for(let x=8;x<CW;x+=16){ctx.beginPath();ctx.arc(x,y+rh/2,2,0,Math.PI*2);ctx.fill()}}const bTop=CH*(LANE_TOP+LANE_TOTAL),bH=CH-bTop;for(let r=0;r<3;r++){const rh=bH/3;ctx.fillStyle=r%2===0?'${gsA}':'${gsB}';ctx.fillRect(0,bTop+r*rh,CW,rh-1);ctx.fillStyle='${gsDot}';for(let x=12;x<CW;x+=16){ctx.beginPath();ctx.arc(x,bTop+r*rh+rh/2,2,0,Math.PI*2);ctx.fill()}}ctx.save();ctx.font='bold '+CW*0.06+'px Barlow Condensed,sans-serif';ctx.fillStyle='${wm}';ctx.textAlign='center';ctx.fillText('COCA-COLA',CW*0.5,CH*0.55);ctx.restore()}
function drawRoad(){const y=CH*LANE_TOP,h=CH*LANE_TOTAL;const grad=ctx.createLinearGradient(0,y,0,y+h);grad.addColorStop(0,'${rdA}');grad.addColorStop(0.5,'${rdB}');grad.addColorStop(1,'${rdA}');ctx.fillStyle=grad;ctx.fillRect(0,y,CW,h);for(let i=1;i<4;i++){const ly=getLaneY(i)-CH*LANE_TOTAL/8;ctx.strokeStyle='${lane}';ctx.setLineDash([12,8]);ctx.beginPath();ctx.moveTo(CW*ML,ly);ctx.lineTo(CW*(1-MR),ly);ctx.stroke();ctx.setLineDash([])}[y,y+h].forEach(by=>{for(let x=0;x<CW;x+=20){ctx.fillStyle=x%40<20?'#E8002D':'#fff';ctx.fillRect(x,by-3,20,6)}})}
function drawStartLine(){const x=CW*ML;for(let r=0;r<Math.ceil(CH*LANE_TOTAL/8);r++){const y=CH*LANE_TOP+r*8;ctx.fillStyle=r%2===0?'#fff':'${stB}';ctx.fillRect(x-4,y,8,8)}}function drawFinishLine(){const x=CW*(1-MR)-6;for(let r=0;r<Math.ceil(CH*LANE_TOTAL/8);r++){const y=CH*LANE_TOP+r*8;for(let c=0;c<3;c++){ctx.fillStyle=(r+c)%2===0?'#fff':'${fnB}';ctx.fillRect(x-12+c*8,y,8,8)}}ctx.save();ctx.font='bold 9px Barlow Condensed,sans-serif';ctx.fillStyle='${gridTxt}';ctx.textAlign='center';ctx.fillText('META',x,CH*LANE_TOP-6);ctx.restore()}function drawGridLines(){ctx.save();ctx.font='8px Barlow Condensed,sans-serif';ctx.textAlign='center';[70,75,80,85,90,95].forEach(v=>{const x=getX(frToProgress(v));ctx.strokeStyle='${grid}';ctx.beginPath();ctx.moveTo(x,CH*LANE_TOP);ctx.lineTo(x,CH*(LANE_TOP+LANE_TOTAL));ctx.stroke();ctx.fillStyle='${gridTxt}';ctx.fillText(v+'%',x,CH*(LANE_TOP+LANE_TOTAL)+12)});ctx.restore()}
function drawF1Car(x,y,car,scale){const s=scale||1;ctx.save();ctx.translate(x,y);ctx.scale(-s,s);if(playing){const fl=8+Math.random()*12;ctx.fillStyle='rgba(255,'+(100+Math.random()*100)+',0,'+(0.4+Math.random()*0.3)+')';ctx.beginPath();ctx.moveTo(-28,-2);ctx.lineTo(-28-fl,0);ctx.lineTo(-28,2);ctx.fill()}ctx.fillStyle=car.color;ctx.beginPath();ctx.moveTo(-26,-6);ctx.lineTo(-10,-8);ctx.lineTo(16,-8);ctx.lineTo(26,-5);ctx.lineTo(28,-2);ctx.lineTo(28,2);ctx.lineTo(26,5);ctx.lineTo(16,8);ctx.lineTo(-10,8);ctx.lineTo(-26,6);ctx.closePath();ctx.fill();ctx.fillStyle='${cockpit}';ctx.beginPath();ctx.moveTo(2,-6);ctx.lineTo(8,-10);ctx.lineTo(18,-10);ctx.lineTo(22,-6);ctx.closePath();ctx.fill();ctx.strokeStyle=car.color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(8,-10);ctx.quadraticCurveTo(13,-14,18,-10);ctx.stroke();ctx.fillStyle=car.color;ctx.fillRect(26,-10,4,20);ctx.fillRect(-28,-10,3,4);ctx.fillRect(-28,6,3,4);ctx.fillRect(-30,-11,2,22);ctx.fillStyle='${wheel}';ctx.strokeStyle=car.color;ctx.lineWidth=1.5;[[-12,9],[-12,-9],[20,8],[20,-8]].forEach(([wx,wy])=>{ctx.beginPath();ctx.ellipse(wx,wy,4,6,0,0,Math.PI*2);ctx.fill();ctx.stroke()});ctx.restore()}
function drawCars(){const sorted=[...CARS].sort((a,b)=>carPositions[a.key]-carPositions[b.key]);sorted.forEach(car=>{const i=CARS.indexOf(car);const ly=getLaneY(i);const p=carPositions[car.key];const x=getX(p);const trailGrad=ctx.createLinearGradient(CW*ML,0,x,0);trailGrad.addColorStop(0,'transparent');trailGrad.addColorStop(1,car.color+'33');ctx.fillStyle=trailGrad;ctx.fillRect(CW*ML,ly-4,x-CW*ML,8);drawF1Car(x,ly,car,1.7);const val=getCurrentValue(car.key);ctx.save();ctx.font='bold 22px Barlow Condensed,sans-serif';ctx.fillStyle=car.color;ctx.textAlign='left';ctx.shadowColor=car.color;ctx.shadowBlur=${shadow};ctx.fillText(val.toFixed(1)+'%',x+58,ly+7);ctx.restore();ctx.save();ctx.font='bold 28px Barlow Condensed,sans-serif';ctx.fillStyle=car.color;ctx.textAlign='left';ctx.fillText(car.label,CW*0.02,ly+8);ctx.restore()})}function getCurrentValue(key){return displayValues[key]||0}let displayValues={},animating=false;CARS.forEach(c=>{displayValues[c.key]=0});
function animateRace(){if(!animating)return;let allDone=true;const d=RACE_DATA[currentLap];CARS.forEach(c=>{const target=d[c.key];const targetP=frToProgress(target);const diff=targetP-carPositions[c.key];const valDiff=target-displayValues[c.key];if(Math.abs(diff)>0.0005){carPositions[c.key]+=diff*0.012;displayValues[c.key]+=valDiff*0.012;allDone=false}else{carPositions[c.key]=targetP;displayValues[c.key]=target}});drawScene();window.parent.postMessage({type:'f1-race-values',values:{FEMSA:displayValues.FEMSA,LEE:displayValues.LEE,ANDINA:displayValues.ANDINA,ARCA:displayValues.ARCA}},'*');if(!allDone){animFrame=requestAnimationFrame(animateRace)}else if(currentLap<RACE_DATA.length-1){currentLap++;setTimeout(()=>{startRaceAnimation()},400)}else{animating=false;playing=false;document.getElementById('btnPlay').innerHTML='▶ START'}}
function startRaceAnimation(){const d=RACE_DATA[currentLap];document.getElementById('lapLabel').textContent='YTD '+d.mes;animating=true;cancelAnimationFrame(animFrame);animateRace()}
function togglePlay(){if(animating){animating=false;playing=false;cancelAnimationFrame(animFrame);document.getElementById('btnPlay').innerHTML='▶ START';return}CARS.forEach(c=>{carPositions[c.key]=0;displayValues[c.key]=0});drawScene();playing=true;document.getElementById('btnPlay').innerHTML='⏸ PAUSA';startRaceAnimation()}
function nextLap(){if(currentLap<RACE_DATA.length-1){currentLap++;startRaceAnimation()}}
function prevLap(){if(currentLap>0){currentLap--;startRaceAnimation()}}
function doReset(){playing=false;animating=false;clearInterval(playInterval);cancelAnimationFrame(animFrame);currentLap=0;CARS.forEach(c=>{carPositions[c.key]=0;targetPositions[c.key]=0;displayValues[c.key]=0});document.getElementById('btnPlay').innerHTML='▶ START';document.getElementById('lapLabel').textContent="YTD Jul'26";drawScene();window.parent.postMessage({type:'f1-race-values',values:{FEMSA:0,LEE:0,ANDINA:0,ARCA:0}},'*')}
function setSpeed(s,btn){speed=s;document.querySelectorAll('.speed-btns .btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active')}
CARS.forEach(c=>{carPositions[c.key]=0;displayValues[c.key]=0});drawScene();
function reportHeight(){window.parent.postMessage({type:'f1-race-height',height:document.documentElement.scrollHeight},'*')}
reportHeight();new ResizeObserver(reportHeight).observe(document.body);
</script></body></html>`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   STYLE CONSTANTS — Chile Design System
   ═══════════════════════════════════════════════════════════════════════════ */

function mkTheme(dk) {
  const o = dk ? 0 : 1;
  return {
    red: "#E8002D",
    navy: dk ? "#000000" : "#F2F2F2",
    navyMid: dk ? "#111111" : "#FFFFFF",
    navyLight: dk ? "#1A1A1A" : "#F0F0F0",
    white: dk ? "#FFFFFF" : "#111111",
    gray500: dk ? "#FFFFFF" : "#6B7280",
    gray200: dk ? "#D0D9E8" : "#374151",
    gray700: dk ? "#2E3F5C" : "#D1D5DB",
    font: "'Barlow Condensed', sans-serif",
    fontBody: "'Barlow', sans-serif",
    brd: dk ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.08)",
    brd2: dk ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.06)",
    brd3: dk ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.12)",
    bgSub: dk ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.03)",
    bgBar: dk ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)",
    bgBar2: dk ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.06)",
    bgBar3: dk ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.08)",
    bgBar4: dk ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.1)",
    gn: dk ? "#4ADE80" : "#16A34A",
    rd: dk ? "#EF4444" : "#DC2626",
    gnBg: dk ? "rgba(74,222,128,.12)" : "rgba(22,163,74,.12)",
    rdBg: dk ? "rgba(239,68,68,.12)" : "rgba(220,38,38,.12)",
  };
}

let V = mkTheme(true);

/* ═══════════════════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

function frColor(v) {
  if (v == null) return "transparent";
  if (v >= 95) return "rgba(34,197,94,.35)";
  if (v >= 85) return "rgba(22,101,52,.35)";
  if (v >= 82) return "rgba(251,146,60,.25)";
  if (v >= 78) return "rgba(194,65,12,.25)";
  if (v >= 70) return "rgba(153,27,27,.3)";
  return "rgba(220,38,38,.35)";
}
function frBorder(v) {
  if (v == null) return "none";
  if (v >= 95) return "1px solid rgba(34,197,94,.5)";
  if (v < 70) return "1px solid rgba(220,38,38,.5)";
  return "none";
}
function frTextColor(v) {
  if (v == null) return V.gray700;
  if (v >= 95) return "#22C55E";
  if (v >= 85) return "#166534";
  if (v >= 82) return "#FB923C";
  if (v >= 78) return "#C2410C";
  if (v >= 70) return "#991B1B";
  return "#EF4444";
}
function barFillColor(v) {
  if (v >= 95) return "#22C55E";
  if (v >= 85) return "#166534";
  if (v >= 82) return "#FB923C";
  if (v >= 78) return "#C2410C";
  if (v >= 70) return "#991B1B";
  return "#EF4444";
}
function dohColor(v) {
  if (v == null) return "transparent";
  if (v <= 1) return "rgba(220,38,38,.35)";
  if (v <= 4) return "rgba(194,65,12,.25)";
  if (v <= 11) return "rgba(74,222,128,.3)";
  if (v <= 30) return "rgba(22,163,74,.25)";
  if (v <= 45) return "rgba(251,146,60,.25)";
  return "rgba(239,68,68,.3)";
}
function dohTextColor(v) {
  if (v == null) return V.gray700;
  if (v <= 1) return "#DC2626";
  if (v <= 4) return "#C2410C";
  if (v <= 11) return "#4ADE80";
  if (v <= 30) return "#16A34A";
  if (v <= 45) return "#FB923C";
  return "#EF4444";
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function Tag({ lb, v, c }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: c + "18", border: "1px solid " + c + "44", borderRadius: 12, padding: "2px 8px", fontSize: 11, color: c, fontWeight: 700, whiteSpace: "nowrap", fontFamily: V.font, letterSpacing: 0.5 }}>
      {lb} {v.toFixed(1)}%
    </span>
  );
}

function FRCell({ v }) {
  if (v == null) return <span style={{ color: V.gray700, fontFamily: V.font, fontWeight: 700 }}>—</span>;
  const w = Math.max(0, Math.min(100, v));
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
      <span style={{ fontFamily: V.font, fontWeight: 900, fontSize: 15, color: frTextColor(v), minWidth: 50, textAlign: "right" }}>{v.toFixed(1)}%</span>
      <div style={{ width: 60, height: 5, background: V.bgBar, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ width: w + "%", height: "100%", borderRadius: 3, background: barFillColor(v) }} />
      </div>
    </div>
  );
}

function SecLabel({ children }) {
  return <div style={{ fontFamily: V.font, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: V.white, marginBottom: 14 }}>{children}</div>;
}

function SumCard({ title, value, sub, accent, children, wide }) {
  return (
    <div style={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 10, padding: 16, borderLeft: "3px solid " + (accent || V.red), ...(wide ? { background: `linear-gradient(135deg,rgba(232,0,45,.05),${V.navyMid})` } : {}) }}>
      <div style={{ fontFamily: V.font, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: V.gray500, marginBottom: 8 }}>{title}</div>
      <div style={{ fontFamily: V.font, fontSize: "2.4rem", fontWeight: 900, lineHeight: 1, color: V.white }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: V.gray500, marginTop: 4 }}>{sub}</div>}
      {children}
    </div>
  );
}

function NavBtn({ active, onClick, children, highlight }) {
  return (
    <button onClick={onClick} style={{
      background: highlight ? "rgba(232,0,45,.15)" : "none",
      border: highlight ? "1px solid rgba(232,0,45,.4)" : "none",
      color: active ? V.white : V.gray500,
      fontFamily: V.font, fontSize: 15, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
      padding: "15px 18px 13px", cursor: "pointer", borderBottom: active ? "3px solid " + V.red : "3px solid transparent",
      transition: "all 0.2s",
    }}>
      {children}
    </button>
  );
}

function Pill({ label, color, bgAlpha }) {
  return (
    <div style={{ fontFamily: V.font, fontWeight: 800, fontSize: 13, letterSpacing: 1, padding: "6px 14px", borderRadius: 20, textTransform: "uppercase", background: color + (bgAlpha || "40"), border: "1px solid " + color, color: color }}>
      {label}
    </div>
  );
}

// Waterfall / bridge bar used in the loss tree
function WFBar({ label, lo, hi, X, color, txt, col, bold, floating }) {
  const left = X(Math.min(lo, hi));
  const width = Math.abs(X(hi) - X(lo));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "112px 1fr 64px", gap: 8, alignItems: "center" }}>
      <span style={{ fontFamily: V.font, fontSize: 15, fontWeight: bold ? 800 : 600, color: bold ? col : V.gray200, textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      <div style={{ position: "relative", height: bold ? 20 : 16, background: V.bgBar2, borderRadius: 4 }}>
        <div style={{ position: "absolute", left: left + "%", width: Math.max(1, width) + "%", top: 0, bottom: 0, background: color, borderRadius: 3, opacity: floating ? 0.88 : 1 }} />
      </div>
      <span style={{ fontFamily: V.font, fontSize: 15, fontWeight: 800, color: col, textAlign: "left" }}>{txt}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════════════════════ */

export default function App() {
  
  const [view, setView] = useState("TOTAL CANAL");
  const [act, setAct] = useState({ F: true, L: true, A: true, AR: true, T: true });
  const [ytdT, setYtdT] = useState("b");
  const [bflt, setBflt] = useState("ARG");
  const [raceH, setRaceH] = useState(620);
  const [mainTab, setMainTab] = useState("overview");
  const [catClient, setCatClient] = useState("ALL");
  const [catMes, setCatMes] = useState("jul");
  const [catBot, setCatBot] = useState("ALL");
  const [activeCats, setActiveCats] = useState(new Set(["AP","AS","EN","GA","IS","JU"]));
  const toggleCat = (ck) => setActiveCats(prev => { const n = new Set(prev); n.has(ck) ? n.delete(ck) : n.add(ck); return n; });
  const [raceVals, setRaceVals] = useState({ FEMSA: 0, LEE: 0, ANDINA: 0, ARCA: 0 });

  // Reassign global V on every render so helper functions pick up the current theme
  V = mkTheme(true);

  useEffect(() => {
    const handler = (e) => {
      if (e.data && e.data.type === 'f1-race-height' && e.data.height) setRaceH(e.data.height);
      if (e.data && e.data.type === 'f1-race-values') setRaceVals(e.data.values);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const cd2 = TR[view] || TR["TOTAL CANAL"];
  const ytd = YTD[view] || {};
  const yi = ytdT === "b" ? BYTD : CYTD;
  const bd = BAR_DATA[bflt] || BAR_DATA.ARG;
  const bc = bflt === "ARG" ? BOTTLER_COLORS.arg : (BOTTLER_COLORS[bflt.toLowerCase()] || V.red);
  const VIEWS = ["TOTAL CANAL", "GDN", "CRF", "CENCOSUD", "LA ANONIMA", "DIA"];

  // Style helpers for filter pills
  const pillBtn = (on, col) => ({
    padding: "5px 14px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer",
    border: "1.5px solid " + (on ? col : V.brd3),
    background: on ? col + "25" : "transparent",
    color: on ? col : V.gray500, whiteSpace: "nowrap", fontFamily: V.font, letterSpacing: 1, textTransform: "uppercase",
  });

  const tabBtnStyle = (on) => ({
    padding: "5px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer",
    border: "none", letterSpacing: 1, textTransform: "uppercase", fontFamily: V.font,
    background: on ? V.red : "transparent", color: on ? "#fff" : V.gray500,
  });

  const navBg = { background: V.navyMid, borderBottom: "1px solid " + V.brd2, padding: "0 36px", display: "flex", gap: 0 };

  /* ═══ CATEGORY TAB RENDERING ═══ */
  function renderCatTab() {
    const src = mainTab === "fr" ? CAT_FR : mainTab === "is" ? CAT_IS : CAT_DOH;
    const label = mainTab === "fr" ? "FILL RATE" : mainTab === "is" ? "INSTOCK" : "DAYS ON HAND";
    const isPct = mainTab !== "doh";
    const clients = catClient === "ALL" ? CLIENTS : [catClient];
    const botFilter = catBot;
    const getColor = isPct ? frColor : dohColor;
    const fmt = (v) => (v == null ? "—" : isPct ? v.toFixed(1) + "%" : v.toFixed(1) + "d");
    const catColors = { AP: "#5BA8FF", AS: "#CC80FF", EN: "#F5C842", GA: V.rd, IS: "#3DFFB0", JU: "#FF7043" };
    const getTextColor = isPct ? frTextColor : dohTextColor;
    const getBorder = isPct ? frBorder : () => "none";

    return (
      <div style={{ padding: "28px 36px", display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontFamily: V.font, fontSize: 18, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>{label} por Categoría</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 2, background: V.navyLight, borderRadius: 8, padding: 2 }}>
              {[{ k: "ALL", l: "TODOS" }, { k: "Cencosud", l: "CENCOSUD" }, { k: "GDN", l: "GDN" }, { k: "CRF", l: "CARREFOUR" }, { k: "La Anonima", l: "LA ANONIMA" }].map(c => (
                <button key={c.k} onClick={() => setCatClient(c.k)} style={tabBtnStyle(catClient === c.k)}>{c.l}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 2, background: V.navyLight, borderRadius: 8, padding: 2 }}>
              {[{ k: "ALL", l: "TODOS", c: "#888" }, { k: "Femsa", l: "FEMSA", c: BOTTLER_COLORS.femsa }, { k: "Andina", l: "ANDINA", c: BOTTLER_COLORS.andina }, { k: "Lee", l: "LEE", c: BOTTLER_COLORS.lee }, { k: "Arca", l: "ARCA", c: BOTTLER_COLORS.arca }].map(b => (
                <button key={b.k} onClick={() => setCatBot(b.k)} style={{ ...tabBtnStyle(catBot === b.k), background: catBot === b.k ? b.c + "33" : "transparent", color: catBot === b.k ? b.c : V.gray500, borderBottom: catBot === b.k ? "2px solid " + b.c : "2px solid transparent" }}>{b.l}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 2, background: V.navyLight, borderRadius: 8, padding: 2 }}>
              {[{ k: "ene", l: "ENE'26" }, { k: "feb", l: "FEB'26" }, { k: "mar", l: "MAR'26" }, { k: "abr", l: "ABR'26" }, { k: "may", l: "MAY'26" }, { k: "jun", l: "JUN'26" }, { k: "jul", l: "JUL'26" }, { k: "both", l: "EVOLUCIÓN" }].map(m => (
                <button key={m.k} onClick={() => setCatMes(m.k)} style={tabBtnStyle(catMes === m.k)}>{m.l}</button>
              ))}
            </div>
          </div>
          {/* Category filters — only show in EVOLUCIÓN mode */}
          {catMes === "both" && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
              <span style={{ fontSize: 10, color: V.gray500, fontFamily: V.font, letterSpacing: 1, textTransform: "uppercase", alignSelf: "center", marginRight: 4 }}>Categorías:</span>
              <button onClick={() => setActiveCats(new Set(["AP","AS","EN","GA","IS","JU"]))} style={{ fontSize: 10, fontFamily: V.font, fontWeight: 700, letterSpacing: 1, padding: "4px 10px", borderRadius: 6, cursor: "pointer", border: "1px solid "+V.brd, background: activeCats.size === 6 ? V.red : "transparent", color: activeCats.size === 6 ? "#fff" : V.gray500 }}>TODAS</button>
              {CAT_ORDER.map(ck => (
                <button key={ck} onClick={() => toggleCat(ck)} style={{ fontSize: 10, fontFamily: V.font, fontWeight: 700, letterSpacing: 1, padding: "4px 10px", borderRadius: 6, cursor: "pointer", border: "1px solid "+(activeCats.has(ck) ? catColors[ck] : V.brd), background: activeCats.has(ck) ? catColors[ck]+"22" : "transparent", color: activeCats.has(ck) ? catColors[ck] : V.gray500 }}>{CAT_KEYS[ck]}</button>
              ))}
            </div>
          )}
        </div>

        {/* DYNAMIC INSIGHTS — react to filters */}
        {(() => {
          const isDoh = mainTab === "doh";
          const isIS = mainTab === "is";
          const allVals = [];
          clients.forEach(cl => {
            const clData = src[cl] || {};
            const mesKey = catMes === "both" ? "jul" : catMes;
            const mesData = clData[mesKey] || clData.jun || clData.may || clData.abr || clData.mar || clData.feb || clData.ene || {};
            Object.entries(mesData).forEach(([bot, cats]) => {
              if (botFilter !== "ALL" && bot !== botFilter) return;
              Object.entries(cats).forEach(([cat, val]) => {
                if (cat !== "TOT" && val != null) allVals.push({ cl, bot, cat: CAT_KEYS[cat] || cat, val });
              });
            });
          });
          if (allVals.length === 0) return null;
          const fmtV = (v) => isPct ? v.toFixed(1) + "%" : v.toFixed(0) + "d";
          let problems, opportunities, bestPerf;
          if (isDoh) {
            problems = allVals.filter(v => v.val > 45 || v.val <= 1).sort((a, b) => b.val - a.val).slice(0, 3);
            opportunities = allVals.filter(v => v.val > 30 && v.val <= 45).sort((a, b) => b.val - a.val).slice(0, 3);
            bestPerf = allVals.filter(v => v.val > 4 && v.val <= 11).sort((a, b) => a.val - b.val).slice(0, 3);
          } else if (isIS) {
            problems = allVals.filter(v => v.val < 87).sort((a, b) => a.val - b.val).slice(0, 3);
            opportunities = allVals.filter(v => v.val >= 87 && v.val < 92).sort((a, b) => a.val - b.val).slice(0, 3);
            bestPerf = allVals.filter(v => v.val >= 95).sort((a, b) => b.val - a.val).slice(0, 3);
          } else {
            problems = allVals.filter(v => v.val < 78).sort((a, b) => a.val - b.val).slice(0, 3);
            opportunities = allVals.filter(v => v.val >= 78 && v.val < 85).sort((a, b) => a.val - b.val).slice(0, 3);
            bestPerf = allVals.filter(v => v.val >= 95).sort((a, b) => b.val - a.val).slice(0, 3);
          }
          if (problems.length === 0 && opportunities.length === 0 && bestPerf.length === 0) return null;
          const renderList = (items, color, emoji, title) => {
            if (items.length === 0) return null;
            return (
              <div style={{ background: color + "0D", border: "1px solid " + color + "40", borderRadius: 12, padding: "14px 18px" }}>
                <div style={{ fontFamily: V.font, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color, marginBottom: 10 }}>{emoji} {title}</div>
                {items.map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < items.length - 1 ? "1px solid " + color + "20" : "none" }}>
                    <span style={{ fontSize: 12, color: V.gray500 }}>{item.bot} · {item.cat} · {item.cl}</span>
                    <span style={{ fontFamily: V.font, fontSize: 16, fontWeight: 900, color }}>{fmtV(item.val)}</span>
                  </div>
                ))}
              </div>
            );
          };
          const cols = [problems.length > 0, opportunities.length > 0, bestPerf.length > 0].filter(Boolean).length;
          return (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 12 }}>
              {renderList(problems, "#DC2626", "🔴", isDoh ? "Mayor DOH" : "Problemas")}
              {renderList(opportunities, "#FB923C", "🟡", "Oportunidades")}
              {renderList(bestPerf, "#22C55E", "🟢", isDoh ? "Menor DOH" : "Mejor performance")}
            </div>
          );
        })()}

        {/* Line charts when "EVOLUCIÓN" */}
        {catMes === "both" && (() => {
          const MESES = ["Ene'26", "Feb'26", "Mar'26", "Abr'26", "May'26", "Jun'26", "Jul'26"];
          return clients.map(cl => {
            const eneData = (src[cl] || {}).ene || {};
            const febData = (src[cl] || {}).feb || {};
            const marData = (src[cl] || {}).mar || {};
            const abrData = (src[cl] || {}).abr || {};
            const mayData = (src[cl] || {}).may || {};
            const junData = (src[cl] || {}).jun || {};
            const VALID_BOTS = ["Femsa", "Andina", "Lee", "Arca"];
            const allBots = Object.keys({ ...eneData, ...febData, ...marData, ...abrData, ...mayData, ...junData }).filter(b => VALID_BOTS.includes(b) && (botFilter === "ALL" || b === botFilter));
            if (allBots.length === 0) return (
              <div key={cl} style={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
                <div style={{ fontFamily: V.font, fontSize: 14, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>{cl.toUpperCase()}</div>
                <div style={{ color: V.gray500, fontSize: 12, marginTop: 6 }}>Sin datos comparativos</div>
              </div>
            );
            return allBots.map(bot => {
              const botColor = BOTTLER_COLORS[bot.toLowerCase()] || "#888";
              const eD = eneData[bot] || {};
              const fD = febData[bot] || {};
              const mD = marData[bot] || {};
              const chartData = MESES.map((m, mi) => {
                const abrD = abrData[bot] || {}; const mayD = mayData[bot] || {}; const junD = junData[bot] || {}; const d = mi === 0 ? eD : mi === 1 ? fD : mi === 2 ? mD : mi === 3 ? abrD : mi === 4 ? mayD : junD;
                const row = { mes: m };
                CAT_ORDER.forEach(ck => { if (d[ck] != null) row[ck] = d[ck]; });
                return row;
              });
              const [activeCats_unused] = [new Set(["AP","AS","EN","GA","IS","JU"])]; // moved to component level
              return (
                <div key={cl + bot} style={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: botColor, flexShrink: 0 }} />
                    <span style={{ fontFamily: V.font, fontSize: 15, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>{cl.toUpperCase()}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: botColor }}>· {bot}</span>
                    <span style={{ fontSize: 10, color: V.gray500, marginLeft: "auto", letterSpacing: 2, textTransform: "uppercase" }}>Ene → Feb → Mar → Abr → May → Jun 2026</span>
                  </div>
                  {/* Category filter pills */}
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                      <XAxis dataKey="mes" tick={{ fill: V.gray500, fontSize: 11, fontFamily: V.font }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: V.gray500, fontSize: 10 }} axisLine={false} tickLine={false} domain={isPct ? [60, 100] : ["auto", "auto"]} tickFormatter={v => isPct ? v + "%" : v + "d"} />
                      <Tooltip formatter={v => v != null ? (isPct ? v.toFixed(1) + "%" : v.toFixed(1) + "d") : "N/D"} contentStyle={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 6, color: V.white, fontSize: 11 }} />
                      {CAT_ORDER.filter(ck => activeCats.has(ck)).map(ck => (
                        <Line key={ck} type="monotone" dataKey={ck} stroke={catColors[ck]} strokeWidth={2.5} dot={{ r: 4, fill: catColors[ck] }} connectNulls={true}>
                          <LabelList dataKey={ck} position="top" style={{ fill: catColors[ck], fontSize: 11, fontWeight: 700 }} formatter={v => v != null ? (isPct ? v.toFixed(1) : v.toFixed(1)) : ""} />
                        </Line>
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", paddingTop: 8, borderTop: "1px solid "+V.brd2 }}>
                    {CAT_ORDER.filter(ck => activeCats.has(ck)).map(ck => (
                      <div key={ck} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 10, height: 3, borderRadius: 2, background: catColors[ck] }} />
                        <span style={{ fontSize: 9, color: V.gray500 }}>{CAT_KEYS[ck]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            });
          });
        })()}

        {/* Heatmap tables per client */}
        {catMes !== "both" && clients.map(cl => {
          const mesData = (src[cl] || {})[catMes];
          if (!mesData) return (
            <div key={cl} style={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
              <div style={{ fontFamily: V.font, fontSize: 14, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{cl.toUpperCase()}</div>
              <div style={{ color: V.gray500, fontSize: 12 }}>Sin datos para {catMes === "ene" ? "Enero" : catMes === "feb" ? "Febrero" : catMes === "mar" ? "Marzo" : catMes === "abr" ? "Abril" : catMes === "may" ? "Mayo" : catMes === "jun" ? "Junio" : "Julio"} 2026</div>
            </div>
          );
          const bots = Object.keys(mesData).filter(b => botFilter === "ALL" || b === botFilter).sort((a, b) => {
            const totA = mesData[a]?.TOT ?? mesData[a]?.GA ?? 0;
            const totB = mesData[b]?.TOT ?? mesData[b]?.GA ?? 0;
            return totB - totA;
          });
          if (bots.length === 0) return (
            <div key={cl} style={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 12, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
              <div style={{ fontFamily: V.font, fontSize: 14, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{cl.toUpperCase()}</div>
              <div style={{ color: V.gray500, fontSize: 12 }}>Sin datos de {botFilter} en {cl}</div>
            </div>
          );
          return (
            <div key={cl} style={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ background: V.navyLight, padding: "12px 18px", borderBottom: "2px solid " + V.red }}>
                <span style={{ fontFamily: V.font, fontSize: 15, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>{cl.toUpperCase()}</span>
                <span style={{ fontSize: 10, color: V.gray500, marginLeft: 10, letterSpacing: 2, textTransform: "uppercase" }}>{catMes === "ene" ? "Enero" : catMes === "feb" ? "Febrero" : catMes === "mar" ? "Marzo" : catMes === "abr" ? "Abril" : catMes === "may" ? "Mayo" : catMes === "jun" ? "Junio" : "Julio"} 2026</span>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: V.navyLight }}>
                      <th style={{ padding: "10px 14px", textAlign: "left", color: V.gray500, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: V.font, borderBottom: "1px solid "+V.brd2 }}>Bottler</th>
                      {CAT_ORDER.map(ck => (
                        <th key={ck} style={{ padding: "10px 8px", textAlign: "center", color: V.gray500, fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: V.font, borderBottom: "1px solid "+V.brd2 }}>{CAT_KEYS[ck]}</th>
                      ))}
                      {mesData[bots[0]] && mesData[bots[0]].TOT != null && (
                        <th style={{ padding: "10px 8px", textAlign: "center", color: V.white, fontSize: 11, fontWeight: 900, letterSpacing: 1, fontFamily: V.font, borderBottom: "1px solid "+V.brd2, borderLeft: "2px solid "+V.brd }}>TOTAL</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {bots.map((bot, bi) => {
                      const d = mesData[bot];
                      const botColor = BOTTLER_COLORS[bot.toLowerCase()] || V.white;
                      return (
                        <tr key={bot} style={{ borderBottom: bi < bots.length - 1 ? "1px solid "+V.brd2+"" : "none" }}>
                          <td style={{ padding: "10px 14px", fontWeight: 700, color: botColor, fontSize: 13, whiteSpace: "nowrap", fontFamily: V.font }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <div style={{ width: 6, height: 6, borderRadius: "50%", background: botColor, flexShrink: 0 }} />
                              {bot}
                            </div>
                          </td>
                          {CAT_ORDER.map(ck => (
                            <td key={ck} style={{ padding: "8px 6px", textAlign: "center", fontWeight: 700, color: getTextColor(d[ck]), background: getColor(d[ck]), fontSize: 13, fontFamily: V.font, border: getBorder(d[ck]), cursor: "default", transition: "filter .15s" }} onMouseEnter={e=>e.currentTarget.style.filter="brightness(1.3)"} onMouseLeave={e=>e.currentTarget.style.filter="brightness(1)"}>{fmt(d[ck])}</td>
                          ))}
                          {d.TOT != null && (
                            <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 900, color: getTextColor(d.TOT), background: getColor(d.TOT), fontSize: 14, fontFamily: V.font, borderLeft: "2px solid "+V.brd, border: getBorder(d.TOT) || ("2px solid "+V.brd), cursor: "default", transition: "filter .15s" }} onMouseEnter={e=>e.currentTarget.style.filter="brightness(1.3)"} onMouseLeave={e=>e.currentTarget.style.filter="brightness(1)"}>{fmt(d.TOT)}</td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {/* Legend */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", padding: "4px 0" }}>
          {(isPct
            ? [{l:"≥95%",c:frColor(96)},{l:"85-95%",c:frColor(90)},{l:"82-85%",c:frColor(83)},{l:"78-82%",c:frColor(80)},{l:"70-78%",c:frColor(74)},{l:"<70%",c:frColor(65)}]
            : [{l:"0-1d",c:dohColor(0.5)},{l:"1-4d",c:dohColor(3)},{l:"4-11d",c:dohColor(8)},{l:"11-30d",c:dohColor(20)},{l:"30-45d",c:dohColor(35)},{l:">45d",c:dohColor(50)}]
          ).map(lg => (
            <div key={lg.l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: lg.c, border: "1px solid "+V.brd }} />
              <span style={{ fontSize: 10, color: V.gray500 }}>{lg.l}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ═══ BOTTLER TAB RENDERING ═══ */
  function renderBottlerTab(name) {
    const meta = BOT_META[name] || {};
    const col = meta.color || V.red;
    const D = BOT_LOSS[name];

    if (!D) {
      return (
        <div style={{ padding: "64px 36px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, minHeight: 340 }}>
          <div style={{ width: 8, height: 42, background: col, borderRadius: 4 }} />
          <div style={{ fontFamily: V.font, fontSize: 26, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", color: col }}>{meta.label || name}</div>
          <div style={{ fontSize: 14, color: V.gray500, textAlign: "center", maxWidth: 480, lineHeight: 1.6 }}>
            Esperando el árbol de pérdidas de <b style={{ color: V.white }}>{meta.label || name}</b>. Cuando me pases el detalle del mes (motivos de no entrega + apertura por cadena + puntos), lo cargo acá con el mismo formato que Andina.
          </div>
        </div>
      );
    }

    const fmtN = (n) => (n == null ? "—" : Number(n).toLocaleString("es-AR"));
    const reasons = D.reasons.filter(r => r.nofr != null);
    const axisMin = 80;
    const X = v => Math.max(0, Math.min(100, ((v - axisMin) / (100 - axisMin)) * 100));
    let running = D.base;
    const segs = reasons.filter(r => r.nofr > 0.001).map(r => { const hi = running; const lo = running - r.nofr; running = lo; return { ...r, hi, lo }; });
    const chainsSorted = [...D.chains].sort((a, b) => b.nofr - a.nofr);
    const reasonsRanked = [...reasons].sort((a, b) => b.nofr - a.nofr);
    const cols = D.cols || REASON_COLS;
    const skuHasBne = D.topSku && D.topSku.items.some(it => it.bne != null);

    return (
      <div style={{ padding: "28px 36px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 6, height: 34, background: col, borderRadius: 3 }} />
          <div>
            <div style={{ fontFamily: V.font, fontSize: 26, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase", color: col }}>{meta.label || name}</div>
            <div style={{ fontSize: 11, color: V.gray500, letterSpacing: 2, textTransform: "uppercase" }}>Árbol de pérdidas · {D.month}</div>
          </div>
        </div>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {[
            { lb: "Fill Rate", v: D.total.fr.toFixed(1) + "%", c: col, tc: V.white },
            { lb: "No Fill Rate", v: D.total.nofr.toFixed(1) + "%", c: V.rd, tc: V.white },
            { lb: "Bultos no entregados", v: fmtN(D.total.bne), c: V.white, tc: V.white },
            { lb: "Bultos pedidos", v: fmtN(D.total.bp), c: V.white, tc: V.white },
          ].map((k, i) => (
            <div key={i} style={{ background: V.navyMid, border: "1px solid " + V.brd, borderRadius: 12, padding: "14px 16px", borderTop: "3px solid " + k.c }}>
              <div style={{ fontFamily: V.font, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: V.gray500, marginBottom: 6 }}>{k.lb}</div>
              <div style={{ fontFamily: V.font, fontSize: "2rem", fontWeight: 900, lineHeight: 1, color: k.tc }}>{k.v}</div>
            </div>
          ))}
        </div>

        {/* Árbol de pérdidas — waterfall + reason table */}
        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 16 }}>
          <div style={{ background: V.navyMid, border: "1px solid " + V.brd, borderRadius: 12, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
            <SecLabel>Árbol de pérdidas — del 100% al Fill Rate</SecLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <WFBar label="Entrega OK" lo={axisMin} hi={D.base} X={X} color={V.bgBar4} txt={D.base.toFixed(1) + "%"} bold col={V.white} />
              {segs.map((s, i) => (
                <WFBar key={i} label={s.short} lo={s.lo} hi={s.hi} X={X} color="#DC2626" txt={"-" + s.nofr.toFixed(1)} col={V.rd} floating />
              ))}
              <WFBar label="Fill Rate" lo={axisMin} hi={D.total.fr} X={X} color={col} txt={D.total.fr.toFixed(1) + "%"} bold col={V.white} />
            </div>
            <div style={{ fontSize: 10, color: V.gray500, marginTop: 12 }}>Escala {axisMin}–100%. Cada barra roja es la caída de Fill Rate por motivo de no entrega.</div>
          </div>

          <div style={{ background: V.navyMid, border: "1px solid " + V.brd, borderRadius: 12, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
            <SecLabel>Motivos de no entrega</SecLabel>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "6px 4px", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: V.gray500, fontFamily: V.font, borderBottom: "1px solid " + V.brd2 }}>Motivo</th>
                  <th style={{ textAlign: "right", padding: "6px 4px", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: V.gray500, fontFamily: V.font, borderBottom: "1px solid " + V.brd2 }}>BNE</th>
                  <th style={{ textAlign: "right", padding: "6px 4px", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: V.gray500, fontFamily: V.font, borderBottom: "1px solid " + V.brd2 }}>No FR</th>
                </tr>
              </thead>
              <tbody>
                {reasonsRanked.map((r, i) => (
                  <tr key={i}>
                    <td style={{ padding: "8px 4px", fontFamily: V.fontBody, color: V.gray200, fontWeight: 600, borderBottom: "1px solid " + V.brd2 }}>{r.lb}</td>
                    <td style={{ padding: "8px 4px", textAlign: "right", fontFamily: V.font, fontWeight: 700, color: V.gray200, borderBottom: "1px solid " + V.brd2 }}>{fmtN(r.bne)}</td>
                    <td style={{ padding: "8px 4px", textAlign: "right", fontFamily: V.font, fontWeight: 900, color: nofrText(r.nofr), borderBottom: "1px solid " + V.brd2 }}>{r.nofr.toFixed(1)}%</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ padding: "10px 4px", fontFamily: V.font, fontWeight: 900, color: V.white, borderTop: "2px solid " + V.brd }}>TOTAL</td>
                  <td style={{ padding: "10px 4px", textAlign: "right", fontFamily: V.font, fontWeight: 900, color: V.white, borderTop: "2px solid " + V.brd }}>{fmtN(D.total.bne)}</td>
                  <td style={{ padding: "10px 4px", textAlign: "right", fontFamily: V.font, fontWeight: 900, color: V.rd, borderTop: "2px solid " + V.brd }}>{D.total.nofr.toFixed(1)}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Apertura por cadena */}
        <div style={{ background: V.navyMid, border: "1px solid " + V.brd, borderRadius: 12, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
          <SecLabel>Apertura por cadena — No Fill Rate por motivo</SecLabel>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: V.navyLight }}>
                  <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: V.gray500, fontFamily: V.font }}>Cadena</th>
                  {cols.map(rc => (
                    <th key={rc.k} style={{ textAlign: "center", padding: "10px 8px", fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: V.gray500, fontFamily: V.font }}>{rc.lb}</th>
                  ))}
                  <th style={{ textAlign: "center", padding: "10px 8px", fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: V.gray500, fontFamily: V.font, borderLeft: "1px solid " + V.brd }}>No FR</th>
                  <th style={{ textAlign: "center", padding: "10px 8px", fontSize: 10, fontWeight: 900, letterSpacing: 0.5, textTransform: "uppercase", color: V.white, fontFamily: V.font }}>FR</th>
                </tr>
              </thead>
              <tbody>
                {chainsSorted.map((ch, ci) => (
                  <tr key={ci} style={{ borderBottom: ci < chainsSorted.length - 1 ? "1px solid " + V.brd2 : "none" }}>
                    <td style={{ padding: "10px 12px", fontFamily: V.font, fontWeight: 800, color: ch.color, whiteSpace: "nowrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: ch.color, display: "inline-block" }} />
                        {ch.lb}
                      </span>
                    </td>
                    {cols.map(rc => {
                      const v = ch.r[rc.k];
                      return <td key={rc.k} style={{ padding: "9px 8px", textAlign: "center", fontFamily: V.font, fontWeight: 700, color: "#FFFFFF", background: nofrColor(v) }}>{v != null ? v.toFixed(1) : "—"}</td>;
                    })}
                    <td style={{ padding: "9px 8px", textAlign: "center", fontFamily: V.font, fontWeight: 900, color: V.rd, borderLeft: "1px solid " + V.brd }}>{ch.nofr.toFixed(1)}%</td>
                    <td style={{ padding: "9px 8px", textAlign: "center", fontFamily: V.font, fontWeight: 900, color: frTextColor(ch.fr) }}>{ch.fr.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 10, color: V.gray500, marginTop: 10 }}>Valores = No Fill Rate (%). Más alto = más pérdida. Ordenado por No FR total (peor arriba).</div>
        </div>

        {/* TOP faltantes + Puntos principales */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 16 }}>
          <div style={{ background: V.navyMid, border: "1px solid " + V.brd, borderRadius: 12, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
            <SecLabel>Top faltantes — {D.topSku.reason}</SecLabel>
            <div style={{ fontSize: 12, color: V.gray200, marginBottom: 12, lineHeight: 1.5 }}>{D.topSku.note}</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "6px 4px", fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: V.gray500, fontFamily: V.font, borderBottom: "1px solid " + V.brd2 }}>#</th>
                  <th style={{ textAlign: "left", padding: "6px 4px", fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: V.gray500, fontFamily: V.font, borderBottom: "1px solid " + V.brd2 }}>Material</th>
                  {skuHasBne && <th style={{ textAlign: "right", padding: "6px 4px", fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: V.gray500, fontFamily: V.font, borderBottom: "1px solid " + V.brd2 }}>BNE</th>}
                  <th style={{ textAlign: "right", padding: "6px 4px", fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: V.gray500, fontFamily: V.font, borderBottom: "1px solid " + V.brd2 }}>{D.topSku.pctLabel || "%BNE"}</th>
                </tr>
              </thead>
              <tbody>
                {D.topSku.items.map((it, i) => (
                  <tr key={i} style={{ borderBottom: i < D.topSku.items.length - 1 ? "1px solid " + V.brd2 : "none" }}>
                    <td style={{ padding: "7px 4px", fontFamily: V.font, fontWeight: 800, color: V.gray500, verticalAlign: "top" }}>{i + 1}</td>
                    <td style={{ padding: "7px 4px", fontFamily: V.fontBody, color: V.gray200, lineHeight: 1.3 }}>
                      {it.mat}
                      {it.ean ? <div style={{ fontSize: 10, color: V.gray500, fontFamily: V.font }}>{it.ean}</div> : null}
                      {it.obs ? <div style={{ fontSize: 10, color: col, fontWeight: 600, marginTop: 2, fontFamily: V.fontBody }}>{it.obs}</div> : null}
                    </td>
                    {skuHasBne && <td style={{ padding: "7px 4px", textAlign: "right", fontFamily: V.font, fontWeight: 700, color: V.gray200, verticalAlign: "top" }}>{fmtN(it.bne)}</td>}
                    <td style={{ padding: "7px 4px", textAlign: "right", fontFamily: V.font, fontWeight: 900, color: col, verticalAlign: "top" }}>{it.pct.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {(D.subBreakdowns || (D.subBreakdown ? [D.subBreakdown] : [])).map((sb, si) => (
              <div key={si} style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid " + V.brd2 }}>
                <div style={{ fontFamily: V.font, fontSize: 12, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: V.white, marginBottom: 4 }}>{sb.title}</div>
                {sb.note && <div style={{ fontSize: 11, color: V.gray500, marginBottom: 10, lineHeight: 1.4 }}>{sb.note}</div>}
                {sb.rows.map((r, i) => {
                  const w = Math.max(4, Math.min(100, r.pct));
                  return (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 1fr 52px", gap: 10, alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontFamily: V.fontBody, fontSize: 12, fontWeight: 600, color: V.gray200 }}>{r.lb}</span>
                      <div style={{ height: 12, background: V.bgBar2, borderRadius: 6, overflow: "hidden" }}>
                        <div style={{ width: w + "%", height: "100%", background: r.color || V.rd, borderRadius: 6 }} />
                      </div>
                      <span style={{ fontFamily: V.font, fontSize: 13, fontWeight: 900, color: r.color || V.rd, textAlign: "right" }}>{r.pct.toFixed(1)}%</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ background: V.navyMid, border: "1px solid " + V.brd, borderRadius: 12, padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
            <SecLabel>Puntos principales del mes</SecLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {D.points.map((p, i) => (
                <div key={i} style={{ background: V.navyLight, border: "1px solid " + V.brd, borderLeft: "3px solid " + p.color, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ marginBottom: 5 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color: p.color, fontFamily: V.font, background: p.color + "1A", border: "1px solid " + p.color + "55", borderRadius: 10, padding: "2px 8px" }}>{p.tag}</span>
                  </div>
                  <div style={{ fontFamily: V.font, fontSize: 14, fontWeight: 800, color: V.white, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: V.gray200, lineHeight: 1.5, fontFamily: V.fontBody }}>{p.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ═══ MAIN RENDER ═══ */
  return (
    <div style={{ background: V.navy, color: V.white, fontFamily: V.fontBody, minHeight: "100vh", zoom: 1.15 }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ═══ HEADER ═══ */}
      <div style={{ background: V.navyMid, borderBottom: "3px solid " + V.red, padding: "24px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 0, top: 0, width: 400, height: "100%", background: "linear-gradient(90deg, transparent, rgba(232,0,45,0.06), rgba(245,200,66,0.04))", pointerEvents: "none" }} />
        <div>
          <h1 style={{ fontFamily: V.font, fontSize: "2rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: 2, margin: 0 }}>
            Dashboard <span style={{ color: "#5BA8FF" }}>Argentina</span> — Customer Service
          </h1>
          <p style={{ fontSize: 12, color: V.white, letterSpacing: 3, textTransform: "uppercase", marginTop: 3, fontFamily: V.font }}>Julio 2026 · Coca-Cola</p>
        </div>
      </div>

      {/* ═══ NAV ═══ */}
      <div style={navBg}>
        {[{ k: "overview", l: "Overview", hl: false }, { k: "fr", l: "Fill Rate", hl: false }, { k: "is", l: "Instock", hl: false }, { k: "doh", l: "DOH", hl: false }, { k: "bot_femsa", l: "Femsa", hl: false }, { k: "bot_lee", l: "Reg. Lee", hl: false }, { k: "bot_andina", l: "Andina", hl: false }, { k: "bot_arca", l: "Arca", hl: false }, { k: "race", l: "🏎 F1 Race", hl: true }].map(t => (
          <NavBtn key={t.k} active={mainTab === t.k} onClick={() => setMainTab(t.k)} highlight={t.hl}>{t.l}</NavBtn>
        ))}
      </div>

      {/* ═══ OVERVIEW ═══ */}
      {mainTab === "overview" && (
        <div style={{ padding: "28px 36px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* KPI Cards */}
          <SecLabel>Resumen Ejecutivo — Julio 2026</SecLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
            {[
              { lb: "ARG Total", v: "89.0%", s: "Jul'26", c: BOTTLER_COLORS.arg, d: "-0.9pp", up: false, record: false },
              { lb: "Femsa", v: "87.3%", s: "Jul'26", c: BOTTLER_COLORS.femsa, d: "-3.5pp", up: false },
              { lb: "Reginald Lee", v: "90.6%", s: "Jul'26", c: BOTTLER_COLORS.lee, d: "-1.0pp", up: false },
              { lb: "Andina", v: "90.7%", s: "Jul'26", c: BOTTLER_COLORS.andina, d: "+1.1pp", up: true },
              { lb: "Arca", v: "87.6%", s: "Jul'26", c: BOTTLER_COLORS.arca, d: "-1.2pp", up: false },
            ].map((k, i) => {
              const dc = k.up ? V.gn : V.rd;
              return (
                <div key={i} style={{ background: V.navyMid, border: "1px solid "+(k.record ? "rgba(255,215,0,.4)" : V.brd), borderRadius: 12, padding: "16px 18px", borderTop: "3px solid " + k.c, boxShadow: k.record ? "0 2px 16px rgba(255,215,0,.15)" : "0 2px 8px rgba(0,0,0,.3)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontFamily: V.font, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: V.gray500 }}>{k.lb}</div>
                    {k.record && <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,215,0,.12)", border: "1px solid rgba(255,215,0,.3)", borderRadius: 6, padding: "3px 9px" }}>
                      <span style={{ fontSize: 14 }}>🏆</span>
                      <span style={{ fontFamily: V.font, fontSize: 11, fontWeight: 800, letterSpacing: 1, color: "#FFD700", textTransform: "uppercase" }}>Record Histórico</span>
                    </div>}
                  </div>
                  <div style={{ fontFamily: V.font, fontSize: "2.4rem", fontWeight: 900, lineHeight: 1, color: V.white }}>{k.v}</div>
                  <div style={{ fontSize: 10, color: V.gray500, marginTop: 3, marginBottom: 6 }}>{k.s}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 14, color: dc, lineHeight: 1 }}>{k.up ? "▲" : "▼"}</span>
                    <span style={{ fontFamily: V.font, fontSize: 13, fontWeight: 800, color: dc }}>{k.d.replace(/^[+-]/, "")} vs Jun 25</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Evolution Line Chart */}
          <div style={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <SecLabel>Evolución Fill Rate Mensual</SecLabel>
                <div style={{ fontSize: 10, color: V.gray500 }}>{view}</div>
              </div>
              <div style={{ display: "flex", gap: 3, flexWrap: "nowrap" }}>
                {VIEWS.map(v => <button key={v} onClick={() => setView(v)} style={pillBtn(view === v, V.red)}>{v}</button>)}
              </div>
            </div>
            <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" }}>
              {LS.map(s => <button key={s.k} onClick={() => setAct(a => ({ ...a, [s.k]: !a[s.k] }))} style={pillBtn(act[s.k], s.c)}>{s.lb}</button>)}
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={cd2} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                <XAxis dataKey="m" tick={{ fill: V.gray500, fontSize: 10, fontFamily: V.font }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: V.gray500, fontSize: 10 }} axisLine={false} tickLine={false} domain={["auto", "auto"]} tickFormatter={v => v + "%"} />
                <Tooltip formatter={v => v ? v.toFixed(1) + "%" : "N/D"} contentStyle={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 6, color: V.white, fontSize: 11 }} />
                {LS.map(s => act[s.k] && (
                  <Line key={s.k} type="monotone" dataKey={s.k} stroke={s.c} strokeWidth={2} dot={{ r: 2, fill: s.c }} connectNulls={false}>
                    <LabelList dataKey={s.k} position="top" style={{ fill: s.c, fontSize: 11, fontWeight: 800 }} formatter={v => v != null ? v.toFixed(1) : ""} />
                  </Line>
                ))}
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", paddingTop: 8, borderTop: "1px solid "+V.brd2 }}>
              {LS.map(s => ytd[s.k] != null && (
                <span key={s.k} style={{ fontSize: 11, color: V.gray500, display: "flex", alignItems: "center", gap: 4, fontFamily: V.font }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.c, display: "inline-block" }} />
                  {s.lb} <b style={{ color: s.c }}>{ytd[s.k].toFixed(1)}%</b>
                </span>
              ))}
            </div>
          </div>

          {/* BAR + DELTA + INSTOCK row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 240px 220px", gap: 14 }}>
            {/* Bar chart */}
            <div style={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <SecLabel>Fill Rate por Cliente — Jul'26 vs Jul'25</SecLabel>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                  {[{ k: "ARG", l: "ARG", c: BOTTLER_COLORS.arg }, { k: "FEMSA", l: "Femsa", c: BOTTLER_COLORS.femsa }, { k: "LEE", l: "Lee", c: BOTTLER_COLORS.lee }, { k: "ANDINA", l: "Andina", c: BOTTLER_COLORS.andina }, { k: "ARCA", l: "Arca", c: BOTTLER_COLORS.arca }].map(b => (
                    <button key={b.k} onClick={() => setBflt(b.k)} style={pillBtn(bflt === b.k, b.c)}>{b.l}</button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={bd} margin={{ top: 52, right: 36, left: 0, bottom: 0 }} barCategoryGap="15%" barGap={3}>
                  <XAxis dataKey="n" tick={{ fill: V.gray500, fontSize: 10, fontFamily: V.font }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: V.gray500, fontSize: 10 }} axisLine={false} tickLine={false} domain={[60, 100]} tickFormatter={v => v + "%"} />
                  <Tooltip formatter={v => v ? v.toFixed(1) + "%" : "N/D"} contentStyle={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 6, color: V.white, fontSize: 11 }} />
                  <Bar dataKey="a" fill={V.bgBar3} radius={[3, 3, 0, 0]}>
                    <LabelList dataKey="a" position="top" style={{ fill: V.gray500, fontSize: 13, fontFamily: V.font, fontWeight: 700 }} formatter={v => v ? v.toFixed(1) + "%" : ""} />
                  </Bar>
                  <Bar dataKey="b" fill={bc} radius={[3, 3, 0, 0]}>
                    <LabelList dataKey="b" position="top" style={{ fill: bc, fontSize: 13, fontWeight: 800, fontFamily: V.font }} formatter={v => v ? v.toFixed(1) + "%" : ""} />
                    <LabelList dataKey="b" content={(props) => {
                      const { x, y, width, value, index } = props;
                      const row = bd[index];
                      if (!value || !row.a) return null;
                      const d = +(value - row.a).toFixed(1);
                      const isP = d >= 0;
                      const col = isP ? V.gn : V.rd;
                      return <text x={x + width / 2} y={y - 28} textAnchor="middle" fontSize={10} fontWeight={800} fill={col}>{isP ? "+" : ""}{d}pp</text>;
                    }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Delta */}
            <div style={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 12, padding: "16px 18px", boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
              <SecLabel>Delta Jul'26 vs Jul'25</SecLabel>
              {DLT.map((row, i) => {
                const ip = row.d >= 0; const lc = ip ? V.gn : V.rd; const maxD = Math.max(...DLT.map(r => Math.abs(r.d))); const bp = Math.min(48, (Math.abs(row.d) / maxD) * 45);
                return (
                  <div key={i} style={{ padding: "10px 0", borderBottom: i < DLT.length - 1 ? "1px solid "+V.brd2+"" : "none" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: row.c, fontFamily: V.font }}>{row.n}</span>
                      <span style={{ fontFamily: V.font, fontSize: 18, fontWeight: 900, color: lc, letterSpacing: -0.5 }}>{ip ? "+" : ""}{row.d}pp</span>
                    </div>
                    <div style={{ height: 8, background: V.bgBar2, borderRadius: 4, position: "relative" }}>
                      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: V.brd }} />
                      <div style={{ position: "absolute", top: 1, bottom: 1, left: ip ? "50%" : `calc(50% - ${bp}%)`, width: bp + "%", background: lc, borderRadius: ip ? "0 4px 4px 0" : "4px 0 0 4px", minWidth: 5 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* InStock */}
            <div style={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 12, padding: "16px 18px", boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
              <SecLabel>Instock — Jul'26</SecLabel>
              {[{ n: "Femsa", v: 92.1, c: BOTTLER_COLORS.femsa }, { n: "Reg. Lee", v: 93.5, c: BOTTLER_COLORS.lee }, { n: "Andina", v: 94.3, c: BOTTLER_COLORS.andina }, { n: "Arca", v: 92.9, c: BOTTLER_COLORS.arca }].map((e, i) => {
                const w = ((e.v - 68) / 32) * 100;
                return (
                  <div key={i} style={{ padding: "10px 0", borderBottom: i < 3 ? "1px solid "+V.brd2+"" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 14, color: e.c, fontWeight: 700, fontFamily: V.font }}>{e.n}</span>
                      <span style={{ fontFamily: V.font, fontSize: 18, fontWeight: 900, color: e.c }}>{e.v}%</span>
                    </div>
                    <div style={{ height: 8, background: V.bgBar2, borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: w + "%", height: "100%", background: e.c, borderRadius: 4 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ranking */}
          <div style={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
            <SecLabel>Ranking Clientes — Jun 2026</SecLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {RNK.map((row, i) => {
                const d = row.p != null ? +(row.f - row.p).toFixed(1) : null;
                const ip = d != null && d >= 0;
                const w = Math.max(4, ((row.f - 70) / 30) * 100);
                return (
                  <div key={i} style={{ background: V.navyLight, border: "1px solid "+V.brd, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,.2)", padding: "10px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontFamily: V.font, fontSize: 15, fontWeight: 800 }}>{row.c}</span>
                      {d != null && <span style={{ fontSize: 11, fontWeight: 700, color: ip ? V.gn : V.rd, background: ip ? V.gnBg : V.rdBg, border: "1px solid " + (ip ? V.gn : V.rd), borderRadius: 6, padding: "1px 6px", fontFamily: V.font }}>{ip ? "+" : ""}{d}pp</span>}
                    </div>
                    <div style={{ height: 22, background: V.bgBar2, borderRadius: 14, position: "relative", overflow: "hidden", marginBottom: 8 }}>
                      <div style={{ width: w + "%", height: "100%", background: V.bgBar4, borderRadius: 14 }} />
                      <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontFamily: V.font, fontSize: 13, fontWeight: 800, color: V.white }}>{row.f.toFixed(1)}%</span>
                    </div>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {Object.entries(row.b).map(([b, v]) => <Tag key={b} lb={b} v={v} c={BM[b] || "#888"} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* YTD */}
          <div style={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <SecLabel>Fill Rate YTD 2026</SecLabel>
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => setYtdT("b")} style={pillBtn(ytdT === "b", V.red)}>Por Bottler</button>
                <button onClick={() => setYtdT("c")} style={pillBtn(ytdT === "c", V.red)}>Por Cadena</button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {yi.map((row, i) => {
                const w = Math.max(8, ((row.v - 70) / 30) * 100);
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr auto", gap: 10, alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: row.c, flexShrink: 0 }} />
                      <span style={{ fontFamily: V.font, fontSize: 14, fontWeight: 700 }}>{row.n}</span>
                    </div>
                    <div style={{ height: 22, background: V.bgBar2, borderRadius: 14, position: "relative", overflow: "hidden" }}>
                      <div style={{ width: w + "%", height: "100%", background: V.bgBar3, borderRadius: 14 }} />
                      <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", fontFamily: V.font, fontSize: 12, fontWeight: 800, color: V.white }}>{row.v.toFixed(1)}%</span>
                      <div style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 3, flexWrap: "nowrap", overflow: "hidden" }}>
                        {Object.entries(row.s).map(([k, v]) => <Tag key={k} lb={k} v={v} c={ytdT === "b" ? "#888" : (BM[k] || "#888")} />)}
                      </div>
                    </div>
                    <span style={{ fontFamily: V.font, fontSize: 14, fontWeight: 800, width: 48, textAlign: "right" }}>{row.v.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ F1 RACE TAB ═══ */}
      {mainTab === "race" && (
        <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 0, borderRadius: 0, overflow: "hidden" }}>
          <div style={{ position: "relative", overflow: "hidden" }}>
            <iframe srcDoc={getF1HTML(true)} scrolling="no" style={{ width: "100%", height: raceH, border: "none", display: "block", overflow: "hidden" }} title="F1 Fill Rate Race" />
          </div>
          {/* Clasificacion */}
          {(() => {
            const _cars = [
              { key: "LEE", label: "Reginald Lee", color: BOTTLER_COLORS.lee, val: raceVals.LEE || 0 },
              { key: "FEMSA", label: "Femsa", color: BOTTLER_COLORS.femsa, val: raceVals.FEMSA || 0 },
              { key: "ANDINA", label: "Andina", color: BOTTLER_COLORS.andina, val: raceVals.ANDINA || 0 },
              { key: "ARCA", label: "Arca", color: BOTTLER_COLORS.arca, val: raceVals.ARCA || 0 },
            ].sort((a, b) => b.val - a.val);
            const _leader = _cars[0];
            return (
              <div style={{ background: V.navyMid, borderLeft: "2px solid " + V.red, display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ background: V.red, padding: "10px 14px", flexShrink: 0 }}>
                  <div style={{ fontFamily: V.font, fontSize: 15, letterSpacing: 3, color: "#fff", fontWeight: 900, textTransform: "uppercase" }}>Clasificación</div>
                  <div style={{ fontSize: 9, color: V.gray500, letterSpacing: 2, marginTop: 1 }}>YTD 2026</div>
                </div>
                <div style={{ padding: "14px 14px", borderBottom: "1px solid "+V.brd2, flexShrink: 0 }}>
                  <div style={{ fontFamily: V.font, fontSize: 11, fontWeight: 700, letterSpacing: 2, color: V.gray500, marginBottom: 10, textTransform: "uppercase" }}>Insights</div>
                  {[
                    { l: "Leader", v: _leader.label + " " + _leader.val + "%", c: _leader.color },
                    { l: "Gap vs #2", v: "+" + (_leader.val - _cars[1].val).toFixed(1) + "pp", c: V.gn },
                    { l: "Worst", v: _cars[3].label + " " + _cars[3].val + "%", c: V.rd },
                  ].map((r, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: V.gray500, fontWeight: 600 }}>{r.l}</span>
                      <span style={{ fontFamily: V.font, fontSize: 14, fontWeight: 800, color: r.c }}>{r.v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-evenly", padding: "10px 14px" }}>
                  {_cars.map((car, i) => {
                    const w = Math.max(8, ((car.val - 70) / 30) * 100);
                    const medals = ["🥇", "🥈", "🥉"];
                    return (
                      <div key={car.key} style={{ padding: "10px 0", borderBottom: i < 3 ? "1px solid "+V.brd2 : "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: i < 3 ? 20 : 14, fontWeight: 900 }}>{i < 3 ? medals[i] : i + 1}</span>
                          <span style={{ fontFamily: V.font, fontSize: i === 0 ? 16 : 14, fontWeight: 700, color: car.color, flex: 1 }}>{car.label}</span>
                          <span style={{ fontFamily: V.font, fontSize: i === 0 ? 26 : 20, fontWeight: 900, color: car.color }}>{car.val.toFixed(1)}%</span>
                        </div>
                        <div style={{ height: i === 0 ? 10 : 8, background: V.bgBar2, borderRadius: 5, overflow: "hidden" }}>
                          <div style={{ width: w + "%", height: "100%", background: `linear-gradient(90deg,${car.color}66,${car.color})`, borderRadius: 5 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ padding: "14px 14px", borderTop: "1px solid "+V.brd2, flexShrink: 0 }}>
                  <div style={{ fontFamily: V.font, fontSize: 11, fontWeight: 700, letterSpacing: 2, color: V.gray500, marginBottom: 10, textTransform: "uppercase" }}>Gap vs Líder</div>
                  {_cars.map((car, i) => {
                    const g = (_leader.val - car.val).toFixed(1);
                    return (
                      <div key={car.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: i < 3 ? "1px solid "+V.brd2 : "none" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: car.color }} />
                          <span style={{ fontFamily: V.font, fontSize: 13, fontWeight: 700, color: car.color }}>{car.label}</span>
                        </div>
                        <span style={{ fontFamily: V.font, fontSize: 14, fontWeight: 800, color: i === 0 ? V.gray500 : V.rd }}>{i === 0 ? "0.0" : "-" + g}pp</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ═══ CATEGORY TABS: FR / IS / DOH ═══ */}
      {(mainTab === "fr" || mainTab === "is" || mainTab === "doh") && renderCatTab()}

      {/* ═══ BOTTLER TABS ═══ */}
      {mainTab.startsWith("bot_") && renderBottlerTab(TAB_TO_BOT[mainTab])}

    </div>
  );
}
