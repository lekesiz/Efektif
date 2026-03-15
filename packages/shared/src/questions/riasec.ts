// ─── RIASEC Test Questions ──────────────────────────────────
// 30 questions, 5 per dimension (R/I/A/S/E/C), Likert 1-5

import type { RIASEC_DIMENSIONS } from "../constants";

export interface RiasecQuestion {
  id: string;
  dimension: (typeof RIASEC_DIMENSIONS)[number];
  textFr: string;
  textTr: string;
  textEn: string;
}

export const RIASEC_QUESTIONS: RiasecQuestion[] = [
  // ─── Realistic (R) ──────────────────────────────────────
  {
    id: "r1",
    dimension: "R",
    textFr: "J'aime travailler avec des outils, des machines ou des objets concrets.",
    textTr: "Aletler, makineler veya somut nesnelerle calismaktan hoslaniyorum.",
    textEn: "I enjoy working with tools, machines, or concrete objects.",
  },
  {
    id: "r2",
    dimension: "R",
    textFr: "Je prefere les activites physiques aux activites intellectuelles.",
    textTr: "Fiziksel aktiviteleri zihinsel aktivitelere tercih ederim.",
    textEn: "I prefer physical activities over intellectual ones.",
  },
  {
    id: "r3",
    dimension: "R",
    textFr: "Je suis capable de reparer des appareils ou des equipements en panne.",
    textTr: "Bozuk cihazlari veya ekipmanlari tamir edebilirim.",
    textEn: "I am able to repair broken devices or equipment.",
  },
  {
    id: "r4",
    dimension: "R",
    textFr: "J'aime construire ou assembler des choses de mes propres mains.",
    textTr: "Kendi ellerimle bir seyler insa etmekten veya monte etmekten hoslaniyorum.",
    textEn: "I enjoy building or assembling things with my own hands.",
  },
  {
    id: "r5",
    dimension: "R",
    textFr: "Je me sens a l'aise en travaillant en plein air ou dans un atelier.",
    textTr: "Acik havada veya bir atolyede calismaktan rahatsizlik duymam.",
    textEn: "I feel comfortable working outdoors or in a workshop.",
  },

  // ─── Investigative (I) ──────────────────────────────────
  {
    id: "i1",
    dimension: "I",
    textFr: "J'aime analyser des problemes complexes et trouver des solutions logiques.",
    textTr: "Karmasik problemleri analiz etmeyi ve mantiksal cozumler bulmay seviyorum.",
    textEn: "I enjoy analyzing complex problems and finding logical solutions.",
  },
  {
    id: "i2",
    dimension: "I",
    textFr: "Je suis curieux de comprendre comment les choses fonctionnent.",
    textTr: "Seylerin nasil calistigini anlamak konusunda merakliyim.",
    textEn: "I am curious about understanding how things work.",
  },
  {
    id: "i3",
    dimension: "I",
    textFr: "J'apprecie la recherche scientifique et l'exploration de nouvelles idees.",
    textTr: "Bilimsel arastirma yapmayi ve yeni fikirleri kesifetmeyi takdir ediyorum.",
    textEn: "I appreciate scientific research and exploring new ideas.",
  },
  {
    id: "i4",
    dimension: "I",
    textFr: "Je prefere prendre des decisions basees sur des faits et des donnees.",
    textTr: "Kararlarimi olgulara ve verilere dayandirmayi tercih ederim.",
    textEn: "I prefer making decisions based on facts and data.",
  },
  {
    id: "i5",
    dimension: "I",
    textFr: "J'aime lire des articles scientifiques ou des ouvrages techniques.",
    textTr: "Bilimsel makaleler veya teknik kitaplar okumayi seviyorum.",
    textEn: "I enjoy reading scientific articles or technical books.",
  },

  // ─── Artistic (A) ───────────────────────────────────────
  {
    id: "a1",
    dimension: "A",
    textFr: "J'aime exprimer mes idees a travers l'art, la musique ou l'ecriture.",
    textTr: "Fikirlerimi sanat, muzik veya yazi yoluyla ifade etmeyi seviyorum.",
    textEn: "I enjoy expressing my ideas through art, music, or writing.",
  },
  {
    id: "a2",
    dimension: "A",
    textFr: "Je suis attire par les activites qui permettent la creativite et l'imagination.",
    textTr: "Yaraticilik ve hayal gucune olanak taniyan aktivitelere ilgi duyarim.",
    textEn: "I am attracted to activities that allow creativity and imagination.",
  },
  {
    id: "a3",
    dimension: "A",
    textFr: "J'apprecie les environnements de travail non conventionnels et flexibles.",
    textTr: "Geleneksel olmayan ve esnek calisma ortamlarini takdir ederim.",
    textEn: "I appreciate unconventional and flexible work environments.",
  },
  {
    id: "a4",
    dimension: "A",
    textFr: "Je prefere trouver des solutions originales plutot que suivre des methodes etablies.",
    textTr: "Yerlesik yontemleri izlemek yerine ozgun cozumler bulmay tercih ederim.",
    textEn: "I prefer finding original solutions rather than following established methods.",
  },
  {
    id: "a5",
    dimension: "A",
    textFr: "Je suis sensible a l'esthetique et au design dans mon quotidien.",
    textTr: "Gunluk hayatimda estetik ve tasarima karsi duyarliyim.",
    textEn: "I am sensitive to aesthetics and design in my daily life.",
  },

  // ─── Social (S) ─────────────────────────────────────────
  {
    id: "s1",
    dimension: "S",
    textFr: "J'aime aider les autres a resoudre leurs problemes personnels.",
    textTr: "Baskalarina kisisel problemlerini cozmelerinde yardim etmeyi seviyorum.",
    textEn: "I enjoy helping others solve their personal problems.",
  },
  {
    id: "s2",
    dimension: "S",
    textFr: "Je me sens epanoui lorsque j'enseigne ou forme d'autres personnes.",
    textTr: "Baskalarini egittigimde veya yetistirdigimde kendimi tatmin olmus hissederim.",
    textEn: "I feel fulfilled when I teach or train other people.",
  },
  {
    id: "s3",
    dimension: "S",
    textFr: "Je suis a l'ecoute et les gens viennent souvent me demander conseil.",
    textTr: "Iyi bir dinleyiciyim ve insanlar sik sik bana danisir.",
    textEn: "I am a good listener and people often come to me for advice.",
  },
  {
    id: "s4",
    dimension: "S",
    textFr: "Je prefere travailler en equipe plutot que seul.",
    textTr: "Yalniz calismaktansa takim halinde calismayi tercih ederim.",
    textEn: "I prefer working in a team rather than alone.",
  },
  {
    id: "s5",
    dimension: "S",
    textFr: "Je suis motive par l'idee de contribuer au bien-etre de la societe.",
    textTr: "Toplumun refahina katki saglama fikri beni motive eder.",
    textEn: "I am motivated by the idea of contributing to society's well-being.",
  },

  // ─── Enterprising (E) ──────────────────────────────────
  {
    id: "e1",
    dimension: "E",
    textFr: "J'aime diriger des projets et prendre des decisions importantes.",
    textTr: "Projeleri yonetmeyi ve onemli kararlar almayi seviyorum.",
    textEn: "I enjoy leading projects and making important decisions.",
  },
  {
    id: "e2",
    dimension: "E",
    textFr: "Je suis a l'aise pour convaincre ou negocier avec les autres.",
    textTr: "Baskalari ikna etme veya muzakere konusunda rahatim.",
    textEn: "I am comfortable persuading or negotiating with others.",
  },
  {
    id: "e3",
    dimension: "E",
    textFr: "J'aime prendre des risques calcules pour atteindre mes objectifs.",
    textTr: "Hedeflerime ulasmak icin hesaplanmis riskler almayi seviyorum.",
    textEn: "I enjoy taking calculated risks to achieve my goals.",
  },
  {
    id: "e4",
    dimension: "E",
    textFr: "Je suis ambitieux et je vise toujours a progresser dans ma carriere.",
    textTr: "Hirs sahibiyim ve kariyerimde her zaman ilerlemeyi hedefliyorum.",
    textEn: "I am ambitious and always aim to advance in my career.",
  },
  {
    id: "e5",
    dimension: "E",
    textFr: "J'aime organiser des evenements ou coordonner des activites de groupe.",
    textTr: "Etkinlikler duzenlemeyi veya grup aktivitelerini koordine etmeyi seviyorum.",
    textEn: "I enjoy organizing events or coordinating group activities.",
  },

  // ─── Conventional (C) ──────────────────────────────────
  {
    id: "c1",
    dimension: "C",
    textFr: "J'aime travailler avec des chiffres, des tableaux et des donnees.",
    textTr: "Sayilarla, tablolarla ve verilerle calismay seviyorum.",
    textEn: "I enjoy working with numbers, spreadsheets, and data.",
  },
  {
    id: "c2",
    dimension: "C",
    textFr: "Je suis organise et j'aime planifier mes activites a l'avance.",
    textTr: "Organize biriyim ve aktivitelerimi onceden planlamayi severim.",
    textEn: "I am organized and like to plan my activities in advance.",
  },
  {
    id: "c3",
    dimension: "C",
    textFr: "Je prefere suivre des procedures etablies et des regles claires.",
    textTr: "Belirli prosedur ve kurallari izlemeyi tercih ederim.",
    textEn: "I prefer following established procedures and clear rules.",
  },
  {
    id: "c4",
    dimension: "C",
    textFr: "Je suis meticuleux et je fais attention aux details dans mon travail.",
    textTr: "Titiz biriyim ve isimde detaylara dikkat ederim.",
    textEn: "I am meticulous and pay attention to details in my work.",
  },
  {
    id: "c5",
    dimension: "C",
    textFr: "J'aime classer, trier et organiser des informations de maniere systematique.",
    textTr: "Bilgileri sistematik bir sekilde siniflandirmayi, ayirmayi ve duzenlemeyi seviyorum.",
    textEn: "I enjoy classifying, sorting, and organizing information systematically.",
  },
];

/**
 * Calculate normalized RIASEC scores (0-100) from raw answers.
 * @param answers - Map of question id to Likert value (1-5)
 * @returns Record with R/I/A/S/E/C keys, each 0-100
 */
export function calculateRiasecScores(
  answers: Record<string, number>,
): Record<string, number> {
  const dimensions = ["R", "I", "A", "S", "E", "C"] as const;
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const dim of dimensions) {
    sums[dim] = 0;
    counts[dim] = 0;
  }

  for (const q of RIASEC_QUESTIONS) {
    const val = answers[q.id];
    if (val != null && val >= 1 && val <= 5) {
      sums[q.dimension] += val;
      counts[q.dimension] += 1;
    }
  }

  const scores: Record<string, number> = {};
  for (const dim of dimensions) {
    const maxPossible = counts[dim] * 5;
    if (maxPossible === 0) {
      scores[dim] = 0;
    } else {
      scores[dim] = Math.round((sums[dim] / maxPossible) * 100);
    }
  }

  return scores;
}
