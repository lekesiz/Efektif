// ─── Big Five Personality Test Questions ─────────────────────
// 50 questions, 10 per dimension (O/C/E/A/N), Likert 1-5
// Some questions are reverse-scored

import type { BIGFIVE_DIMENSIONS } from "../constants";

export interface BigfiveQuestion {
  id: string;
  dimension: (typeof BIGFIVE_DIMENSIONS)[number];
  reverse: boolean;
  textFr: string;
  textTr: string;
  textEn: string;
}

export const BIGFIVE_QUESTIONS: BigfiveQuestion[] = [
  // ─── Openness (O) ───────────────────────────────────────
  {
    id: "o1",
    dimension: "O",
    reverse: false,
    textFr: "J'ai une imagination tres active et debordante.",
    textTr: "Cok aktif ve zengin bir hayal gucune sahibim.",
    textEn: "I have a very active and vivid imagination.",
  },
  {
    id: "o2",
    dimension: "O",
    reverse: false,
    textFr: "J'apprecie l'art, la musique et la litterature.",
    textTr: "Sanat, muzik ve edebiyati takdir ederim.",
    textEn: "I appreciate art, music, and literature.",
  },
  {
    id: "o3",
    dimension: "O",
    reverse: true,
    textFr: "Je prefere la routine aux nouvelles experiences.",
    textTr: "Yeni deneyimler yerine rutini tercih ederim.",
    textEn: "I prefer routine over new experiences.",
  },
  {
    id: "o4",
    dimension: "O",
    reverse: false,
    textFr: "Je suis ouvert aux idees differentes des miennes.",
    textTr: "Benimkinden farkli fikirlere acigim.",
    textEn: "I am open to ideas that differ from my own.",
  },
  {
    id: "o5",
    dimension: "O",
    reverse: false,
    textFr: "J'aime reflechir a des concepts abstraits et philosophiques.",
    textTr: "Soyut ve felsefi kavramlar uzerine dusunmeyi severim.",
    textEn: "I enjoy thinking about abstract and philosophical concepts.",
  },
  {
    id: "o6",
    dimension: "O",
    reverse: true,
    textFr: "Je ne m'interesse pas vraiment aux idees nouvelles ou inhabituelles.",
    textTr: "Yeni veya alisilmadik fikirlere pek ilgi duymam.",
    textEn: "I am not really interested in new or unusual ideas.",
  },
  {
    id: "o7",
    dimension: "O",
    reverse: false,
    textFr: "J'aime decouvrir de nouvelles cultures et facons de vivre.",
    textTr: "Yeni kulturleri ve yasam biclmlerini kesfetmeyi severim.",
    textEn: "I enjoy discovering new cultures and ways of life.",
  },
  {
    id: "o8",
    dimension: "O",
    reverse: false,
    textFr: "Je suis souvent fascine par les mysteres de la nature et de la science.",
    textTr: "Doga ve bilimin gizemleri beni siklikla buyuler.",
    textEn: "I am often fascinated by the mysteries of nature and science.",
  },
  {
    id: "o9",
    dimension: "O",
    reverse: true,
    textFr: "Je trouve les discussions theoriques ennuyeuses.",
    textTr: "Teorik tartismalari sikici bulurum.",
    textEn: "I find theoretical discussions boring.",
  },
  {
    id: "o10",
    dimension: "O",
    reverse: false,
    textFr: "J'aime essayer de nouvelles activites que je n'ai jamais faites.",
    textTr: "Daha once hic yapmadigim yeni aktiviteleri denemeyi severim.",
    textEn: "I enjoy trying new activities that I have never done before.",
  },

  // ─── Conscientiousness (C) ─────────────────────────────
  {
    id: "c1",
    dimension: "C",
    reverse: false,
    textFr: "Je suis toujours bien prepare et organise.",
    textTr: "Her zaman iyi hazirlanmis ve organize olurum.",
    textEn: "I am always well-prepared and organized.",
  },
  {
    id: "c2",
    dimension: "C",
    reverse: false,
    textFr: "Je fais attention aux details dans tout ce que j'entreprends.",
    textTr: "Yaptigim her iste detaylara dikkat ederim.",
    textEn: "I pay attention to details in everything I undertake.",
  },
  {
    id: "c3",
    dimension: "C",
    reverse: true,
    textFr: "Il m'arrive souvent de remettre mes taches a plus tard.",
    textTr: "Gorevlerimi sik sik erteledigim olur.",
    textEn: "I often put off my tasks until later.",
  },
  {
    id: "c4",
    dimension: "C",
    reverse: false,
    textFr: "Je respecte toujours mes engagements et mes delais.",
    textTr: "Taahhutlerime ve tarih sinirlarima her zaman uyarim.",
    textEn: "I always honor my commitments and deadlines.",
  },
  {
    id: "c5",
    dimension: "C",
    reverse: false,
    textFr: "Je suis methodique et je suis un plan precis dans mon travail.",
    textTr: "Metodigim ve isimde kesin bir plan izlerim.",
    textEn: "I am methodical and follow a precise plan in my work.",
  },
  {
    id: "c6",
    dimension: "C",
    reverse: true,
    textFr: "Mon espace de travail est souvent desordonne.",
    textTr: "Calisma alanim genellikle dagliniktir.",
    textEn: "My workspace is often messy.",
  },
  {
    id: "c7",
    dimension: "C",
    reverse: false,
    textFr: "Je persevere dans mes efforts meme face aux difficultes.",
    textTr: "Zorluklarla karsilassam bile cabalarimda israr ederim.",
    textEn: "I persevere in my efforts even when facing difficulties.",
  },
  {
    id: "c8",
    dimension: "C",
    reverse: false,
    textFr: "Je termine toujours ce que j'ai commence.",
    textTr: "Basladigim isi her zaman bitiririm.",
    textEn: "I always finish what I have started.",
  },
  {
    id: "c9",
    dimension: "C",
    reverse: true,
    textFr: "J'ai du mal a me concentrer sur une tache pendant longtemps.",
    textTr: "Uzun sure bir goreve odaklanmakta zorlanirim.",
    textEn: "I have difficulty concentrating on a task for a long time.",
  },
  {
    id: "c10",
    dimension: "C",
    reverse: false,
    textFr: "Je me fixe des objectifs clairs et je travaille pour les atteindre.",
    textTr: "Kendime net hedefler koyarim ve onlara ulasmak icin calisirim.",
    textEn: "I set clear goals and work to achieve them.",
  },

  // ─── Extraversion (E) ──────────────────────────────────
  {
    id: "e1",
    dimension: "E",
    reverse: false,
    textFr: "Je me sens energise lorsque je suis entoure de gens.",
    textTr: "Insanlarla cevrili oldugunuzda enerji dolu hissederim.",
    textEn: "I feel energized when I am surrounded by people.",
  },
  {
    id: "e2",
    dimension: "E",
    reverse: false,
    textFr: "Je prends facilement la parole dans un groupe.",
    textTr: "Bir grupta kolayca soz alirim.",
    textEn: "I easily speak up in a group.",
  },
  {
    id: "e3",
    dimension: "E",
    reverse: true,
    textFr: "Je prefere les soirees calmes aux grandes fetes.",
    textTr: "Buyuk partiler yerine sakin aksmalari tercih ederim.",
    textEn: "I prefer quiet evenings over big parties.",
  },
  {
    id: "e4",
    dimension: "E",
    reverse: false,
    textFr: "J'aime rencontrer de nouvelles personnes et elargir mon cercle social.",
    textTr: "Yeni insanlarla tanismay ve sosyal cevremi genisletmeyi severim.",
    textEn: "I enjoy meeting new people and expanding my social circle.",
  },
  {
    id: "e5",
    dimension: "E",
    reverse: false,
    textFr: "Je suis generalement enthousiaste et plein d'energie.",
    textTr: "Genellikle hevesli ve enerji doluyum.",
    textEn: "I am generally enthusiastic and full of energy.",
  },
  {
    id: "e6",
    dimension: "E",
    reverse: true,
    textFr: "Je me sens souvent mal a l'aise dans les situations sociales.",
    textTr: "Sosyal durumlarda siklikla rahatsiz hissederim.",
    textEn: "I often feel uncomfortable in social situations.",
  },
  {
    id: "e7",
    dimension: "E",
    reverse: false,
    textFr: "J'aime etre le centre de l'attention.",
    textTr: "Ilgi odagi olmaktan hoslaniyorum.",
    textEn: "I enjoy being the center of attention.",
  },
  {
    id: "e8",
    dimension: "E",
    reverse: false,
    textFr: "Je demarre facilement des conversations avec des inconnus.",
    textTr: "Tanmdigim insanlarla kolayca sohbet baslatrim.",
    textEn: "I easily start conversations with strangers.",
  },
  {
    id: "e9",
    dimension: "E",
    reverse: true,
    textFr: "Je suis plutot reserve et je garde mes pensees pour moi.",
    textTr: "Genellikle cekinik biriyim ve dusuncelerimi kendime saklarim.",
    textEn: "I am rather reserved and keep my thoughts to myself.",
  },
  {
    id: "e10",
    dimension: "E",
    reverse: false,
    textFr: "Je me sens a l'aise pour parler en public.",
    textTr: "Halka acik konusmalar yapmakta rahatim.",
    textEn: "I feel comfortable speaking in public.",
  },

  // ─── Agreeableness (A) ─────────────────────────────────
  {
    id: "a1",
    dimension: "A",
    reverse: false,
    textFr: "Je fais confiance aux autres et je crois en leur bonne volonte.",
    textTr: "Baskalarina guveniyorum ve iyi niyetlerine inaniyorum.",
    textEn: "I trust others and believe in their good will.",
  },
  {
    id: "a2",
    dimension: "A",
    reverse: false,
    textFr: "Je suis toujours pret a aider les autres sans rien attendre en retour.",
    textTr: "Karsilik beklemeden her zaman baskalarina yardim etmeye hazirim.",
    textEn: "I am always ready to help others without expecting anything in return.",
  },
  {
    id: "a3",
    dimension: "A",
    reverse: true,
    textFr: "Je peux etre dur et critique envers les autres.",
    textTr: "Baskalarina karsi sert ve elestirel olabiliyorum.",
    textEn: "I can be harsh and critical towards others.",
  },
  {
    id: "a4",
    dimension: "A",
    reverse: false,
    textFr: "J'essaie d'eviter les conflits et de maintenir l'harmonie.",
    textTr: "Catismalardan kacinmaya ve uyumu korumaya calisirim.",
    textEn: "I try to avoid conflicts and maintain harmony.",
  },
  {
    id: "a5",
    dimension: "A",
    reverse: false,
    textFr: "Je suis sensible aux sentiments et aux besoins des autres.",
    textTr: "Baskalrinin duygularina ve ihtiyaclarina karsi duyarliyim.",
    textEn: "I am sensitive to the feelings and needs of others.",
  },
  {
    id: "a6",
    dimension: "A",
    reverse: true,
    textFr: "Il m'arrive de manipuler les autres pour obtenir ce que je veux.",
    textTr: "Istedigimi elde etmek icin bazen baskalari manipule ederim.",
    textEn: "I sometimes manipulate others to get what I want.",
  },
  {
    id: "a7",
    dimension: "A",
    reverse: false,
    textFr: "Je pardonne facilement aux personnes qui m'ont blesse.",
    textTr: "Beni inciten insanlari kolayca affederim.",
    textEn: "I easily forgive people who have hurt me.",
  },
  {
    id: "a8",
    dimension: "A",
    reverse: false,
    textFr: "Je suis genereux et j'aime partager avec les autres.",
    textTr: "Comertim ve baskalariyla paylasmayi severim.",
    textEn: "I am generous and enjoy sharing with others.",
  },
  {
    id: "a9",
    dimension: "A",
    reverse: true,
    textFr: "Je suis souvent en desaccord avec les autres.",
    textTr: "Baskalariyla sik sik fikir ayriligina duserim.",
    textEn: "I often disagree with others.",
  },
  {
    id: "a10",
    dimension: "A",
    reverse: false,
    textFr: "Je traite tout le monde avec respect et dignite.",
    textTr: "Herkese saygi ve onurla davranrim.",
    textEn: "I treat everyone with respect and dignity.",
  },

  // ─── Neuroticism / Emotional Stability (N) ─────────────
  // Note: High score = HIGH emotional stability (low neuroticism)
  {
    id: "n1",
    dimension: "N",
    reverse: false,
    textFr: "Je reste calme et serein meme dans les situations stressantes.",
    textTr: "Stresli durumlarda bile sakin ve huzurlu kalirim.",
    textEn: "I remain calm and serene even in stressful situations.",
  },
  {
    id: "n2",
    dimension: "N",
    reverse: true,
    textFr: "Je m'inquiete souvent de choses qui pourraient mal tourner.",
    textTr: "Ters gidebilecek seyler hakkinda sik sik endiseleniyorum.",
    textEn: "I often worry about things that could go wrong.",
  },
  {
    id: "n3",
    dimension: "N",
    reverse: false,
    textFr: "Je gere bien la pression et les delais serres.",
    textTr: "Baski ve siki tarih sinirlarini iyi yonetirim.",
    textEn: "I handle pressure and tight deadlines well.",
  },
  {
    id: "n4",
    dimension: "N",
    reverse: true,
    textFr: "Mes emotions changent souvent et de maniere imprevisible.",
    textTr: "Duygularim sik sik ve ongourulemez sekilde degisir.",
    textEn: "My emotions change often and unpredictably.",
  },
  {
    id: "n5",
    dimension: "N",
    reverse: false,
    textFr: "Je suis generalement optimiste quant a l'avenir.",
    textTr: "Gelecek konusunda genellikle iyimserim.",
    textEn: "I am generally optimistic about the future.",
  },
  {
    id: "n6",
    dimension: "N",
    reverse: true,
    textFr: "Je me sens souvent triste ou deprime sans raison particuliere.",
    textTr: "Belirli bir neden olmadan sik sik uzgun veya bunalimli hissederim.",
    textEn: "I often feel sad or depressed without any particular reason.",
  },
  {
    id: "n7",
    dimension: "N",
    reverse: false,
    textFr: "Je me remets rapidement des epreuves et des echecs.",
    textTr: "Zorluklardan ve basarisizliklardan cabuk toparlanrim.",
    textEn: "I recover quickly from hardships and failures.",
  },
  {
    id: "n8",
    dimension: "N",
    reverse: true,
    textFr: "Je suis facilement irrite ou agace par les autres.",
    textTr: "Baskalari tarafindan kolayca rahatsiz veya sinirlendiriliyorum.",
    textEn: "I am easily irritated or annoyed by others.",
  },
  {
    id: "n9",
    dimension: "N",
    reverse: false,
    textFr: "J'ai confiance en ma capacite a surmonter les difficultes.",
    textTr: "Zorluklarin ustesinden gelme kapasiteme guveniyorum.",
    textEn: "I trust in my ability to overcome difficulties.",
  },
  {
    id: "n10",
    dimension: "N",
    reverse: true,
    textFr: "Je me sens souvent submerge par mes responsabilites.",
    textTr: "Sorumluluklarim altinda siklikla ezilmis hissederim.",
    textEn: "I often feel overwhelmed by my responsibilities.",
  },
];

/**
 * Calculate normalized Big Five scores (0-100) from raw answers.
 * Reverse-scored items are flipped (6 - value) before summing.
 * @param answers - Map of question id to Likert value (1-5)
 * @returns Record with O/C/E/A/N keys, each 0-100
 */
export function calculateBigfiveScores(
  answers: Record<string, number>,
): Record<string, number> {
  const dimensions = ["O", "C", "E", "A", "N"] as const;
  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const dim of dimensions) {
    sums[dim] = 0;
    counts[dim] = 0;
  }

  for (const q of BIGFIVE_QUESTIONS) {
    const raw = answers[q.id];
    if (raw == null || raw < 1 || raw > 5) continue;

    const val = q.reverse ? 6 - raw : raw;
    sums[q.dimension] += val;
    counts[q.dimension] += 1;
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
