import { PrismaClient, Role, Health, TaskStatus, Priority, TaskType, MilestoneStatus, BlockerType, BlockerSeverity, AgendaKind } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const d = (s: string) => new Date(s + "T00:00:00Z");

async function main() {
  console.log("Seeding…");

  // Wipe (order matters: children first)
  await prisma.agendaItem.deleteMany();
  await prisma.blocker.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectSource.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userPrefs.deleteMany();
  await prisma.user.deleteMany();
  await prisma.pipelineStage.deleteMany();
  await prisma.domain.deleteMany();

  // Domains
  await prisma.domain.createMany({
    data: [
      { key: "cleaning", label: "Propreté", accentColor: "#1CBAE9" },
      { key: "energy", label: "Énergie & Tech", accentColor: "#76B942" },
      { key: "security", label: "Sécurité", accentColor: "#F07D10" },
      { key: "catering", label: "Restauration", accentColor: "#FCC820" },
      { key: "group", label: "Groupe / Transverse", accentColor: "#455560" },
    ],
  });

  // Pipeline stages
  await prisma.pipelineStage.createMany({
    data: [
      { key: "cadrage", label: "Cadrage", orderIndex: 1 },
      { key: "ingestion", label: "Ingestion", orderIndex: 2 },
      { key: "modelisation", label: "Modélisation", orderIndex: 3 },
      { key: "restitution", label: "Restitution", orderIndex: 4 },
      { key: "recette", label: "Recette", orderIndex: 5 },
      { key: "prod", label: "Production", orderIndex: 6 },
    ],
  });

  // Users
  const pwd = await bcrypt.hash("admin", 10);
  const me = await prisma.user.create({
    data: { email: "admin@atalian.local", password: pwd, fullName: "Vous", role: Role.CHEF_PROJET },
  });
  const karim = await prisma.user.create({ data: { email: "karim@atalian.local", password: pwd, fullName: "Karim B.", role: Role.DATA_ENG } });
  const sofia = await prisma.user.create({ data: { email: "sofia@atalian.local", password: pwd, fullName: "Sofia L.", role: Role.DATA_ENG } });
  const marc = await prisma.user.create({ data: { email: "marc@atalian.local", password: pwd, fullName: "Marc T.", role: Role.DATA_ENG } });
  const lea = await prisma.user.create({ data: { email: "lea@atalian.local", password: pwd, fullName: "Léa M.", role: Role.DATA_ENG } });
  const byName: Record<string, string> = { "Vous": me.id, "Karim B.": karim.id, "Sofia L.": sofia.id, "Marc T.": marc.id, "Léa M.": lea.id };

  await prisma.userPrefs.create({ data: { userId: me.id } });

  // Projects (slugs comme ids stables)
  const projects = [
    {
      id: "p1", name: "Cockpit Performance Propreté", domainKey: "cleaning", sponsor: "Direction Opérations Propreté",
      progress: 72, health: Health.ON_TRACK, stageKey: "restitution", dueDate: d("2026-07-10"),
      dataQuality: 94, freshness: "Temps réel", teamSize: 5,
      sources: ["GMAO", "Pointage agents", "Tickets qualité"],
      summary: "Tableau de bord multi-sites des prestations de nettoyage : taux de conformité, réclamations, productivité agents.",
    },
    {
      id: "p2", name: "Pipeline IoT Bâtiments", domainKey: "energy", sponsor: "Énergie & Maintenance",
      progress: 48, health: Health.AT_RISK, stageKey: "ingestion", dueDate: d("2026-08-05"),
      dataQuality: 81, freshness: "15 min", teamSize: 4,
      sources: ["Capteurs IoT", "BMS sites", "Météo France"],
      summary: "Ingestion des capteurs (température, occupation, CO₂, consommation) pour 38 sites clients pilotes.",
    },
    {
      id: "p3", name: "Modèle Prédictif Énergie", domainKey: "energy", sponsor: "Direction RSE",
      progress: 30, health: Health.BLOCKED, stageKey: "modelisation", dueDate: d("2026-09-15"),
      dataQuality: 68, freshness: "Quotidien", teamSize: 3,
      sources: ["Pipeline IoT", "Factures énergie", "Historique conso"],
      summary: "Prévision de la consommation énergétique des sites pour anticiper les dérives et nourrir le reporting RSE.",
    },
    {
      id: "p4", name: "Référentiel Contrats Clients", domainKey: "group", sponsor: "Direction Commerciale",
      progress: 60, health: Health.ON_TRACK, stageKey: "recette", dueDate: d("2026-06-30"),
      dataQuality: 89, freshness: "Quotidien", teamSize: 4,
      sources: ["CRM", "ERP contrats", "Référentiel sites"],
      summary: "Référentiel unique des contrats FM (périmètre, prestations, SLA) pour fiabiliser le pilotage et la facturation.",
    },
    {
      id: "p5", name: "Reporting RH Terrain", domainKey: "group", sponsor: "DRH",
      progress: 18, health: Health.AT_RISK, stageKey: "cadrage", dueDate: d("2026-10-01"),
      dataQuality: 73, freshness: "Hebdomadaire", teamSize: 2,
      sources: ["SIRH", "Pointage", "Planification"],
      summary: "Consolidation des effectifs, absentéisme et heures terrain pour les 100 agences, exposé à la DRH.",
    },
    {
      id: "p6", name: "Cockpit Sécurité Sites Sensibles", domainKey: "security", sponsor: "Direction Sécurité",
      progress: 86, health: Health.ON_TRACK, stageKey: "prod", dueDate: d("2026-06-25"),
      dataQuality: 96, freshness: "Temps réel", teamSize: 3,
      sources: ["Mains courantes", "Contrôle d'accès", "Rondes"],
      summary: "Suivi temps réel des incidents et rondes sur les sites sensibles ; alerting et reporting client mensuel.",
    },
  ];

  for (const p of projects) {
    const { sources, ...rest } = p;
    await prisma.project.create({
      data: { ...rest, leadId: me.id, sources: { create: sources.map((name) => ({ name })) } },
    });
  }

  // Tasks
  const tasks: Array<{ id: string; projectId: string; title: string; status: TaskStatus; priority: Priority; dueDate: Date; assignee: string; type: TaskType }> = [
    { id: "t1", projectId: "p1", title: "Valider la maquette v3 du cockpit avec le sponsor", status: TaskStatus.REVIEW, priority: Priority.HAUTE, dueDate: d("2026-06-18"), assignee: "Vous", type: TaskType.DATAVIZ },
    { id: "t2", projectId: "p1", title: "Brancher l'indicateur de réclamations qualité", status: TaskStatus.DOING, priority: Priority.MOYENNE, dueDate: d("2026-06-20"), assignee: "Karim B.", type: TaskType.DATAVIZ },
    { id: "t3", projectId: "p2", title: "Corriger le mapping des capteurs CO₂ (38 sites)", status: TaskStatus.DOING, priority: Priority.HAUTE, dueDate: d("2026-06-19"), assignee: "Vous", type: TaskType.INGESTION },
    { id: "t4", projectId: "p2", title: "Recetter le flux d'ingestion 15 min", status: TaskStatus.TODO, priority: Priority.MOYENNE, dueDate: d("2026-06-24"), assignee: "Sofia L.", type: TaskType.INGESTION },
    { id: "t5", projectId: "p3", title: "Obtenir l'accès à l'historique de facturation énergie", status: TaskStatus.TODO, priority: Priority.HAUTE, dueDate: d("2026-06-18"), assignee: "Vous", type: TaskType.GOUVERNANCE },
    { id: "t6", projectId: "p3", title: "Premier entraînement du modèle baseline", status: TaskStatus.BACKLOG, priority: Priority.MOYENNE, dueDate: d("2026-07-02"), assignee: "Marc T.", type: TaskType.TRANSFO },
    { id: "t7", projectId: "p4", title: "Revue de recette avec la Direction Commerciale", status: TaskStatus.REVIEW, priority: Priority.HAUTE, dueDate: d("2026-06-19"), assignee: "Vous", type: TaskType.RECETTE },
    { id: "t8", projectId: "p4", title: "Réconcilier les écarts CRM / ERP sur 12 contrats", status: TaskStatus.DOING, priority: Priority.HAUTE, dueDate: d("2026-06-20"), assignee: "Léa M.", type: TaskType.TRANSFO },
    { id: "t9", projectId: "p5", title: "Atelier de cadrage des indicateurs RH", status: TaskStatus.TODO, priority: Priority.MOYENNE, dueDate: d("2026-06-23"), assignee: "Vous", type: TaskType.REUNION },
    { id: "t10", projectId: "p5", title: "Cartographier les sources SIRH disponibles", status: TaskStatus.BACKLOG, priority: Priority.BASSE, dueDate: d("2026-06-30"), assignee: "Sofia L.", type: TaskType.GOUVERNANCE },
    { id: "t11", projectId: "p6", title: "Mettre en prod l'alerting incidents", status: TaskStatus.DONE, priority: Priority.HAUTE, dueDate: d("2026-06-16"), assignee: "Vous", type: TaskType.DATAVIZ },
    { id: "t12", projectId: "p6", title: "Préparer le reporting client de juin", status: TaskStatus.TODO, priority: Priority.MOYENNE, dueDate: d("2026-06-25"), assignee: "Karim B.", type: TaskType.DATAVIZ },
    { id: "t13", projectId: "p1", title: "Documenter les règles de calcul de productivité", status: TaskStatus.BACKLOG, priority: Priority.BASSE, dueDate: d("2026-07-03"), assignee: "Vous", type: TaskType.GOUVERNANCE },
    { id: "t14", projectId: "p2", title: "Comité hebdo pipeline IoT", status: TaskStatus.TODO, priority: Priority.MOYENNE, dueDate: d("2026-06-18"), assignee: "Vous", type: TaskType.REUNION },
    { id: "t15", projectId: "p3", title: "Cadrer le périmètre RSE avec la direction", status: TaskStatus.DONE, priority: Priority.MOYENNE, dueDate: d("2026-06-12"), assignee: "Vous", type: TaskType.REUNION },
  ];
  for (const t of tasks) {
    const { assignee, ...rest } = t;
    await prisma.task.create({ data: { ...rest, assigneeId: byName[assignee] } });
  }

  // Milestones
  await prisma.milestone.createMany({
    data: [
      { id: "m1", projectId: "p4", title: "Go/No-Go recette référentiel contrats", date: d("2026-06-19"), status: MilestoneStatus.SOON },
      { id: "m2", projectId: "p6", title: "Mise en production cockpit sécurité", date: d("2026-06-25"), status: MilestoneStatus.UPCOMING },
      { id: "m3", projectId: "p4", title: "Bascule en production référentiel", date: d("2026-06-30"), status: MilestoneStatus.UPCOMING },
      { id: "m4", projectId: "p1", title: "Livraison cockpit propreté v1", date: d("2026-07-10"), status: MilestoneStatus.UPCOMING },
      { id: "m5", projectId: "p2", title: "Fin de l'ingestion des 38 sites pilotes", date: d("2026-08-05"), status: MilestoneStatus.UPCOMING },
      { id: "m6", projectId: "p3", title: "Modèle prédictif — preuve de valeur", date: d("2026-09-15"), status: MilestoneStatus.UPCOMING },
      { id: "m7", projectId: "p6", title: "Recette alerting incidents", date: d("2026-06-13"), status: MilestoneStatus.DONE },
      { id: "m8", projectId: "p5", title: "Validation du cadrage RH", date: d("2026-06-16"), status: MilestoneStatus.LATE },
    ],
  });

  // Blockers
  await prisma.blocker.createMany({
    data: [
      { id: "b1", projectId: "p3", title: "Accès à l'historique de facturation énergie non accordé", type: BlockerType.ACCES, severity: BlockerSeverity.CRITIQUE, owner: "DSI / Achats", sinceDate: d("2026-06-09") },
      { id: "b2", projectId: "p3", title: "Dépend de la stabilisation du Pipeline IoT (p2)", type: BlockerType.DEPENDANCE, severity: BlockerSeverity.ELEVE, owner: "Équipe Data", sinceDate: d("2026-06-11") },
      { id: "b3", projectId: "p2", title: "Qualité capteurs CO₂ insuffisante sur 6 sites", type: BlockerType.QUALITE, severity: BlockerSeverity.ELEVE, owner: "Énergie & Maintenance", sinceDate: d("2026-06-15") },
      { id: "b4", projectId: "p5", title: "Référent SIRH indisponible jusqu'au 23/06", type: BlockerType.EQUIPE, severity: BlockerSeverity.MOYEN, owner: "DRH", sinceDate: d("2026-06-16") },
    ],
  });

  // Agenda
  await prisma.agendaItem.createMany({
    data: [
      { id: "a1", userId: me.id, projectId: "p2", date: d("2026-06-18"), startTime: "09:30", durationMin: 30, title: "Comité hebdo pipeline IoT", kind: AgendaKind.REUNION },
      { id: "a2", userId: me.id, projectId: "p4", date: d("2026-06-18"), startTime: "11:00", durationMin: 60, title: "Revue de recette — référentiel contrats", kind: AgendaKind.REUNION },
      { id: "a3", userId: me.id, projectId: "p3", date: d("2026-06-18"), startTime: "14:00", durationMin: 30, title: "Point blocage accès facturation énergie", kind: AgendaKind.REUNION },
      { id: "a4", userId: me.id, projectId: "p1", date: d("2026-06-18"), startTime: "16:30", durationMin: 45, title: "Démo cockpit propreté v3 au sponsor", kind: AgendaKind.DEMO },
    ],
  });

  console.log("Seed done. Login: admin@atalian.local / admin");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
