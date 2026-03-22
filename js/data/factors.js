// 5 factors, each with 5 levels, customized per function (5 functions)
// Level points: 20, 40, 60, 80, 100
// Level labels: Entry, Developing, Proficient, Advanced, Expert/Leader

export const LEVEL_POINTS = [20, 40, 60, 80, 100];
export const LEVEL_LABELS = ["Entry", "Developing", "Proficient", "Advanced", "Expert/Leader"];

export const FACTORS = [
  {
    id: "knowledge",
    name: "Knowledge and Expertise",
    shortName: "Knowledge",
    description: "Domain depth, technical credibility"
  },
  {
    id: "problem_solving",
    name: "Problem Solving",
    shortName: "Problem Solving",
    description: "Complexity of challenges, novelty of approach"
  },
  {
    id: "scope_impact",
    name: "Scope and Impact",
    shortName: "Scope & Impact",
    description: "Breadth of influence, organizational reach"
  },
  {
    id: "regulatory",
    name: "Regulatory and Compliance",
    shortName: "Regulatory",
    description: "Regulatory accountability, compliance ownership"
  },
  {
    id: "leadership",
    name: "People Leadership",
    shortName: "Leadership",
    description: "Management span, organizational development"
  }
];

export const DEFAULT_WEIGHTS = [25, 20, 25, 20, 10];

export const FUNCTIONS = [
  {
    id: "rnd",
    name: "R&D",
    subtitle: "Bench and lab research",
    color: "#2563eb"
  },
  {
    id: "scientific",
    name: "Scientific",
    subtitle: "Data, evidence, publications",
    color: "#7c3aed"
  },
  {
    id: "clinical",
    name: "Clinical",
    subtitle: "Clinical operations",
    color: "#059669"
  },
  {
    id: "business",
    name: "Business Ops",
    subtitle: "Finance, HR, legal, admin",
    color: "#d97706"
  },
  {
    id: "regulatory",
    name: "Regulatory",
    subtitle: "Regulatory affairs and quality",
    color: "#dc2626"
  }
];

// DESCRIPTIONS[functionId][factorId][levelIndex] = description string
// 5 functions × 5 factors × 5 levels = 125 descriptions
export const DESCRIPTIONS = {
  // ──────────────────────── R&D ────────────────────────
  rnd: {
    knowledge: [
      "Foundational understanding of lab techniques (e.g., PCR, cell culture, basic chromatography). Follows established SOPs under direct supervision; learning to apply academic knowledge to bench research.",
      "Working proficiency in core assay platforms and analytical methods. Able to troubleshoot routine experimental failures, interpret standard data outputs, and maintain lab notebooks to GLP-adjacent standards.",
      "Deep expertise in one or more modality platforms (small molecule, biologics, gene therapy). Designs experiments independently, selects appropriate controls, and critically evaluates literature to inform study design.",
      "Recognized internal authority on a key technology area (e.g., ADC conjugation, CRISPR screening, formulation science). Evaluates and introduces novel methods; trains others and reviews experimental designs across programs.",
      "Enterprise-wide thought leader whose scientific judgment shapes portfolio decisions. Publishes in peer-reviewed journals, presents at major conferences, and is sought for external scientific advisory roles."
    ],
    problem_solving: [
      "Solves well-defined problems using established protocols. Identifies when an experiment deviates from expected results and escalates appropriately to senior scientists.",
      "Troubleshoots moderately complex experimental issues (e.g., inconsistent assay performance, unexpected impurity profiles). Proposes adjustments to methods and evaluates outcomes with guidance.",
      "Tackles multi-variable problems spanning assay development, formulation, or scale-up. Designs DOE studies, synthesizes data from multiple sources, and recommends path-forward decisions for project teams.",
      "Resolves high-impact technical challenges that threaten program timelines (e.g., CMC bottlenecks, selectivity issues). Develops novel experimental approaches and mentors others through complex problem-solving.",
      "Defines and frames unsolved scientific problems that create new research directions. Architects innovative experimental strategies across therapeutic programs; decisions influence multi-year R&D investment."
    ],
    scope_impact: [
      "Impact limited to own experiments and assigned bench tasks. Contributes to a single project workstream under close supervision.",
      "Contributes meaningfully to one project team. Generates data that directly informs project decisions; work quality affects team timelines.",
      "Leads a major workstream within a program or owns a complete assay/technology platform. Results influence program-level go/no-go decisions and are presented to cross-functional stakeholders.",
      "Impacts multiple programs or a full therapeutic area. Technical decisions shape resource allocation and platform strategy; serves as key voice in portfolio review discussions.",
      "Enterprise-level impact on R&D strategy and scientific direction. Influences pipeline prioritization, external partnerships, and technology investments. Work products shape the company's competitive positioning."
    ],
    regulatory: [
      "Follows established SOPs and documents work in lab notebooks per company standards. Completes required training modules on GLP and safety protocols.",
      "Understands how own bench work connects to regulatory submissions. Maintains compliant records, flags deviations, and participates in internal audit preparation.",
      "Ensures experimental programs meet regulatory requirements for IND-enabling studies. Authors or reviews technical sections of regulatory documents; anticipates agency questions on data packages.",
      "Owns regulatory strategy for a technology platform or program. Leads interactions with CMC reviewers, designs studies to satisfy FDA/EMA requirements, and resolves compliance gaps proactively.",
      "Shapes company-wide regulatory science strategy. Engages directly with health authorities on novel pathways, contributes to industry guidance documents, and sets standards for regulatory excellence across R&D."
    ],
    leadership: [
      "Individual contributor with no direct reports. Collaborates within a lab team, shares equipment responsibilities, and participates in team meetings.",
      "May mentor interns or rotation students. Coordinates with peers on shared experiments; contributes to a positive lab culture and knowledge sharing.",
      "Leads a small team or workstream (2–5 reports or matrix members). Sets priorities, conducts 1:1s, provides technical coaching, and ensures team alignment with program goals.",
      "Manages a functional group or lab section (5–15 people). Responsible for hiring, performance management, development planning, and cross-team coordination within a department.",
      "Leads a department or large cross-functional organization. Builds organizational capability, designs team structures, drives culture, and is accountable for talent strategy across R&D."
    ]
  },

  // ──────────────────────── Scientific ────────────────────────
  scientific: {
    knowledge: [
      "Basic understanding of biostatistics, scientific writing, or data analysis tools. Learning company data standards, publication processes, and how scientific evidence supports product development.",
      "Working knowledge of statistical methods, literature synthesis, or scientific communication. Can perform standard analyses, draft manuscripts sections, and interpret published clinical or preclinical data.",
      "Expert in scientific discipline (biostatistics, epidemiology, medical writing, or pharmacometrics). Independently designs analyses, critically appraises evidence, and ensures scientific rigor across deliverables.",
      "Deep expertise spanning multiple scientific domains. Develops novel analytical frameworks, leads complex evidence synthesis (e.g., meta-analyses, NMA), and is recognized as a go-to authority for methodology questions.",
      "World-class scientific leader who defines evidence strategy for the organization. Shapes publication plans, external scientific engagement, and data-driven portfolio decisions. Recognized externally as a key opinion leader."
    ],
    problem_solving: [
      "Applies standard analytical methods to well-defined scientific questions. Follows established templates for data visualization and reporting.",
      "Addresses moderately complex analytical challenges (e.g., missing data handling, subgroup analyses). Identifies inconsistencies in datasets and proposes solutions with guidance.",
      "Solves complex scientific problems requiring novel analytical approaches. Designs studies to fill evidence gaps, integrates disparate data sources, and provides actionable insights to project teams.",
      "Resolves high-stakes scientific challenges that affect regulatory or commercial positioning (e.g., benefit-risk frameworks, adaptive trial designs). Innovates methodologically and trains others in advanced techniques.",
      "Frames and solves enterprise-level scientific problems that shape therapeutic strategy. Develops new evidence paradigms, leads cross-company scientific initiatives, and influences industry methodology standards."
    ],
    scope_impact: [
      "Supports a single project or publication. Contributes analyses or writing sections under close direction from senior scientists.",
      "Owns deliverables for one or two projects (e.g., a CSR section, a poster, a standard analysis). Work quality directly affects team milestones.",
      "Leads the scientific strategy for a program or therapeutic area deliverable. Evidence packages influence regulatory submissions, advisory board content, and publication plans.",
      "Shapes evidence strategy across multiple programs. Decisions affect competitive positioning, payer negotiations, and lifecycle management across a therapeutic franchise.",
      "Defines the company's scientific evidence and data strategy. Impacts portfolio-level investment decisions, external scientific reputation, and partnerships with academic institutions."
    ],
    regulatory: [
      "Aware of regulatory data standards (e.g., CDISC, ICH guidelines). Follows SOPs for data handling and document preparation.",
      "Understands regulatory expectations for statistical analysis plans and clinical study reports. Ensures own outputs comply with submission standards and can support audit trails.",
      "Authors or reviews key regulatory documents (e.g., SAPs, integrated summaries). Ensures analyses meet agency expectations and anticipates reviewer questions on scientific methodology.",
      "Leads regulatory interactions on scientific/statistical matters. Designs evidence packages to support approval, label expansion, or post-marketing commitments. Proactively addresses compliance risks.",
      "Shapes the company's approach to regulatory science. Engages with agencies on methodological innovation (e.g., RWE acceptance, novel endpoints), and represents the organization in industry working groups."
    ],
    leadership: [
      "Individual contributor focused on own deliverables. Participates in team meetings and collaborates with peers on shared analyses.",
      "Mentors junior analysts or writers. Coordinates with cross-functional partners on data requests and timelines; contributes to team process improvements.",
      "Leads a small scientific team or workstream (2–5 members). Sets analytical priorities, reviews team outputs, and ensures quality and timeliness of deliverables.",
      "Manages a scientific function (5–15 people across biostatistics, medical writing, or data science). Responsible for hiring, development, resource allocation, and cross-functional collaboration.",
      "Leads a large scientific organization or center of excellence. Builds organizational capability, establishes scientific standards, and drives talent development strategy for the entire function."
    ]
  },

  // ──────────────────────── Clinical ────────────────────────
  clinical: {
    knowledge: [
      "Basic understanding of clinical trial phases, GCP principles, and the role of CROs. Familiar with clinical documents (protocols, ICFs) and learning site management fundamentals.",
      "Working knowledge of clinical operations processes including site start-up, monitoring, data cleaning, and safety reporting. Understands TMF requirements and can manage routine site interactions.",
      "Expert in clinical trial execution across multiple phases. Deep knowledge of GCP, ICH E6, and regional regulations. Independently manages complex studies, vendor relationships, and cross-functional clinical teams.",
      "Mastery of clinical operations strategy including adaptive designs, decentralized trials, and global regulatory nuances. Designs operational plans for complex programs and resolves high-impact execution challenges.",
      "Enterprise-level clinical operations authority. Defines the company's approach to trial execution, innovation in clinical delivery, and global site strategy. Sought for external advisory roles on clinical trial modernization."
    ],
    problem_solving: [
      "Addresses straightforward operational issues (e.g., scheduling site visits, tracking document collection) using established processes and escalation pathways.",
      "Troubleshoots moderate operational challenges (e.g., lagging enrollment at a site, protocol deviations, CRO performance gaps). Proposes corrective actions with supervisor input.",
      "Solves complex clinical execution problems spanning multiple sites, countries, or vendors. Develops risk mitigation strategies, leads root cause analyses, and implements process improvements across studies.",
      "Resolves high-impact clinical crises (e.g., clinical holds, site shutdowns, safety signals requiring protocol amendments). Makes rapid, sound decisions under regulatory and timeline pressure.",
      "Frames and addresses systemic clinical operations challenges. Architects new operational models (e.g., hybrid monitoring, AI-enabled data review), drives organizational learning, and influences industry best practices."
    ],
    scope_impact: [
      "Supports a single study or study site. Assists with site communications, document tracking, and data queries under direct supervision.",
      "Manages a defined scope within a trial (e.g., a set of sites, a specific region, or a functional workstream). Work quality directly affects study timelines and data integrity.",
      "Leads clinical operations for an entire study or multiple studies within a program. Responsible for enrollment, quality, budget, and vendor performance across the trial.",
      "Oversees clinical operations for a therapeutic area or global program. Decisions on operational strategy, resource deployment, and vendor governance affect multiple concurrent trials.",
      "Accountable for the company's clinical operations portfolio. Shapes trial execution strategy, global site networks, and technology adoption. Impact spans all active and planned clinical programs."
    ],
    regulatory: [
      "Follows GCP training requirements and SOPs for clinical documentation. Understands the basics of regulatory submissions as they relate to clinical data.",
      "Ensures site-level regulatory compliance (IRB/EC submissions, regulatory binder maintenance). Identifies and escalates potential GCP deviations in a timely manner.",
      "Owns regulatory compliance for a study, including audit readiness, inspection preparation, and resolution of findings. Ensures protocol and ICF amendments meet regulatory requirements across jurisdictions.",
      "Leads regulatory strategy for clinical operations, including global submission timelines, health authority interactions on clinical conduct issues, and CAPA program management.",
      "Defines the company's approach to clinical regulatory excellence. Engages with agencies on inspection trends, drives GCP quality culture, and influences industry standards for clinical compliance."
    ],
    leadership: [
      "Individual contributor supporting a clinical team. Participates in team meetings, training sessions, and coordinates own workload with guidance.",
      "Coordinates with CRAs, data managers, and site staff. May mentor new team members on processes and tools; contributes to positive team dynamics.",
      "Leads a clinical operations team for a study (2–8 CRAs/CTAs). Sets priorities, manages workload distribution, conducts performance check-ins, and ensures team adherence to timelines.",
      "Manages a clinical operations department or global study team (8–20 people). Responsible for hiring, performance management, vendor team oversight, and operational process governance.",
      "Leads the clinical operations organization. Builds global team capability, designs org structure for scaling, drives operational culture, and is accountable for enterprise talent and succession planning."
    ]
  },

  // ──────────────────────── Business Ops ────────────────────────
  business: {
    knowledge: [
      "Foundational understanding of business function (finance, HR, legal, or administration). Familiar with company policies, basic tools (Excel, HRIS, ERP), and standard operating procedures.",
      "Working proficiency in functional area. Competent in relevant systems and processes (e.g., financial close, benefits administration, contract review). Applies knowledge to handle standard business transactions.",
      "Deep expertise in a business discipline (FP&A, compensation, corporate law, procurement). Independently manages complex processes, interprets policy, and advises internal clients on functional matters.",
      "Recognized authority in functional domain. Designs or improves company-wide processes, leads system implementations, and provides strategic counsel to senior leadership on business operations.",
      "Enterprise-level business leader who shapes corporate infrastructure and operational strategy. Drives transformation initiatives, builds scalable systems, and influences company-wide policy and governance."
    ],
    problem_solving: [
      "Resolves routine operational issues using established procedures (e.g., invoice discrepancies, onboarding checklists, scheduling conflicts). Escalates non-standard issues appropriately.",
      "Addresses moderately complex business problems (e.g., budget variances, policy interpretation questions, vendor disputes). Gathers information and proposes solutions with supervisor input.",
      "Solves multi-faceted business problems requiring cross-functional coordination (e.g., restructuring a cost center, designing a new compensation program, negotiating complex contracts).",
      "Resolves high-impact operational challenges affecting company-wide performance (e.g., ERP migration, organizational redesign, M&A integration planning). Develops innovative solutions to systemic issues.",
      "Frames strategic business problems and architects enterprise solutions. Anticipates organizational needs, leads transformational change, and makes decisions with significant financial and operational implications."
    ],
    scope_impact: [
      "Impact limited to own tasks within a single business function. Supports team operations under close direction.",
      "Manages a defined process or set of transactions. Work quality affects functional team efficiency and internal client satisfaction.",
      "Owns a complete business process or program (e.g., annual budgeting cycle, benefits program, contract management). Decisions affect multiple departments and have measurable operational impact.",
      "Leads a business function with impact across the organization. Responsible for functional strategy, vendor relationships, and process governance that affects company-wide operations.",
      "Shapes the company's operational infrastructure and business strategy. Decisions on systems, policies, and organizational design affect all employees and have significant financial implications."
    ],
    regulatory: [
      "Follows company policies and procedures. Completes required compliance training (e.g., SOX, data privacy, anti-harassment). Understands basic regulatory requirements relevant to own function.",
      "Ensures own work meets compliance standards (e.g., financial controls, employment law, data protection). Identifies potential compliance issues and escalates to appropriate teams.",
      "Manages compliance requirements for a business process or program. Implements controls, supports audits, and ensures functional policies align with regulatory requirements (SOX, GDPR, labor law).",
      "Owns compliance strategy for a business function. Leads audit responses, designs control frameworks, and ensures company-wide adherence to relevant regulations and standards.",
      "Defines the company's approach to corporate compliance and governance. Engages with external auditors and regulators, shapes policy, and drives a culture of compliance across the organization."
    ],
    leadership: [
      "Individual contributor focused on own deliverables. Collaborates with teammates and supports shared administrative responsibilities.",
      "Coordinates with peers across functions. May train new hires on processes and tools; contributes to team documentation and knowledge sharing.",
      "Leads a small business operations team (2–6 people). Manages workload, conducts check-ins, and develops team members' functional skills.",
      "Manages a business function department (6–20 people). Responsible for hiring, performance management, budget oversight, and cross-functional coordination.",
      "Leads a major corporate function or multiple business operations teams. Builds organizational capability, drives operational excellence culture, and is accountable for functional talent strategy."
    ]
  },

  // ──────────────────────── Regulatory ────────────────────────
  regulatory: {
    knowledge: [
      "Basic understanding of regulatory affairs or quality assurance in life sciences. Familiar with FDA/EMA structure, GxP principles, and common submission types (IND, NDA, BLA).",
      "Working knowledge of regulatory processes and quality systems. Can prepare standard regulatory documents, understand review timelines, and navigate eCTD structure or QMS basics.",
      "Expert in regulatory strategy or quality systems for a product type or therapeutic area. Independently manages submissions, designs quality programs, and interprets complex regulatory guidance.",
      "Deep regulatory authority across multiple jurisdictions and product types. Develops novel regulatory strategies, leads health authority interactions, and is the go-to resource for complex regulatory questions.",
      "Enterprise-level regulatory leader who shapes the company's global regulatory and quality strategy. Engages with agencies at the policy level, influences industry guidance, and drives regulatory innovation."
    ],
    problem_solving: [
      "Addresses routine regulatory or quality questions using established guidance and SOPs. Escalates ambiguous situations to experienced regulatory professionals.",
      "Resolves moderately complex regulatory issues (e.g., submission deficiencies, CAPA investigations, labeling discrepancies). Researches precedents and proposes solutions with team input.",
      "Solves complex regulatory challenges requiring strategic judgment (e.g., pathway selection for novel modalities, post-marketing commitment negotiations, major quality system redesigns).",
      "Tackles high-impact regulatory crises (e.g., complete response letters, FDA warning letters, product recalls). Develops comprehensive response strategies and leads cross-functional resolution teams.",
      "Defines regulatory strategy for unprecedented situations. Pioneers new approaches to agency engagement, shapes regulatory science for novel technologies, and resolves enterprise-level compliance challenges."
    ],
    scope_impact: [
      "Supports a single regulatory submission or quality workstream. Contributes document sections, tracks correspondence, or assists with quality record management.",
      "Manages a defined regulatory or quality deliverable (e.g., a submission module, a CAPA program, a supplier qualification). Work quality directly affects compliance and timelines.",
      "Leads regulatory strategy or quality program for a product or therapeutic area. Owns agency interactions, submission plans, and quality metrics that affect program progression.",
      "Oversees regulatory or quality operations across multiple programs. Decisions on strategy, resource allocation, and agency engagement affect the company's overall regulatory posture.",
      "Accountable for the company's global regulatory and quality portfolio. Shapes regulatory strategy at the enterprise level, influences pipeline decisions, and ensures organizational compliance excellence."
    ],
    regulatory: [
      "Follows GxP requirements and completes all required regulatory and quality training. Maintains accurate records and adheres to document control procedures.",
      "Ensures own deliverables meet regulatory standards. Participates in inspection readiness activities and maintains awareness of evolving regulatory requirements relevant to assigned projects.",
      "Owns regulatory compliance for a product or quality system. Manages inspection preparation, tracks regulatory commitments, and ensures submissions meet current agency expectations across jurisdictions.",
      "Leads the company's regulatory compliance strategy for a major area (e.g., CMC, clinical, post-market). Drives inspection readiness, manages regulatory intelligence, and resolves systemic compliance gaps.",
      "Defines and drives the company's enterprise-wide regulatory compliance culture. Establishes quality and regulatory standards, engages with agencies on compliance frameworks, and sets the bar for organizational excellence."
    ],
    leadership: [
      "Individual contributor supporting a regulatory or quality team. Participates in team activities and coordinates own workload under guidance.",
      "Coordinates with cross-functional partners on regulatory or quality deliverables. May mentor junior staff and contributes to team process improvements.",
      "Leads a regulatory or quality team (2–6 people). Sets priorities, reviews submissions or quality records, develops team members, and ensures alignment with organizational goals.",
      "Manages a regulatory or quality department (6–20 people). Responsible for hiring, performance management, functional strategy, and cross-departmental collaboration on regulatory matters.",
      "Leads the regulatory affairs and/or quality organization. Builds global regulatory capability, designs organizational structure for scale, drives professional development, and owns talent strategy for the function."
    ]
  }
};
