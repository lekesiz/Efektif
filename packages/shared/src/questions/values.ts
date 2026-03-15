// ─── Work Values Test Questions ──────────────────────────────
// 30 questions, 5 per dimension, Likert 1-5

import type { VALUES_DIMENSIONS } from "../constants";

export type ValuesDimension = (typeof VALUES_DIMENSIONS)[number];

export interface ValuesQuestion {
  id: string;
  dimension: ValuesDimension;
  textFr: string;
  textTr: string;
  textEn: string;
}

export const VALUES_QUESTIONS: ValuesQuestion[] = [
  // ─── Achievement ────────────────────────────────────────
  {
    id: "va1",
    dimension: "achievement",
    textFr: "Il est important pour moi de relever des defis stimulants dans mon travail.",
    textTr: "Isimde zorlu hedeflerin ustesinden gelmek benim icin onemlidir.",
    textEn: "It is important to me to take on stimulating challenges in my work.",
  },
  {
    id: "va2",
    dimension: "achievement",
    textFr: "Je recherche un travail qui me permet de voir les resultats concrets de mes efforts.",
    textTr: "Cabalarimin somut sonuclarini gorebildigim bir is ariyorum.",
    textEn: "I look for work where I can see the concrete results of my efforts.",
  },
  {
    id: "va3",
    dimension: "achievement",
    textFr: "Atteindre l'excellence dans mon domaine est une priorite pour moi.",
    textTr: "Alanmda mukemmellige ulasmak benim icin bir onceliktir.",
    textEn: "Achieving excellence in my field is a priority for me.",
  },
  {
    id: "va4",
    dimension: "achievement",
    textFr: "Je suis motive quand mon travail contribue a un objectif significatif.",
    textTr: "Isim anlamli bir hedefe katki sagladiginda motive olurum.",
    textEn: "I am motivated when my work contributes to a meaningful goal.",
  },
  {
    id: "va5",
    dimension: "achievement",
    textFr: "Je me sens epanoui lorsque j'utilise pleinement mes competences professionnelles.",
    textTr: "Mesleki becerilerimi tam olarak kullandigimda kendimi tatmin olmus hissederim.",
    textEn: "I feel fulfilled when I fully use my professional skills.",
  },

  // ─── Independence ──────────────────────────────────────
  {
    id: "vi1",
    dimension: "independence",
    textFr: "Je prefere decider moi-meme comment organiser mon travail.",
    textTr: "Isimi nasil organize edeceigme kendim karar vermeyi tercih ederim.",
    textEn: "I prefer to decide for myself how to organize my work.",
  },
  {
    id: "vi2",
    dimension: "independence",
    textFr: "L'autonomie dans mes decisions professionnelles est essentielle pour moi.",
    textTr: "Mesleki kararlarimda ozerklik benim icin esastir.",
    textEn: "Autonomy in my professional decisions is essential to me.",
  },
  {
    id: "vi3",
    dimension: "independence",
    textFr: "Je n'aime pas etre etroitement supervise dans mes taches.",
    textTr: "Gorevlerimde yakindan denetlenmekten hoslanmam.",
    textEn: "I do not like being closely supervised in my tasks.",
  },
  {
    id: "vi4",
    dimension: "independence",
    textFr: "Je valorise la liberte de pouvoir essayer mes propres idees au travail.",
    textTr: "Iste kendi fikirlerimi deneme ozgurlugune deger veririm.",
    textEn: "I value the freedom to try my own ideas at work.",
  },
  {
    id: "vi5",
    dimension: "independence",
    textFr: "Pouvoir definir mes propres horaires de travail est important pour moi.",
    textTr: "Kendi calisma saatlerimi belirleyebilmek benim icin onemlidir.",
    textEn: "Being able to set my own work schedule is important to me.",
  },

  // ─── Recognition ───────────────────────────────────────
  {
    id: "vr1",
    dimension: "recognition",
    textFr: "Il est important que mon travail soit reconnu et apprecie par les autres.",
    textTr: "Isimin baskalar tarafindan taninmasi ve takdir edilmesi onemlidir.",
    textEn: "It is important that my work is recognized and appreciated by others.",
  },
  {
    id: "vr2",
    dimension: "recognition",
    textFr: "Je cherche un poste qui me donne un certain statut social.",
    textTr: "Bana belirli bir sosyal statu kazandiran bir pozisyon ariyorum.",
    textEn: "I look for a position that gives me a certain social status.",
  },
  {
    id: "vr3",
    dimension: "recognition",
    textFr: "Recevoir des feedbacks positifs est tres motivant pour moi.",
    textTr: "Olumlu geri bildirim almak benim icin cok motive edicidir.",
    textEn: "Receiving positive feedback is very motivating for me.",
  },
  {
    id: "vr4",
    dimension: "recognition",
    textFr: "J'aspire a devenir un expert respecte dans mon domaine.",
    textTr: "Alanmda saygin bir uzman olmay arzuluyorum.",
    textEn: "I aspire to become a respected expert in my field.",
  },
  {
    id: "vr5",
    dimension: "recognition",
    textFr: "Les promotions et les avancements de carriere me motivent beaucoup.",
    textTr: "Terfiler ve kariyer ilerlmeleri beni cok motive eder.",
    textEn: "Promotions and career advancement motivate me greatly.",
  },

  // ─── Relationships ────────────────────────────────────
  {
    id: "vl1",
    dimension: "relationships",
    textFr: "Il est essentiel pour moi d'avoir de bonnes relations avec mes collegues.",
    textTr: "Is arkdaslarimla iyi iliskilere sahip olmak benim icin esastir.",
    textEn: "It is essential for me to have good relationships with my colleagues.",
  },
  {
    id: "vl2",
    dimension: "relationships",
    textFr: "Je prefere un environnement de travail collaboratif et amical.",
    textTr: "Isbirligi ve dostluk temelli bir calisma ortamini tercih ederim.",
    textEn: "I prefer a collaborative and friendly work environment.",
  },
  {
    id: "vl3",
    dimension: "relationships",
    textFr: "Travailler avec des personnes que j'apprecie est plus important que le salaire.",
    textTr: "Takdir ettigim insanlarla calismak maas kadar onemlidir.",
    textEn: "Working with people I appreciate is more important than salary.",
  },
  {
    id: "vl4",
    dimension: "relationships",
    textFr: "L'esprit d'equipe et la solidarite au travail comptent beaucoup pour moi.",
    textTr: "Takim ruhu ve is yerinde dayanisma benim icin cok onemlidir.",
    textEn: "Team spirit and solidarity at work matter a lot to me.",
  },
  {
    id: "vl5",
    dimension: "relationships",
    textFr: "Je me sens mieux quand je peux aider mes collegues dans leur travail.",
    textTr: "Is arkadaslarma islerinde yardim edebildigimde kendimi daha iyi hissederim.",
    textEn: "I feel better when I can help my colleagues in their work.",
  },

  // ─── Support ──────────────────────────────────────────
  {
    id: "vs1",
    dimension: "support",
    textFr: "Avoir un manager qui me soutient et me guide est tres important.",
    textTr: "Beni destekleyen ve yonlendiren bir yoneticiye sahip olmak cok onemli.",
    textEn: "Having a manager who supports and guides me is very important.",
  },
  {
    id: "vs2",
    dimension: "support",
    textFr: "Je valorise les entreprises qui investissent dans la formation de leurs employes.",
    textTr: "Calisanlarinin egitimine yatirim yapan sirketlere deger veririm.",
    textEn: "I value companies that invest in the training of their employees.",
  },
  {
    id: "vs3",
    dimension: "support",
    textFr: "Je recherche un employeur qui traite ses employes de maniere equitable.",
    textTr: "Calisanlarina adil davranan bir isveren ariyorum.",
    textEn: "I look for an employer who treats its employees fairly.",
  },
  {
    id: "vs4",
    dimension: "support",
    textFr: "Un bon mentorat et des opportunites de developpement sont essentiels.",
    textTr: "Iyi bir mentorluk ve gelisme firsatlari vazgecilmezdir.",
    textEn: "Good mentorship and development opportunities are essential.",
  },
  {
    id: "vs5",
    dimension: "support",
    textFr: "Je prefere une entreprise avec des politiques claires et transparentes.",
    textTr: "Acik ve seffaf politikalara sahip bir sirketi tercih ederim.",
    textEn: "I prefer a company with clear and transparent policies.",
  },

  // ─── Working Conditions ───────────────────────────────
  {
    id: "vw1",
    dimension: "working_conditions",
    textFr: "Un bon equilibre entre vie professionnelle et vie personnelle est primordial.",
    textTr: "Is ve ozel hayat arasndaki denge cok onemlidir.",
    textEn: "A good work-life balance is paramount.",
  },
  {
    id: "vw2",
    dimension: "working_conditions",
    textFr: "La securite de l'emploi est un critere essentiel dans mon choix de carriere.",
    textTr: "Is guvencesi kariyer secimimde onemli bir kriterdir.",
    textEn: "Job security is an essential criterion in my career choice.",
  },
  {
    id: "vw3",
    dimension: "working_conditions",
    textFr: "Un salaire competitif et de bons avantages sociaux sont tres importants.",
    textTr: "Rekabetci bir maas ve iyi sosyal haklar cok onemlidir.",
    textEn: "A competitive salary and good benefits are very important.",
  },
  {
    id: "vw4",
    dimension: "working_conditions",
    textFr: "Je valorise un cadre de travail confortable et bien equipe.",
    textTr: "Rahat ve iyi donatilmis bir calisma ortamina deger veririm.",
    textEn: "I value a comfortable and well-equipped work environment.",
  },
  {
    id: "vw5",
    dimension: "working_conditions",
    textFr: "La possibilite de teletravailler est un avantage important pour moi.",
    textTr: "Uzaktan calisma imkani benim icin onemli bir avantajdir.",
    textEn: "The possibility of remote work is an important benefit for me.",
  },
];

/**
 * Calculate normalized Values scores (0-100) from raw answers.
 * @param answers - Map of question id to Likert value (1-5)
 * @returns Record with dimension keys, each 0-100
 */
export function calculateValuesScores(
  answers: Record<string, number>,
): Record<string, number> {
  const dimensions = [
    "achievement",
    "independence",
    "recognition",
    "relationships",
    "support",
    "working_conditions",
  ] as const;

  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const dim of dimensions) {
    sums[dim] = 0;
    counts[dim] = 0;
  }

  for (const q of VALUES_QUESTIONS) {
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
