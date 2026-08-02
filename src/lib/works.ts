export type Work = {
  slug: string;
  index: string;
  title: string;
  discipline: string;
  year: string;
  role: string;
  stack: string[];
  glyph: string;
  snippet: string[];
  plateCaption: string;
  line: string;
  summary: string;
  pullQuote: string;
  chapters: { heading: string; body: string }[];
  architecture: string[];
  stats: { value: number; suffix: string; label: string }[];
  links: { label: string; href: string }[];
};

export const WORKS: Work[] = [
  {
    slug: "retargetiq",
    index: "I",
    title: "RetargetIQ",
    discipline: "Distributed Systems",
    year: "2025",
    role: "Architecture, Backend",
    stack: ["Java", "Spring Boot", "Apache Kafka", "Redis", "Docker", "Grafana"],
    glyph: "I",
    snippet: [
      "@KafkaListener(topics = \"impressions\", groupId = \"ranking\")",
      "void onImpression(ImpressionEvent event) {",
      "  featureStore.merge(event.userId(), event.signals());",
      "  ranker.invalidate(event.userId());",
      "}",
    ],
    plateCaption: "Fig. I — event log, ten services, one conversation",
    line: "Ten services. One conversation.",
    summary:
      "A distributed recommendation platform built as an event-driven organism — ten Spring Boot services speaking asynchronously through Kafka, each one deaf to the others except through the log.",
    pullQuote:
      "A system is not its diagram. It is what survives the moment a service disappears.",
    chapters: [
      {
        heading: "Premise",
        body: "Recommendation is a latency problem disguised as a relevance problem. RetargetIQ separates the two: retrieval and ranking answer the request, while analytics and the feature store answer the future. Nothing waits on anything it does not need.",
      },
      {
        heading: "Method",
        body: "Ten Spring Boot microservices communicate over Apache Kafka partitions and consumer groups. Redis holds the hot feature layer. Docker Compose makes the entire topology reproducible on a laptop, then unchanged in deployment.",
      },
      {
        heading: "Instrumentation",
        body: "Prometheus scrapes throughput and per-service latency; Grafana turns the stream into something a human can read at 2am. Observability was written before the features it observes.",
      },
    ],
    architecture: [
      "Gateway",
      "Retrieval",
      "Kafka Event Log",
      "Ranking",
      "Feature Store",
      "Analytics",
    ],
    stats: [
      { value: 10, suffix: "+", label: "Microservices" },
      { value: 6, suffix: "", label: "Kafka topics" },
      { value: 100, suffix: "%", label: "Containerised" },
    ],
    links: [
      { label: "Repository", href: "https://github.com/theparidhisharma/RetargetIQ" },
      { label: "Live", href: "https://retarget-iq-frontend.vercel.app/" },
    ],
  },
  {
    slug: "autoiq",
    index: "II",
    title: "AutoIQ",
    discipline: "Predictive Intelligence",
    year: "2025",
    role: "ML Engineering, Backend",
    stack: ["Python", "FastAPI", "Scikit-Learn", "SQLite", "Docker"],
    glyph: "II",
    snippet: [
      "clf = GradientBoostingClassifier()",
      "clf.fit(X_train, y_train, sample_weight=cost_weights)",
      "",
      "# a missed failure costs 40x a false alarm",
      "cost_weights = np.where(y_train == 1, 40.0, 1.0)",
    ],
    plateCaption: "Fig. II — cost asymmetry as a design decision",
    line: "The machine tells you before it breaks.",
    summary:
      "An end-to-end predictive maintenance platform: sensor data in, failure probability out, with cost-sensitive learning that treats a missed failure as the expensive mistake it actually is.",
    pullQuote:
      "A false alarm costs an hour. A missed failure costs a factory. The model should know the difference.",
    chapters: [
      {
        heading: "Premise",
        body: "Equipment rarely fails without warning; it fails without anyone listening. AutoIQ builds the listener — an ingestion, feature engineering, and inference pipeline that keeps a running opinion on the health of every machine it watches.",
      },
      {
        heading: "Method",
        body: "Automated preprocessing and feature engineering feed a cost-sensitive classifier served through FastAPI. Model serving, health monitoring, and inference endpoints share one contract, so the interface never lags the model.",
      },
      {
        heading: "Result",
        body: "ROC-AUC of 0.97 with a deliberate asymmetry: false negatives are penalised harder than false positives. Semi-finalist, EY Techathon 6.0 — entered solo.",
      },
    ],
    architecture: [
      "Sensor Ingest",
      "Feature Pipeline",
      "Cost-Sensitive Model",
      "FastAPI Inference",
      "Health Monitor",
    ],
    stats: [
      { value: 97, suffix: "%", label: "ROC-AUC" },
      { value: 6, suffix: "", label: "EY Techathon semi-final" },
      { value: 1, suffix: "", label: "Solo participant" },
    ],
    links: [{ label: "Repository", href: "https://github.com/theparidhisharma/AutoIQ" }],
  },
  {
    slug: "student-portal",
    index: "III",
    title: "Student Portal",
    discipline: "Interface Systems",
    year: "2024",
    role: "Frontend Architecture",
    stack: ["React", "JavaScript", "Tailwind CSS", "REST APIs"],
    glyph: "III",
    snippet: [
      "<Surface density=\"calm\">",
      "  <Metric label=\"Attendance\" value={attendance} />",
      "  <Metric label=\"CGPA\" value={cgpa} />",
      "</Surface>",
    ],
    plateCaption: "Fig. III — one number, scanned in a second",
    line: "Legacy systems, rewritten as calm.",
    summary:
      "A full academic management portal built against the usability failures of legacy university software — modular components, clean data surfaces, and workflows that survive a bad network.",
    pullQuote:
      "Most academic software is a database with an apology attached. This one is an interface.",
    chapters: [
      {
        heading: "Premise",
        body: "Students do not read dashboards; they scan them for one number. The portal is structured around that fact — grades, attendance, and schedules are surfaced at a glance, with detail available only on intent.",
      },
      {
        heading: "Method",
        body: "Modular React components consume REST APIs behind client-side routing and local state. Every view is a composition of the same small set of primitives, which is why it stays coherent as it grows.",
      },
      {
        heading: "Result",
        body: "A responsive interface tuned for usability and performance across devices, with CRUD workflows for student records that stay legible under load.",
      },
    ],
    architecture: ["Routing Shell", "Component Primitives", "REST Layer", "State Store"],
    stats: [
      { value: 3, suffix: "", label: "Core workflows" },
      { value: 100, suffix: "%", label: "Responsive" },
      { value: 2024, suffix: "", label: "Year built" },
    ],
    links: [
      { label: "Repository", href: "https://github.com/theparidhisharma/StudentPortal" },
      { label: "Live", href: "https://student-portal-navy-six.vercel.app/" },
    ],
  },
];

export const getWork = (slug: string) => WORKS.find((w) => w.slug === slug);

export const RECORD = [
  { year: "2026 —", title: "Flipkart", detail: "Software Engineer Intern · Bengaluru" },
  { year: "2026 —", title: "Microsoft Student Chapter", detail: "President · IGDTUW" },
  { year: "2025", title: "Deutsche Telekom Digital Labs", detail: "Software Engineer Intern · Gurugram" },
  { year: "2024 —", title: "IGDTUW", detail: "B.Tech Computer Science · CGPA 8.42" },
];

export const HONOURS = [
  "Top 200 of 27,000+ — Flipkart Girls Wanna Code 7.0",
  "Semi-Finalist — EY Techathon 6.0",
  "98.5% template extraction accuracy — log analytics platform, Flipkart",
];

export const DISCIPLINES = [
  "Java", "Python", "C++", "SQL", "Spring Boot", "Apache Kafka", "Microservices",
  "Docker", "Redis", "MySQL", "React", "Tailwind CSS", "Scikit-Learn", "FastAPI",
];

export const SOCIALS = {
  linkedin: "https://www.linkedin.com/in/theparidhisharma/",
  github: "https://github.com/theparidhisharma/",
  leetcode: "https://leetcode.com/u/paridhi_sharma/",
  email: "paridhi0203sharma@gmail.com",
  resume:
    "https://drive.google.com/file/d/1ywG9grgBQ6Qx356CN_cXsuKipOyG9uYq/view?usp=sharing",
};
