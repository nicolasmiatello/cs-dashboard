import { useState, useEffect, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

/* ═══════════════════════════════════════════════════════════════════════════
   DATA — ARGENTINA FILL RATE
   ═══════════════════════════════════════════════════════════════════════════ */

const BOTTLER_COLORS = {
  femsa: "#E03E52",
  lee: "#CDC4AA",
  andina: "#E10600",
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
  ],
  CRF: [
    { m: "Ene'25", F: 83.0, L: 87.0, A: 81.0, AR: 71.0, T: 81.6 }, { m: "Feb'25", F: 86.5, L: 89.0, A: 82.0, AR: 75.0, T: 82.5 },
    { m: "Mar'25", F: 84.0, L: 90.5, A: 75.0, AR: 72.0, T: 79.0 }, { m: "Abr'25", F: 83.5, L: 89.0, A: 80.0, AR: 76.0, T: 82.0 },
    { m: "May'25", F: 87.0, L: 91.0, A: 85.0, AR: 78.0, T: 85.0 }, { m: "Jun'25", F: 91.5, L: 92.5, A: 86.5, AR: 80.0, T: 88.5 },
    { m: "Jul'25", F: 89.0, L: 90.0, A: 88.0, AR: 79.0, T: 87.5 }, { m: "Ago'25", F: 86.5, L: 91.5, A: 89.0, AR: 80.5, T: 87.0 },
    { m: "Sep'25", F: 83.5, L: 90.0, A: 82.5, AR: 80.0, T: 84.0 }, { m: "Oct'25", F: 84.0, L: 92.0, A: 85.0, AR: 75.0, T: 84.5 },
    { m: "Nov'25", F: 84.5, L: 91.0, A: 85.5, AR: 74.0, T: 84.5 }, { m: "Dic'25", F: 84.5, L: 92.0, A: 83.5, AR: 73.0, T: 83.5 },
    { m: "Ene'26", F: 86.0, L: 88.6, A: 86.5, AR: 74.4, T: 85.3 },
    { m: "Feb'26", F: 85.1, L: 89.0, A: 88.2, AR: 87.9, T: 86.7 },
  ],
  CENCOSUD: [
    { m: "Ene'25", F: 88.0, L: 88.0, A: 76.0, AR: 78.0, T: 82.7 }, { m: "Jun'25", F: 93.5, L: 93.5, A: 83.0, AR: 84.5, T: 89.5 },
    { m: "Sep'25", F: 88.5, L: 92.0, A: 79.5, AR: 84.0, T: 85.5 }, { m: "Dic'25", F: 91.0, L: 93.0, A: 78.5, AR: 80.5, T: 85.0 },
    { m: "Ene'26", F: 92.1, L: 90.1, A: 77.9, AR: 79.3, T: 84.1 },
    { m: "Feb'26", F: 93.6, L: 84.7, A: 89.2, AR: 91.8, T: 87.5 },
  ],
  LIBERTAD: [
    { m: "Ene'25", F: null, L: null, A: 71.1, AR: 78.5, T: 76.0 }, { m: "Feb'25", F: null, L: null, A: 74.3, AR: 86.5, T: 82.9 },
    { m: "Mar'25", F: null, L: null, A: 73.5, AR: 87.3, T: 82.9 }, { m: "Abr'25", F: null, L: null, A: 79.8, AR: 83.4, T: 82.2 },
    { m: "May'25", F: null, L: null, A: 80.9, AR: 80.2, T: 80.4 }, { m: "Jun'25", F: null, L: null, A: 90.2, AR: 93.6, T: 93.2 },
    { m: "Jul'25", F: null, L: null, A: 89.6, AR: 87.4, T: 88.1 }, { m: "Ago'25", F: null, L: null, A: 87.4, AR: 83.1, T: 87.4 },
    { m: "Sep'25", F: null, L: null, A: 91.6, AR: 80.6, T: 85.6 }, { m: "Oct'25", F: null, L: null, A: 84.4, AR: 95.3, T: 81.9 },
    { m: "Nov'25", F: null, L: null, A: 85.7, AR: 88.8, T: 91.5 }, { m: "Dic'25", F: null, L: null, A: 87.2, AR: null, T: 88.2 },
    { m: "Ene'26", F: 98.3, L: null, A: 84.6, AR: 73.4, T: 79.1 },
    { m: "Feb'26", F: null, L: null, A: 88.3, AR: 89.8, T: 89.2 },
  ],
  "LA ANONIMA": [{ m: "Ene'25", F: null, L: null, A: 76.0, AR: null, T: 76.0 }, { m: "Ene'26", F: 97.8, L: null, A: 78.3, AR: null, T: 78.4 }, { m: "Feb'26", F: 77.4, L: null, A: 84.0, AR: 90.1, T: 84.0 }],
  DIA: [{ m: "Ene'26", F: 84.7, L: null, A: null, AR: null, T: 84.7 }, { m: "Feb'26", F: 85.3, L: null, A: null, AR: null, T: 85.3 }],
};

const YTD = {
  "TOTAL CANAL": { F: 86.7, L: 89.5, A: 84.3, AR: 84.0, T: 85.6 },
  GDN: { F: 86.5, L: 89.3, A: 88.2, AR: 88.7, T: 87.7 },
  CRF: { F: 85.6, L: 88.8, A: 87.3, AR: 80.7, T: 85.9 },
  LIBERTAD: { A: 86.4, AR: 83.3, T: 84.7 },
  CENCOSUD: { F: 93.0, L: 82.6, A: 83.2, AR: 90.8, T: 87.2 },
  "LA ANONIMA": { F: 78.3, A: 81.0, AR: 71.4, T: 81.0 },
  DIA: { F: 85.0, T: 85.0 },
};

const LS = [
  { k: "F", lb: "Femsa", c: BOTTLER_COLORS.femsa },
  { k: "L", lb: "Reg. Lee", c: BOTTLER_COLORS.lee },
  { k: "A", lb: "Andina", c: BOTTLER_COLORS.andina },
  { k: "AR", lb: "Arca", c: BOTTLER_COLORS.arca },
  { k: "T", lb: "ARG", c: BOTTLER_COLORS.arg },
];

const BAR_DATA = {
  ARG: [{ n: "GDN", a: 84.9, b: 89.9 }, { n: "CRF", a: 85.6, b: 86.7 }, { n: "Cencosud", a: null, b: 87.5 }, { n: "Libertad", a: 82.9, b: 89.2 }, { n: "La Anonima", a: null, b: 84.0 }, { n: "Dia", a: null, b: 85.3 }],
  FEMSA: [{ n: "GDN", a: 92.5, b: 87.1 }, { n: "CRF", a: 89.2, b: 85.1 }, { n: "Cencosud", a: null, b: 93.6 }, { n: "Libertad", a: null, b: null }, { n: "La Anonima", a: null, b: 77.4 }, { n: "Dia", a: null, b: null }],
  LEE: [{ n: "GDN", a: 88.7, b: 88.5 }, { n: "CRF", a: 87.8, b: 89.0 }, { n: "Cencosud", a: null, b: 84.7 }, { n: "Libertad", a: null, b: null }, { n: "La Anonima", a: null, b: null }, { n: "Dia", a: null, b: null }],
  ANDINA: [{ n: "GDN", a: 81.2, b: 92.6 }, { n: "CRF", a: 78.2, b: 88.2 }, { n: "Cencosud", a: 75.4, b: 89.2 }, { n: "Libertad", a: 74.3, b: 88.3 }, { n: "La Anonima", a: 85.1, b: 84.0 }, { n: "Dia", a: null, b: null }],
  ARCA: [{ n: "GDN", a: 86.4, b: 91.2 }, { n: "CRF", a: 88.0, b: 87.9 }, { n: "Cencosud", a: null, b: 91.8 }, { n: "Libertad", a: 86.5, b: 89.8 }, { n: "La Anonima", a: null, b: 90.1 }, { n: "Dia", a: null, b: null }],
};

const RNK = [
  { c: "GDN", f: 89.9, p: 84.9, b: { Femsa: 87.1, Andina: 92.6, Lee: 88.5, Arca: 91.2 } },
  { c: "Cencosud", f: 87.5, p: null, b: { Femsa: 93.6, Andina: 89.2, Lee: 84.7, Arca: 91.8 } },
  { c: "CRF", f: 86.7, p: 85.6, b: { Femsa: 85.1, Andina: 88.2, Lee: 89.0, Arca: 87.9 } },
  { c: "Dia", f: 85.3, p: null, b: { Femsa: 85.3 } },
  { c: "Libertad", f: 89.2, p: 82.9, b: { Andina: 88.3, Arca: 89.8 } },
  { c: "La Anonima", f: 84.0, p: null, b: { Femsa: 77.4, Andina: 84.0, Arca: 90.1 } },
].sort((a, b) => b.f - a.f);

const DLT = [{ n: "Andina", d: 7.9, c: BOTTLER_COLORS.andina }, { n: "Reg. Lee", d: 1.9, c: BOTTLER_COLORS.lee }, { n: "Arca", d: 1.2, c: BOTTLER_COLORS.arca }, { n: "Femsa", d: -2.8, c: BOTTLER_COLORS.femsa }];

const BYTD = [
  { n: "Reg. Lee", v: 89.5, c: BOTTLER_COLORS.lee, s: { GDN: 89.3, CRF: 88.8, Cencosud: 82.6 } },
  { n: "Femsa", v: 86.7, c: BOTTLER_COLORS.femsa, s: { GDN: 86.5, CRF: 85.6, Cencosud: 93.0, "La An.": 78.3, Dia: 85.0 } },
  { n: "ARG Total", v: 85.6, c: BOTTLER_COLORS.arg, s: { GDN: 87.7, CRF: 85.9, Cencosud: 87.2, Libertad: 84.7, "La An.": 81.0, Dia: 85.0 } },
  { n: "Andina", v: 84.3, c: BOTTLER_COLORS.andina, s: { GDN: 88.2, CRF: 87.3, Cencosud: 83.2, Libertad: 86.4, "La An.": 81.0 } },
  { n: "Arca", v: 84.0, c: BOTTLER_COLORS.arca, s: { GDN: 88.7, CRF: 80.7, Cencosud: 90.8, Libertad: 83.3, "La An.": 71.4 } },
];
const CYTD = [
  { n: "GDN", v: 87.7, c: "#E8002D", s: { Femsa: 86.5, Andina: 88.2, Lee: 89.3, Arca: 88.7 } },
  { n: "Cencosud", v: 87.2, c: "#E8002D", s: { Femsa: 93.0, Andina: 83.2, Lee: 82.6, Arca: 90.8 } },
  { n: "CRF", v: 85.9, c: "#E8002D", s: { Femsa: 85.6, Andina: 87.3, Lee: 88.8, Arca: 80.7 } },
  { n: "Dia", v: 85.0, c: "#E8002D", s: { Femsa: 85.0 } },
  { n: "Libertad", v: 84.7, c: "#E8002D", s: { Andina: 86.4, Arca: 83.3 } },
  { n: "La Anonima", v: 81.0, c: "#E8002D", s: { Femsa: 78.3, Andina: 81.0, Arca: 71.4 } },
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
  },
  GDN: {
    feb: {
      Andina: { AP: 95.2, AS: 90.8, EN: 86.3, GA: 93.6, IS: 94.3, JU: 89.6 },
      Femsa: { AP: 84.5, AS: 93.5, EN: 55.7, GA: 74.1, IS: 45.6, JU: 63.4 },
      Lee: { AP: 77.1, AS: 95.8, EN: 100, GA: 91.1, IS: 98.8, JU: 70.4 },
      Arca: { AP: 95.2, AS: 93.1, EN: 91.8, GA: 90.4, IS: 95.9, JU: 92.8 },
    },
  },
  CRF: {
    ene: {
      Femsa: { AP: 91.7, AS: 92.4, EN: 87.5, GA: 83.8, IS: 79.6, JU: 84.4 },
      Andina: { AP: 78.3, AS: 76.7, EN: 89.5, GA: 88.9, IS: 85.2, JU: 78.9 },
      Lee: { AP: 89.6, AS: 85.6, EN: 94.0, GA: 88.1, IS: 79.5, JU: 94.6 },
      Arca: { AP: 97.9, AS: 77.9, EN: 89.4, GA: 67.0, IS: 90.1, JU: 91.1 },
    },
    feb: {
      Femsa: { AP: 94.8, AS: 95.0, EN: 95.5, GA: 88.4, IS: 46.1, JU: 78.7 },
      Andina: { AP: 86.1, AS: 79.8, EN: 81.5, GA: 90.0, IS: 90.4, JU: 82.2 },
      Lee: { AP: 93.7, AS: 95.8, EN: 91.7, GA: 89.3, IS: 98.1, JU: 73.6 },
      Arca: { AP: 96.2, AS: 90.0, EN: 84.0, GA: 85.8, IS: 92.4, JU: 90.6 },
    },
  },
  "La Anonima": {
    feb: {
      Andina: { AP: 85.2, AS: 84.3, EN: 85.6, GA: 75.3, IS: 100.0, JU: 70.9 },
      Femsa: { AP: 84.2, AS: 79.1, EN: 78.5, GA: 75.3, IS: 100.0, JU: 82.3 },
      Arca: { AP: 95.6, AS: 73.6, EN: 100.0, GA: 34.2, IS: 68.6, JU: 84.8 },
    },
  },
};

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
  },
  GDN: {
    feb: {
      Andina: { AP: 97.5, AS: 87.1, EN: 96.9, GA: 85.8, IS: 97.8, JU: 93.5 },
      Femsa: { AP: 96.4, AS: 93.5, EN: 91.1, GA: 86.8, IS: 93.4, JU: 91.0 },
      Lee: { AP: 97.8, AS: 99.3, EN: 97.5, GA: 93.6, IS: 98.8, JU: 98.3 },
      Arca: { AP: 98.5, AS: 90.9, EN: 99.5, GA: 91.4, IS: 98.2, JU: 92.1 },
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
  },
  "La Anonima": {
    feb: {
      Andina: { AP: 88.8, AS: 87.7, EN: 87.6, GA: 89.6, IS: 89.1, JU: 84.8 },
      Femsa: { AP: 84.4, AS: 97.2, EN: 66.7, GA: 92.9, IS: 100.0, JU: 89.3 },
      Arca: { AP: 83.3, AS: 89.4, EN: 36.1, GA: 91.8, IS: 88.6, JU: 83.2 },
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
  },
  GDN: {
    feb: {
      Andina: { AP: 63.8, AS: 37.9, EN: 32.5, GA: 19.6, IS: 33.9, JU: 32.3 },
      Femsa: { AP: 49.2, AS: 11.0, EN: 35.5, GA: 27.4, IS: 34.3, JU: 42.6 },
      Lee: { AP: 65.5, AS: 36.4, EN: 72.8, GA: 29.6, IS: 33.3, JU: 48.5 },
      Arca: { AP: 27.7, AS: 20.2, EN: 32.6, GA: 16.6, IS: 28.4, JU: 33.6 },
    },
  },
  CRF: {
    ene: {
      Femsa: { AP: 16.8, AS: 17.8, EN: 20.9, GA: 16.2, IS: 13.7, JU: 18.2 },
      Andina: { AP: 21.9, AS: 23.8, EN: 21.5, GA: 15.8, IS: 16.7, JU: 17.2 },
      Lee: { AP: 21.6, AS: 20.9, EN: 30.0, GA: 25.7, IS: 27.0, JU: 28.7 },
      Arca: { AP: 14.1, AS: 18.2, EN: 23.4, GA: 17.0, IS: 18.1, JU: 17.9 },
    },
    feb: {
      Femsa: { AP: 16.6, AS: 18.5, EN: 22.1, GA: 13.9, IS: 13.1, JU: 21.2 },
      Andina: { AP: 19.8, AS: 21.1, EN: 18.1, GA: 12.0, IS: 15.3, JU: 16.7 },
      Lee: { AP: 29.6, AS: 26.7, EN: 33.9, GA: 22.8, IS: 26.8, JU: 26.2 },
      Arca: { AP: 13.1, AS: 19.5, EN: 19.0, GA: 15.8, IS: 13.8, JU: 17.4 },
    },
  },
  "La Anonima": {
    feb: {
      Andina: { AP: 11.6, AS: 11.7, EN: 13.1, GA: 13.4, IS: 12.5, JU: 11.9 },
      Femsa: { AP: 20.0, AS: 17.6, EN: 10.8, GA: 12.8, IS: 21.8, JU: 13.1 },
      Arca: { AP: 10.1, AS: 14.3, EN: 23.2, GA: 15.5, IS: 11.4, JU: 21.1 },
    },
  },
};

const CAT_KEYS = { AP: "Aguas Plain", AS: "Aguas Sabor.", EN: "Energizantes", GA: "Gaseosas", IS: "Isotónicas", JU: "Jugos" };
const CAT_ORDER = ["AP", "AS", "EN", "GA", "IS", "JU"];

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
<div class="header"><div><h1>🏁 Fill Rate Grand Prix · Argentina</h1><div class="sub">Coca-Cola · Temporada 2026 · <span id="lapLabel" style="color:${lapCol}">YTD Feb'26</span></div></div><div style="font-size:28px;color:${f1txt};letter-spacing:6px;font-weight:900">F1</div></div>
<div><div><canvas id="raceCanvas" width="1060" height="380"></canvas><div class="controls"><button class="btn" onclick="doReset()">↺ RESET</button><button class="btn" onclick="prevLap()">◀</button><button class="btn primary" id="btnPlay" onclick="togglePlay()">▶ START</button><button class="btn" onclick="nextLap()">▶</button><div class="speed-btns"><button class="btn active" onclick="setSpeed(1500,this)">1x</button><button class="btn" onclick="setSpeed(800,this)">2x</button><button class="btn" onclick="setSpeed(350,this)">5x</button></div></div></div></div>
<script>
const RACE_DATA=[{mes:"Ene'26",FEMSA:86.5,LEE:89.2,ANDINA:81.6,ARCA:79.0},{mes:"Feb'26",FEMSA:86.7,LEE:89.5,ANDINA:84.3,ARCA:84.0}];
const CARS=[{key:"FEMSA",label:"Femsa",color:"#E03E52",accent:"#f06070",num:"04"},{key:"LEE",label:"Reginald Lee",color:"#CDC4AA",accent:"#ddd6c0",num:"01"},{key:"ANDINA",label:"Andina",color:"#E10600",accent:"#ff3330",num:"11"},{key:"ARCA",label:"Arca",color:"#E87722",accent:"#f09050",num:"44"}];
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
function doReset(){playing=false;animating=false;clearInterval(playInterval);cancelAnimationFrame(animFrame);currentLap=0;CARS.forEach(c=>{carPositions[c.key]=0;targetPositions[c.key]=0;displayValues[c.key]=0});document.getElementById('btnPlay').innerHTML='▶ START';document.getElementById('lapLabel').textContent="YTD Feb'26";drawScene();window.parent.postMessage({type:'f1-race-values',values:{FEMSA:0,LEE:0,ANDINA:0,ARCA:0}},'*')}
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
  if (v >= 87) return "rgba(22,101,52,.35)";
  if (v >= 84) return "rgba(251,146,60,.25)";
  if (v >= 80) return "rgba(194,65,12,.25)";
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
  if (v >= 87) return "#166534";
  if (v >= 84) return "#FB923C";
  if (v >= 80) return "#C2410C";
  if (v >= 70) return "#991B1B";
  return "#EF4444";
}
function barFillColor(v) {
  if (v >= 95) return "#22C55E";
  if (v >= 87) return "#166534";
  if (v >= 84) return "#FB923C";
  if (v >= 80) return "#C2410C";
  if (v >= 70) return "#991B1B";
  return "#EF4444";
}
function dohColor(v) {
  const dk = V.navy === "#000000";
  if (v == null) return "transparent";
  if (dk) { if(v<=15)return"rgba(74,222,128,.3)";if(v<=25)return"rgba(22,163,74,.2)";if(v<=35)return"rgba(251,146,60,.18)";if(v<=45)return"rgba(194,65,12,.18)";return"rgba(239,68,68,.25)"; }
  if(v<=15)return"rgba(34,197,94,.15)";if(v<=25)return"rgba(22,163,74,.1)";if(v<=35)return"rgba(251,146,60,.1)";if(v<=45)return"rgba(194,65,12,.1)";return"rgba(239,68,68,.15)";
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
  const [catMes, setCatMes] = useState("feb");
  const [catBot, setCatBot] = useState("ALL");
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
  const VIEWS = ["TOTAL CANAL", "GDN", "CRF", "LIBERTAD", "CENCOSUD", "LA ANONIMA", "DIA"];

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
              {[{ k: "ene", l: "ENE'26" }, { k: "feb", l: "FEB'26" }, { k: "both", l: "ENE vs FEB" }].map(m => (
                <button key={m.k} onClick={() => setCatMes(m.k)} style={tabBtnStyle(catMes === m.k)}>{m.l}</button>
              ))}
            </div>
          </div>
        </div>

        {/* DYNAMIC INSIGHTS — react to filters */}
        {(() => {
          const isDoh = mainTab === "doh";
          const isIS = mainTab === "is";
          const allVals = [];
          clients.forEach(cl => {
            const clData = src[cl] || {};
            const mesKey = catMes === "both" ? "feb" : catMes;
            const mesData = clData[mesKey] || clData.feb || clData.ene || {};
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
            problems = allVals.filter(v => v.val > 40).sort((a, b) => b.val - a.val).slice(0, 3);
            opportunities = allVals.filter(v => v.val >= 25 && v.val <= 40).sort((a, b) => b.val - a.val).slice(0, 3);
            bestPerf = allVals.filter(v => v.val < 15).sort((a, b) => a.val - b.val).slice(0, 3);
          } else if (isIS) {
            problems = allVals.filter(v => v.val < 87).sort((a, b) => a.val - b.val).slice(0, 3);
            opportunities = allVals.filter(v => v.val >= 87 && v.val < 92).sort((a, b) => a.val - b.val).slice(0, 3);
            bestPerf = allVals.filter(v => v.val >= 95).sort((a, b) => b.val - a.val).slice(0, 3);
          } else {
            problems = allVals.filter(v => v.val < 80).sort((a, b) => a.val - b.val).slice(0, 3);
            opportunities = allVals.filter(v => v.val >= 80 && v.val < 87).sort((a, b) => a.val - b.val).slice(0, 3);
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

        {/* Line charts when "ENE vs FEB" */}
        {catMes === "both" && (() => {
          const MESES = ["Ene'26", "Feb'26"];
          return clients.map(cl => {
            const eneData = (src[cl] || {}).ene || {};
            const febData = (src[cl] || {}).feb || {};
            const allBots = Object.keys({ ...eneData, ...febData }).filter(b => botFilter === "ALL" || b === botFilter);
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
              const chartData = MESES.map((m, mi) => {
                const d = mi === 0 ? eD : fD;
                const row = { mes: m };
                CAT_ORDER.forEach(ck => { if (d[ck] != null) row[ck] = d[ck]; });
                return row;
              });
              return (
                <div key={cl + bot} style={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 12, padding: "16px 20px", boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: botColor, flexShrink: 0 }} />
                    <span style={{ fontFamily: V.font, fontSize: 15, fontWeight: 900, letterSpacing: 2, textTransform: "uppercase" }}>{cl.toUpperCase()}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: botColor }}>· {bot}</span>
                    <span style={{ fontSize: 10, color: V.gray500, marginLeft: "auto", letterSpacing: 2, textTransform: "uppercase" }}>Progresión Ene → Feb 2026</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                      <XAxis dataKey="mes" tick={{ fill: V.gray500, fontSize: 11, fontFamily: V.font }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: V.gray500, fontSize: 10 }} axisLine={false} tickLine={false} domain={isPct ? [60, 100] : ["auto", "auto"]} tickFormatter={v => isPct ? v + "%" : v + "d"} />
                      <Tooltip formatter={v => v != null ? (isPct ? v.toFixed(1) + "%" : v.toFixed(1) + "d") : "N/D"} contentStyle={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 6, color: V.white, fontSize: 11 }} />
                      {CAT_ORDER.map(ck => (
                        <Line key={ck} type="monotone" dataKey={ck} stroke={catColors[ck]} strokeWidth={2.5} dot={{ r: 4, fill: catColors[ck] }} connectNulls={false}>
                          <LabelList dataKey={ck} position="top" style={{ fill: catColors[ck], fontSize: 11, fontWeight: 700 }} formatter={v => v != null ? (isPct ? v.toFixed(1) : v.toFixed(1)) : ""} />
                        </Line>
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", paddingTop: 8, borderTop: "1px solid "+V.brd2 }}>
                    {CAT_ORDER.map(ck => (
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
              <div style={{ color: V.gray500, fontSize: 12 }}>Sin datos para {catMes === "ene" ? "Enero" : "Febrero"} 2026</div>
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
                <span style={{ fontSize: 10, color: V.gray500, marginLeft: 10, letterSpacing: 2, textTransform: "uppercase" }}>{catMes === "ene" ? "Enero" : "Febrero"} 2026</span>
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
                            <td key={ck} style={{ padding: "8px 6px", textAlign: "center", fontWeight: 700, color: frTextColor(d[ck]), background: getColor(d[ck]), fontSize: 13, fontFamily: V.font, border: frBorder(d[ck]), cursor: "default", transition: "filter .15s" }} onMouseEnter={e=>e.currentTarget.style.filter="brightness(1.3)"} onMouseLeave={e=>e.currentTarget.style.filter="brightness(1)"}>{fmt(d[ck])}</td>
                          ))}
                          {d.TOT != null && (
                            <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 900, color: frTextColor(d.TOT), background: getColor(d.TOT), fontSize: 14, fontFamily: V.font, borderLeft: "2px solid "+V.brd, border: frBorder(d.TOT) || ("2px solid "+V.brd), cursor: "default", transition: "filter .15s" }} onMouseEnter={e=>e.currentTarget.style.filter="brightness(1.3)"} onMouseLeave={e=>e.currentTarget.style.filter="brightness(1)"}>{fmt(d.TOT)}</td>
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
            ? [{l:"≥95%",c:frColor(96)},{l:"87-95%",c:frColor(90)},{l:"84-87%",c:frColor(85)},{l:"80-84%",c:frColor(82)},{l:"70-80%",c:frColor(75)},{l:"<70%",c:frColor(65)}]
            : [{l:"≤15d",c:dohColor(10)},{l:"15-25d",c:dohColor(20)},{l:"25-35d",c:dohColor(30)},{l:"35-45d",c:dohColor(40)},{l:">45d",c:dohColor(50)}]
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

  /* ═══ MAIN RENDER ═══ */
  return (
    <div style={{ background: V.navy, color: V.white, fontFamily: V.fontBody, minHeight: "100vh" }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ═══ HEADER ═══ */}
      <div style={{ background: V.navyMid, borderBottom: "3px solid " + V.red, padding: "24px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 0, top: 0, width: 400, height: "100%", background: "linear-gradient(90deg, transparent, rgba(232,0,45,0.06), rgba(245,200,66,0.04))", pointerEvents: "none" }} />
        <div>
          <h1 style={{ fontFamily: V.font, fontSize: "2rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: 2, margin: 0 }}>
            Dashboard <span style={{ color: "#5BA8FF" }}>Argentina</span> — Customer Service
          </h1>
          <p style={{ fontSize: 12, color: V.white, letterSpacing: 3, textTransform: "uppercase", marginTop: 3, fontFamily: V.font }}>Febrero 2026 · Coca-Cola</p>
        </div>
      </div>

      {/* ═══ NAV ═══ */}
      <div style={navBg}>
        {[{ k: "overview", l: "Overview", hl: false }, { k: "fr", l: "Fill Rate", hl: false }, { k: "is", l: "Instock", hl: false }, { k: "doh", l: "DOH", hl: false }, { k: "race", l: "🏎 F1 Race", hl: true }].map(t => (
          <NavBtn key={t.k} active={mainTab === t.k} onClick={() => setMainTab(t.k)} highlight={t.hl}>{t.l}</NavBtn>
        ))}
      </div>

      {/* ═══ OVERVIEW ═══ */}
      {mainTab === "overview" && (
        <div style={{ padding: "28px 36px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* KPI Cards */}
          <SecLabel>Resumen Ejecutivo — Febrero 2026</SecLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
            {[
              { lb: "ARG Total", v: "87.4%", s: "Feb'26", c: BOTTLER_COLORS.arg, d: "+4.0pp", up: true },
              { lb: "Femsa", v: "86.9%", s: "Feb'26", c: BOTTLER_COLORS.femsa, d: "-2.8pp", up: false },
              { lb: "Reginald Lee", v: "89.8%", s: "Feb'26", c: BOTTLER_COLORS.lee, d: "+1.9pp", up: true },
              { lb: "Andina", v: "87.5%", s: "Feb'26", c: BOTTLER_COLORS.andina, d: "+7.9pp", up: true },
              { lb: "Arca", v: "88.1%", s: "Feb'26", c: BOTTLER_COLORS.arca, d: "+1.2pp", up: true },
            ].map((k, i) => {
              const dc = k.up ? V.gn : V.rd;
              return (
                <div key={i} style={{ background: V.navyMid, border: "1px solid "+V.brd, borderRadius: 12, padding: "16px 18px", borderTop: "3px solid " + k.c, boxShadow: "0 2px 8px rgba(0,0,0,.3)" }}>
                  <div style={{ fontFamily: V.font, fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: V.gray500, marginBottom: 4 }}>{k.lb}</div>
                  <div style={{ fontFamily: V.font, fontSize: "2.4rem", fontWeight: 900, lineHeight: 1, color: V.white }}>{k.v}</div>
                  <div style={{ fontSize: 10, color: V.gray500, marginTop: 3, marginBottom: 6 }}>{k.s}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 14, color: dc, lineHeight: 1 }}>{k.up ? "▲" : "▼"}</span>
                    <span style={{ fontFamily: V.font, fontSize: 13, fontWeight: 800, color: dc }}>{k.d.replace(/^[+-]/, "")} vs Feb 25</span>
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
                <SecLabel>Fill Rate por Cliente — Feb'26 vs Feb'25</SecLabel>
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
              <SecLabel>Delta Feb'26 vs Feb'25</SecLabel>
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
              <SecLabel>Instock — Feb'26</SecLabel>
              {[{ n: "Femsa", v: 91.3, c: BOTTLER_COLORS.femsa }, { n: "Reg. Lee", v: 93.9, c: BOTTLER_COLORS.lee }, { n: "Andina", v: 89.9, c: BOTTLER_COLORS.andina }, { n: "Arca", v: 92.3, c: BOTTLER_COLORS.arca }].map((e, i) => {
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
            <SecLabel>Ranking Clientes — Feb 2026</SecLabel>
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

    </div>
  );
}
