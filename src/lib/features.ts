/**
 * Editorial layer for the feature pages.
 * Each entry turns a project into a magazine feature: an opening statement,
 * engineering decisions, challenges, trade-offs, a timeline and results.
 */

export type Feature = {
  slug: string;
  number: string;
  opener: string[];
  standfirst: string;
  published: string;
  readingTime: string;
  section: string;
  decisions: { title: string; body: string }[];
  challenges: { title: string; body: string }[];
  tradeoffs: { chosen: string; against: string; body: string }[];
  timeline: { period: string; phase: string; body: string }[];
  results: { label: string; body: string }[];
  gallery: { label: string; caption: string; lines: string[] }[];
};

export const FEATURES: Feature[] = [
  {
    slug: "retargetiq",
    number: "01",
    section: "Distributed Systems",
    opener: ["Millions of user events.", "One decision engine."],
    standfirst:
      "How ten independent services were taught to hold a single conversation — without ever speaking to one another directly.",
    published: "November 2025",
    readingTime: "7 minute read",
    decisions: [
      {
        title: "The log is the contract",
        body: "No service calls another by name. Every fact enters as an immutable Kafka record, and every consumer is free to fall behind, replay, or disappear entirely. The topology can be redrawn without renegotiating a single interface.",
      },
      {
        title: "Retrieval and ranking are separate clocks",
        body: "Retrieval answers in milliseconds from a narrowed candidate set. Ranking is allowed to be slower and smarter. Splitting them meant the request path stopped inheriting the cost of intelligence.",
      },
      {
        title: "Observability written first",
        body: "Prometheus counters and Grafana boards existed before the features they measure. A system you cannot read at 2am is a system you do not actually operate.",
      },
    ],
    challenges: [
      {
        title: "Consumer lag under burst",
        body: "Impression traffic is not uniform; it arrives in waves. Partition keys were rebalanced around user identity so a single hot cohort could not starve an entire consumer group.",
      },
      {
        title: "Cache truth versus log truth",
        body: "Redis held the fast answer, Kafka held the correct one. Invalidation was moved onto the event stream itself, making staleness a bounded, measurable quantity instead of a rumour.",
      },
    ],
    tradeoffs: [
      {
        chosen: "Eventual consistency",
        against: "Synchronous accuracy",
        body: "A recommendation that is two seconds old is useful. A recommendation that blocks the page is not.",
      },
      {
        chosen: "Ten small services",
        against: "One legible monolith",
        body: "The cost is operational surface. The return is that failure stays local and deployment stays independent.",
      },
    ],
    timeline: [
      { period: "Week 01–02", phase: "Topology", body: "Event taxonomy, topic design, partitioning strategy." },
      { period: "Week 03–05", phase: "Services", body: "Gateway, retrieval, ranking and feature store brought up in isolation." },
      { period: "Week 06–07", phase: "Instrumentation", body: "Metrics, dashboards, and failure drills against a live stream." },
      { period: "Week 08", phase: "Containment", body: "Full Docker Compose parity between laptop and deployment." },
    ],
    results: [
      { label: "Throughput", body: "Sustained ingestion across six topics with bounded consumer lag under synthetic burst load." },
      { label: "Resilience", body: "Any single service can be killed mid-stream; the log replays it back into agreement." },
      { label: "Reproducibility", body: "The entire ten-service topology stands up from one command." },
    ],
    gallery: [
      {
        label: "Plate 01a",
        caption: "Fig. 01a — consumer group rebalancing under burst",
        lines: [
          "spring.kafka.consumer.group-id: ranking",
          "spring.kafka.listener.concurrency: 6",
          "max.poll.records: 250",
          "partition.assignment.strategy: CooperativeSticky",
        ],
      },
      {
        label: "Plate 01b",
        caption: "Fig. 01b — invalidation travels on the stream",
        lines: [
          "featureStore.merge(userId, signals);",
          "ranker.invalidate(userId);",
          "metrics.counter(\"features.merged\").increment();",
        ],
      },
    ],
  },
  {
    slug: "autoiq",
    number: "02",
    section: "Predictive Intelligence",
    opener: ["Machines fail quietly.", "This one is listening."],
    standfirst:
      "A predictive maintenance pipeline built around a single uncomfortable truth: the two kinds of mistake do not cost the same.",
    published: "August 2025",
    readingTime: "6 minute read",
    decisions: [
      {
        title: "Cost asymmetry encoded in the loss",
        body: "A missed failure is forty times more expensive than a false alarm, so the training weights say exactly that. Accuracy was never the objective; expected cost was.",
      },
      {
        title: "One contract for model and interface",
        body: "Feature engineering, inference and health reporting share a single FastAPI schema, so the served model can never drift ahead of the thing calling it.",
      },
      {
        title: "Deterministic preprocessing",
        body: "Every transformation is versioned alongside the model. A prediction can be reconstructed from raw sensor data months later, exactly.",
      },
    ],
    challenges: [
      {
        title: "Severe class imbalance",
        body: "Failures are rare by definition. Stratified sampling plus weighted boosting kept the minority class from being optimised into silence.",
      },
      {
        title: "Sensor drift",
        body: "Readings shift as hardware ages. Rolling-window normalisation let the model judge behaviour relative to a machine's own recent history rather than a fixed factory baseline.",
      },
    ],
    tradeoffs: [
      {
        chosen: "More false alarms",
        against: "Higher raw accuracy",
        body: "The model is deliberately nervous. An hour of unnecessary inspection is cheaper than an unplanned stop.",
      },
      {
        chosen: "Gradient boosting",
        against: "A deep sequence model",
        body: "Interpretability won. An engineer can ask why a machine was flagged and receive an answer.",
      },
    ],
    timeline: [
      { period: "Phase I", phase: "Ingestion", body: "Sensor schema, cleaning, and windowed feature extraction." },
      { period: "Phase II", phase: "Modelling", body: "Cost-weighted training, threshold tuning against expected loss." },
      { period: "Phase III", phase: "Serving", body: "FastAPI inference, health endpoints, containerised deployment." },
      { period: "Phase IV", phase: "Submission", body: "EY Techathon 6.0 — entered and defended solo." },
    ],
    results: [
      { label: "0.97 ROC-AUC", body: "Held across validation folds with the cost-weighted objective in place." },
      { label: "Semi-finalist", body: "EY Techathon 6.0, competing as a single-person team." },
      { label: "Operational", body: "Inference and health monitoring served behind one reproducible container." },
    ],
    gallery: [
      {
        label: "Plate 02a",
        caption: "Fig. 02a — the forty-to-one penalty",
        lines: [
          "cost_weights = np.where(y_train == 1, 40.0, 1.0)",
          "clf = GradientBoostingClassifier()",
          "clf.fit(X_train, y_train, sample_weight=cost_weights)",
        ],
      },
      {
        label: "Plate 02b",
        caption: "Fig. 02b — threshold chosen by expected cost, not accuracy",
        lines: [
          "thresholds = np.linspace(0.05, 0.95, 91)",
          "expected = [(40 * fn(t)) + fp(t) for t in thresholds]",
          "operating_point = thresholds[np.argmin(expected)]",
        ],
      },
    ],
  },
  {
    slug: "student-portal",
    number: "03",
    section: "Interface Systems",
    opener: ["Legacy software, rewritten.", "This time as calm."],
    standfirst:
      "Most academic software is a database with an apology attached. This is an attempt at the opposite.",
    published: "December 2024",
    readingTime: "5 minute read",
    decisions: [
      {
        title: "One number, scanned in a second",
        body: "Students do not read dashboards; they check a single figure and leave. Attendance, CGPA and schedule sit at the top of the hierarchy, and everything else waits to be asked for.",
      },
      {
        title: "A small vocabulary of primitives",
        body: "Every view composes the same handful of components. The interface stays coherent as the feature set grows because nothing new has to be invented to add a screen.",
      },
      {
        title: "Survive a bad network",
        body: "Local state holds the last known good view, so a dropped connection degrades the page rather than erasing it.",
      },
    ],
    challenges: [
      {
        title: "Inherited data shapes",
        body: "The upstream records were designed for storage, not reading. A thin adaptation layer translates them into the shapes the interface actually wants.",
      },
      {
        title: "Density on small screens",
        body: "Academic data is inherently tabular. Tables were replaced with stacked record cards below the fold width, preserving scanability without horizontal scroll.",
      },
    ],
    tradeoffs: [
      {
        chosen: "Client-side routing",
        against: "Server-rendered pages",
        body: "Instant navigation between frequently revisited views mattered more than first-paint purity.",
      },
      {
        chosen: "Fewer visible fields",
        against: "Complete disclosure",
        body: "Everything remains reachable. Almost nothing is shown by default.",
      },
    ],
    timeline: [
      { period: "Stage 01", phase: "Audit", body: "Catalogue of the usability failures in the incumbent system." },
      { period: "Stage 02", phase: "Primitives", body: "Component vocabulary, spacing scale, data surfaces." },
      { period: "Stage 03", phase: "Workflows", body: "CRUD for student records, attendance and grades." },
      { period: "Stage 04", phase: "Hardening", body: "Responsive passes and performance tuning across devices." },
    ],
    results: [
      { label: "Three workflows", body: "Records, attendance and results unified under one interaction model." },
      { label: "Fully responsive", body: "Legible from a phone in a corridor to a desktop in an office." },
      { label: "Shipped", body: "Deployed and in use, built against real institutional constraints." },
    ],
    gallery: [
      {
        label: "Plate 03a",
        caption: "Fig. 03a — the surface, not the schema",
        lines: [
          "<Surface density=\"calm\">",
          "  <Metric label=\"Attendance\" value={attendance} />",
          "  <Metric label=\"CGPA\" value={cgpa} />",
          "</Surface>",
        ],
      },
      {
        label: "Plate 03b",
        caption: "Fig. 03b — degradation, not erasure",
        lines: [
          "const { data, error } = useRecords(studentId);",
          "if (error) return <LastKnownGood cache={cache} />;",
          "return <RecordTable rows={data} />;",
        ],
      },
    ],
  },
];

export const getFeature = (slug: string) => FEATURES.find((f) => f.slug === slug);

export const featureNumber = (slug: string) => getFeature(slug)?.number ?? "01";
