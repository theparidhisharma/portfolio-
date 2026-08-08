/**
 * Fun facts — the parts of the CV that never make it onto the CV.
 * Each fact is a short conversational line, optionally carrying links.
 */

export type FactLink = { label: string; href: string };

export type Fact = {
  id: string;
  kicker: string;
  text: string;
  links?: FactLink[];
};

export const FACTS: Fact[] = [
  {
    id: "gymnastics",
    kicker: "Before the keyboard",
    text: "I did competitive gymnastics for eight years through DDA Sports under the Delhi Government, right up until 2019. Balance beams teach you more about debugging than most tutorials do.",
  },
  {
    id: "bwsi",
    kicker: "One summer",
    text: "I was selected for MIT's Beaver Works Summer Institute — which is a very formal way of saying I spent a summer surrounded by people who thought out loud in algorithms.",
  },
  {
    id: "ghostwriter",
    kicker: "A previous life",
    text: "Long before Kafka topics, I was a content writer and a ghostwriter. Somewhere out there are words with my fingerprints and somebody else's name.",
  },
  {
    id: "mythical",
    kicker: "Co-authored",
    text: "I co-wrote The Mythical Mysteries, a blog about unexplained phenomena. Yes, I researched hauntings with the same rigour I now reserve for distributed traces.",
    links: [
      { label: "The Mythical Mysteries", href: "https://themythicalmysteries.wordpress.com/" },
    ],
  },
  {
    id: "justmywrites",
    kicker: "Also written",
    text: "Just My Writes was the place I went when a thought refused to become code.",
    links: [{ label: "Just My Writes", href: "https://justmywritesblog.wordpress.com/" }],
  },
  {
    id: "waste",
    kicker: "A quieter obsession",
    text: "I built Solution for Waste, a blog about waste and sustainability — systems thinking, just with landfills instead of load balancers.",
    links: [{ label: "Solution for Waste", href: "https://solutionforwaste.wordpress.com/" }],
  },
  {
    id: "microeconomics",
    kicker: "99.8%",
    text: "I scored 99.8% in MITx AP Microeconomics on edX. I still think about opportunity cost far too often.",
  },
  {
    id: "mun",
    kicker: "Point of order",
    text: "I've argued at Model United Nations conferences at both national and international level. Turns out defending a design doc is easier after defending a country's foreign policy.",
  },
  {
    id: "speaking",
    kicker: "Out loud",
    text: "I've been part of public-speaking circles like Speak and Grow and Argumentative Indians — the second one is exactly as spirited as it sounds.",
  },
  {
    id: "kathak",
    kicker: "Trained in",
    text: "I'm a trained Kathak dancer and have performed at cultural festivals. Footwork in sixteen beats is its own kind of precision engineering.",
  },
  {
    id: "singing",
    kicker: "On stage",
    text: "I sing. Third place in Solo at SYMPHONY, Delhi, and several Zonal first positions with the East Delhi Choir.",
  },
  {
    id: "arc",
    kicker: "The plot twist",
    text: "I went from writing about mysteries and ghostwriting for strangers to building distributed systems with Kafka and Spring Boot. Same job, honestly — make the invisible legible.",
  },
];
