export interface TutoringService {
  id: number;
  title: string;
  niveau: string;
  category: string;
  description: string;
  price: string;
  priceSuffix: string;
  image: string;
  students: number;
  duration: string;
  formats: string[];
  zonesPresentiel: string[];
  teacher: string;
}

export const SERVICES: TutoringService[] = [
  {
    id: 1,
    title: "Mathématiques - 2ème année Bac Sciences SVT et PC",
    niveau: "2ÈME ANNÉE BACCALAURÉAT",
    category: "LYCÉE",
    description: "Séance de soutien ciblée de 2 heures en Mathématiques pour la 2ème BAC SVT & PC. Remise à niveau, résolution des exercices types et préparation aux contrôles et à l'examen national.",
    price: "200.00",
    priceSuffix: "/ séance (2h)",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    students: 124,
    duration: "2 heures",
    formats: ["En ligne (Google Meet / Zoom)", "Présentiel (Rabat / Témara / Salé)"],
    zonesPresentiel: ["Rabat", "Témara", "Salé"],
    teacher: "Mohammed Ennaouri"
  },
  {
    id: 2,
    title: "Mathématiques - 2ème année Bac Sciences Maths (A & B)",
    niveau: "2ÈME ANNÉE BACCALAURÉAT",
    category: "LYCÉE",
    description: "Séance approfondie de 2 heures pour élèves de Sciences Mathématiques. Maîtrise des raisonnements rigoureux, structures algébriques, analyse et arithmétique pour l'examen national.",
    price: "200.00",
    priceSuffix: "/ séance (2h)",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    students: 86,
    duration: "2 heures",
    formats: ["En ligne (Google Meet / Zoom)", "Présentiel (Rabat / Témara / Salé)"],
    zonesPresentiel: ["Rabat", "Témara", "Salé"],
    teacher: "Mohammed Ennaouri"
  },
  {
    id: 3,
    title: "Mathématiques - 1ère année Bac Sciences Expérimentales",
    niveau: "1ÈRE ANNÉE BACCALAURÉAT",
    category: "LYCÉE",
    description: "Séance de soutien de 2 heures pour consolider les bases de la 1ère BAC Sc. Exp : logique, fonctions, barycentre, dérivation et préparation aux devoirs surveillés.",
    price: "200.00",
    priceSuffix: "/ séance (2h)",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    students: 152,
    duration: "2 heures",
    formats: ["En ligne (Google Meet / Zoom)", "Présentiel (Rabat / Témara / Salé)"],
    zonesPresentiel: ["Rabat", "Témara", "Salé"],
    teacher: "Mohammed Ennaouri"
  },
  {
    id: 4,
    title: "Mathématiques - 1ère année Bac Sciences Maths",
    niveau: "1ÈRE ANNÉE BACCALAURÉAT",
    category: "LYCÉE",
    description: "Séance personnalisée de 2 heures pour les exigences de la filière Sciences Maths en 1ère BAC. Exercices d'application avancés, géométrie et analyse.",
    price: "200.00",
    priceSuffix: "/ séance (2h)",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    students: 64,
    duration: "2 heures",
    formats: ["En ligne (Google Meet / Zoom)", "Présentiel (Rabat / Témara / Salé)"],
    zonesPresentiel: ["Rabat", "Témara", "Salé"],
    teacher: "Mohammed Ennaouri"
  },
  {
    id: 5,
    title: "Mathématiques - Tronc Commun Scientifique",
    niveau: "TRONC COMMUN",
    category: "LYCÉE",
    description: "Séance de soutien de 2 heures pour réussir la transition du collège vers le lycée. Arithmétique, calcul vectoriel, polynômes et méthodologie de rédaction.",
    price: "200.00",
    priceSuffix: "/ séance (2h)",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    students: 210,
    duration: "2 heures",
    formats: ["En ligne (Google Meet / Zoom)", "Présentiel (Rabat / Témara / Salé)"],
    zonesPresentiel: ["Rabat", "Témara", "Salé"],
    teacher: "Mohammed Ennaouri"
  }
];
