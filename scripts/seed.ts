import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("🌱 Seeding database...");

    // ─── Delete everything ─────────────────────────────────────────────
    await db.delete(schema.challengeProgress);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.userProgress);
    await db.delete(schema.courses);
    await db.delete(schema.userSubscription);

    // ─── COURSES ───────────────────────────────────────────────────────
    await db.insert(schema.courses).values([
      { id: 1, title: "Spanish",         imageSrc: "/es.svg" },
      { id: 2, title: "Italian",         imageSrc: "/it.svg" },
      { id: 3, title: "French",          imageSrc: "/fr.svg" },
      { id: 4, title: "Croatian",        imageSrc: "/hr.svg" },
      { id: 5, title: "English ", imageSrc: "/en.svg" },
    ]);

    // ─── SPANISH UNITS ─────────────────────────────────────────────────
    await db.insert(schema.units).values([
      { id: 1, courseId: 1, title: "Unit 1", description: "Learn the basics of Spanish", order: 1 },
      { id: 2, courseId: 1, title: "Unit 2", description: "Intermediate Spanish", order: 2 },
    ]);

    // ─── SPANISH LESSONS ───────────────────────────────────────────────
    await db.insert(schema.lessons).values([
      { id: 1, unitId: 1, title: "Nouns",      order: 1 },
      { id: 2, unitId: 1, title: "Verbs",       order: 2 },
      { id: 3, unitId: 1, title: "Adjectives",  order: 3 },
      { id: 4, unitId: 1, title: "Phrases",     order: 4 },
      { id: 5, unitId: 1, title: "Sentences",   order: 5 },
    ]);

    // ─── SPANISH CHALLENGES (Lesson 1) ─────────────────────────────────
    await db.insert(schema.challenges).values([
      { id: 1, lessonId: 1, type: "SELECT", order: 1, question: 'Which one of these is "the man"?' },
      { id: 2, lessonId: 1, type: "ASSIST", order: 2, question: '"the man"' },
      { id: 3, lessonId: 1, type: "SELECT", order: 3, question: 'Which one of these is "the robot"?' },
    ]);

    await db.insert(schema.challengeOptions).values([
      { challengeId: 1, correct: true,  text: "el hombre", imageSrc: "/man.png",   audioSrc: "/es_man.mp3" },
      { challengeId: 1, correct: false, text: "la mujer",  imageSrc: "/woman.png", audioSrc: "/es_woman.mp3" },
      { challengeId: 1, correct: false, text: "el chico",  imageSrc: "/boy.svg",   audioSrc: "/es_boy.mp3" },
      { challengeId: 2, correct: true,  text: "el hombre", audioSrc: "/es_man.mp3" },
      { challengeId: 2, correct: false, text: "la mujer",  audioSrc: "/es_woman.mp3" },
      { challengeId: 2, correct: false, text: "el robot",  audioSrc: "/es_robot.mp3" },
      { challengeId: 3, correct: false, text: "el hombre", imageSrc: "/man.png",   audioSrc: "/es_man.mp3" },
      { challengeId: 3, correct: false, text: "la mujer",  imageSrc: "/woman.png", audioSrc: "/es_woman.mp3" },
      { challengeId: 3, correct: true,  text: "el robot",  imageSrc: "/robot.jpg", audioSrc: "/es_robot.mp3" },
    ]);

    // ═══════════════════════════════════════════════════════════════════
    // ENGLISH (IELTS) COURSE — Course ID 5
    // Units 1–2: FREE | Units 3–8: PRO
    // ═══════════════════════════════════════════════════════════════════

    await db.insert(schema.units).values([
      // FREE UNITS
      { id: 10, courseId: 5, title: "IELTS Fundamentals",   description: "Understand the IELTS test format and band scoring system — FREE",          order: 1 },
      { id: 11, courseId: 5, title: "Reading Foundation",   description: "Master skimming, scanning and True/False/Not Given — FREE",                  order: 2 },
      // PRO UNITS
      { id: 12, courseId: 5, title: "Listening Skills",     description: "Section 1–4 listening strategies and note-taking — PRO",                    order: 3 },
      { id: 13, courseId: 5, title: "Writing Essentials",   description: "Task 1 (graphs/letters) and Task 2 (essays) structure — PRO",               order: 4 },
      { id: 14, courseId: 5, title: "Speaking Practice",    description: "Parts 1, 2 and 3 fluency and pronunciation — PRO",                          order: 5 },
      { id: 15, courseId: 5, title: "Advanced Reading",     description: "Academic texts, matching headings, summary completion — PRO",                order: 6 },
      { id: 16, courseId: 5, title: "Advanced Writing",     description: "Band 7–9 vocabulary, complex arguments, coherence — PRO",                   order: 7 },
      { id: 17, courseId: 5, title: "Full Mock Exam",       description: "Complete timed IELTS exam under real exam conditions — PRO",                 order: 8 },
    ]);

    // ─── UNIT 10 LESSONS: IELTS Fundamentals (FREE) ────────────────────
    await db.insert(schema.lessons).values([
      { id: 100, unitId: 10, title: "What is IELTS?",         order: 1, mode: "normal" },
      { id: 101, unitId: 10, title: "Test Format Overview",   order: 2, mode: "normal" },
      { id: 102, unitId: 10, title: "Band Score System",      order: 3, mode: "normal" },
      { id: 103, unitId: 10, title: "Academic vs General",    order: 4, mode: "normal" },
      { id: 104, unitId: 10, title: "Time Management",        order: 5, mode: "normal" },
    ]);

    // ─── UNIT 10 CHALLENGES ────────────────────────────────────────────
    await db.insert(schema.challenges).values([
      // Lesson 100 – What is IELTS?
      { id: 200, lessonId: 100, type: "SELECT", order: 1, question: "What does IELTS stand for?" },
      { id: 201, lessonId: 100, type: "SELECT", order: 2, question: "Who administers the IELTS exam?" },
      { id: 202, lessonId: 100, type: "SELECT", order: 3, question: "How many sections does the IELTS exam have?" },
      // Lesson 101 – Test Format
      { id: 203, lessonId: 101, type: "SELECT", order: 1, question: "How long is the IELTS Listening section?" },
      { id: 204, lessonId: 101, type: "SELECT", order: 2, question: "How many questions are in the IELTS Reading section?" },
      { id: 205, lessonId: 101, type: "SELECT", order: 3, question: "How long do you have for the IELTS Writing section?" },
      // Lesson 102 – Band Scores
      { id: 206, lessonId: 102, type: "SELECT", order: 1, question: "What is the highest possible IELTS band score?" },
      { id: 207, lessonId: 102, type: "SELECT", order: 2, question: "Which band score is considered 'Good User' by IELTS?" },
      { id: 208, lessonId: 102, type: "SELECT", order: 3, question: "Most universities require a minimum IELTS band of:" },
      // Lesson 103 – Academic vs General
      { id: 209, lessonId: 103, type: "SELECT", order: 1, question: "Which IELTS module is needed for university admission?" },
      { id: 210, lessonId: 103, type: "SELECT", order: 2, question: "Which IELTS module is used for immigration/work visas?" },
      { id: 211, lessonId: 103, type: "SELECT", order: 3, question: "Both IELTS modules share the same:" },
      // Lesson 104 – Time Management
      { id: 212, lessonId: 104, type: "SELECT", order: 1, question: "In IELTS Reading, how long per passage is recommended?" },
      { id: 213, lessonId: 104, type: "SELECT", order: 2, question: "For IELTS Writing Task 2, the recommended time is:" },
      { id: 214, lessonId: 104, type: "SELECT", order: 3, question: "In IELTS Speaking Part 2, you have __ minute(s) to prepare." },
    ]);

    await db.insert(schema.challengeOptions).values([
      // 200 – IELTS stands for
      { challengeId: 200, correct: true,  text: "International English Language Testing System" },
      { challengeId: 200, correct: false, text: "International English Literacy Testing Standards" },
      { challengeId: 200, correct: false, text: "Integrated English Language Teaching System" },
      // 201 – Who administers
      { challengeId: 201, correct: true,  text: "British Council, IDP, and Cambridge Assessment English" },
      { challengeId: 201, correct: false, text: "Oxford University Press and TOEFL Board" },
      { challengeId: 201, correct: false, text: "United Nations Education Division" },
      // 202 – How many sections
      { challengeId: 202, correct: false, text: "3 sections" },
      { challengeId: 202, correct: true,  text: "4 sections (Listening, Reading, Writing, Speaking)" },
      { challengeId: 202, correct: false, text: "5 sections" },
      // 203 – Listening duration
      { challengeId: 203, correct: false, text: "20 minutes" },
      { challengeId: 203, correct: true,  text: "30 minutes" },
      { challengeId: 203, correct: false, text: "45 minutes" },
      // 204 – Reading questions
      { challengeId: 204, correct: false, text: "30 questions" },
      { challengeId: 204, correct: true,  text: "40 questions" },
      { challengeId: 204, correct: false, text: "50 questions" },
      // 205 – Writing duration
      { challengeId: 205, correct: false, text: "45 minutes" },
      { challengeId: 205, correct: true,  text: "60 minutes" },
      { challengeId: 205, correct: false, text: "90 minutes" },
      // 206 – Highest band
      { challengeId: 206, correct: false, text: "8" },
      { challengeId: 206, correct: true,  text: "9" },
      { challengeId: 206, correct: false, text: "10" },
      // 207 – 'Good User' band
      { challengeId: 207, correct: false, text: "Band 6" },
      { challengeId: 207, correct: true,  text: "Band 7" },
      { challengeId: 207, correct: false, text: "Band 8" },
      // 208 – University minimum
      { challengeId: 208, correct: false, text: "5.0" },
      { challengeId: 208, correct: true,  text: "6.0 – 6.5" },
      { challengeId: 208, correct: false, text: "8.0" },
      // 209 – Academic module
      { challengeId: 209, correct: true,  text: "IELTS Academic" },
      { challengeId: 209, correct: false, text: "IELTS General Training" },
      { challengeId: 209, correct: false, text: "Both are equally accepted" },
      // 210 – Immigration module
      { challengeId: 210, correct: false, text: "IELTS Academic" },
      { challengeId: 210, correct: true,  text: "IELTS General Training" },
      { challengeId: 210, correct: false, text: "IELTS Professional" },
      // 211 – Shared sections
      { challengeId: 211, correct: false, text: "Reading and Writing sections" },
      { challengeId: 211, correct: true,  text: "Listening and Speaking sections" },
      { challengeId: 211, correct: false, text: "Only the Speaking section" },
      // 212 – Time per passage
      { challengeId: 212, correct: false, text: "10 minutes" },
      { challengeId: 212, correct: true,  text: "20 minutes" },
      { challengeId: 212, correct: false, text: "30 minutes" },
      // 213 – Writing Task 2 time
      { challengeId: 213, correct: false, text: "20 minutes" },
      { challengeId: 213, correct: true,  text: "40 minutes" },
      { challengeId: 213, correct: false, text: "60 minutes" },
      // 214 – Speaking Part 2 prep
      { challengeId: 214, correct: false, text: "2 minutes" },
      { challengeId: 214, correct: true,  text: "1 minute" },
      { challengeId: 214, correct: false, text: "30 seconds" },
    ]);

    // ─── UNIT 11 LESSONS: Reading Foundation (FREE) ────────────────────
    await db.insert(schema.lessons).values([
      { id: 105, unitId: 11, title: "Skimming & Scanning",     order: 1, mode: "ielts" },
      { id: 106, unitId: 11, title: "True / False / Not Given", order: 2, mode: "ielts" },
      { id: 107, unitId: 11, title: "Multiple Choice Reading",  order: 3, mode: "ielts" },
      { id: 108, unitId: 11, title: "Matching Headings Intro",  order: 4, mode: "ielts" },
      { id: 109, unitId: 11, title: "Reading Test Mini",        order: 5, mode: "ielts" },
    ]);

    // ─── UNIT 11 CHALLENGES ────────────────────────────────────────────
    const passage1 = `The development of the internet has fundamentally changed the way people communicate and access information. Since its early days as a military research network in the 1960s, the internet has evolved into a global infrastructure connecting billions of users. Researchers, students and professionals now rely on it daily for tasks that previously required visiting libraries or offices. Despite widespread benefits, concerns about digital privacy and the spread of misinformation have grown significantly alongside its expansion.`;

    const passage2 = `Climate change represents one of the most pressing challenges of the twenty-first century. Rising global temperatures, driven primarily by the burning of fossil fuels, are causing sea levels to rise and extreme weather events to become more frequent. Many scientists agree that immediate and coordinated international action is essential. However, economic interests and political disagreements have slowed meaningful progress on reducing carbon emissions worldwide.`;

    const passage3 = `Urban farming, the practice of cultivating food within cities, has gained considerable attention in recent decades. Proponents argue that it reduces food transportation costs, promotes community engagement, and improves urban air quality. Critics, however, note that land constraints and high startup costs make large-scale urban food production impractical for most cities. Several pilot projects in Singapore and New York have shown promising results on a small scale.`;

    await db.insert(schema.challenges).values([
      // Lesson 105 – Skimming & Scanning
      {
        id: 215, lessonId: 105, type: "IELTS_READING", order: 1,
        question: "According to the passage, the internet began as what type of network?",
        passage: passage1,
      },
      {
        id: 216, lessonId: 105, type: "IELTS_TFNG", order: 2,
        question: "The internet was originally developed for commercial purposes.",
        passage: passage1,
      },
      {
        id: 217, lessonId: 105, type: "IELTS_TFNG", order: 3,
        question: "Digital privacy is a concern associated with internet expansion.",
        passage: passage1,
      },
      // Lesson 106 – T/F/NG
      {
        id: 218, lessonId: 106, type: "IELTS_READING", order: 1,
        question: "What does the author identify as a primary driver of climate change?",
        passage: passage2,
      },
      {
        id: 219, lessonId: 106, type: "IELTS_TFNG", order: 2,
        question: "All scientists worldwide fully agree on the urgency of climate action.",
        passage: passage2,
      },
      {
        id: 220, lessonId: 106, type: "IELTS_TFNG", order: 3,
        question: "Political disagreements have contributed to slow progress on emissions.",
        passage: passage2,
      },
      // Lesson 107 – Multiple Choice
      {
        id: 221, lessonId: 107, type: "IELTS_READING", order: 1,
        question: "What do critics of urban farming point to as a major challenge?",
        passage: passage3,
      },
      {
        id: 222, lessonId: 107, type: "IELTS_TFNG", order: 2,
        question: "Urban farming has been successfully implemented at large scale in most cities.",
        passage: passage3,
      },
      {
        id: 223, lessonId: 107, type: "IELTS_TFNG", order: 3,
        question: "Singapore and New York have conducted small-scale urban farming projects.",
        passage: passage3,
      },
      // Lesson 108 – Matching Headings Intro
      {
        id: 224, lessonId: 108, type: "IELTS_READING", order: 1,
        question: "Which heading best describes the first paragraph about internet history?",
        passage: passage1,
      },
      {
        id: 225, lessonId: 108, type: "IELTS_TFNG", order: 2,
        question: "The internet has always been freely accessible to all citizens.",
        passage: passage1,
      },
      // Lesson 109 – Mini Reading Test (AI-enhanced)
      {
        id: 226, lessonId: 109, type: "IELTS_READING", order: 1,
        question: "What is the main idea of the passage about climate change?",
        passage: passage2,
      },
      {
        id: 227, lessonId: 109, type: "IELTS_TFNG", order: 2,
        question: "Economic factors have had no effect on climate change policy.",
        passage: passage2,
      },
      {
        id: 228, lessonId: 109, type: "IELTS_TFNG", order: 3,
        question: "Sea levels are rising as a result of increased global temperatures.",
        passage: passage2,
      },
    ]);

    // Challenge options for T/F/NG
    const tfngIds = [216,217,219,220,222,223,225,227,228];
    const tfngOptions: { challengeId: number; text: string; correct: boolean }[] = [];
    // 216: FALSE (military not commercial)
    tfngOptions.push(
      { challengeId: 216, text: "TRUE",      correct: false },
      { challengeId: 216, text: "FALSE",     correct: true  },
      { challengeId: 216, text: "NOT GIVEN", correct: false },
      // 217: TRUE (privacy is mentioned)
      { challengeId: 217, text: "TRUE",      correct: true  },
      { challengeId: 217, text: "FALSE",     correct: false },
      { challengeId: 217, text: "NOT GIVEN", correct: false },
      // 219: NOT GIVEN (passage says "many scientists" not all)
      { challengeId: 219, text: "TRUE",      correct: false },
      { challengeId: 219, text: "FALSE",     correct: false },
      { challengeId: 219, text: "NOT GIVEN", correct: true  },
      // 220: TRUE
      { challengeId: 220, text: "TRUE",      correct: true  },
      { challengeId: 220, text: "FALSE",     correct: false },
      { challengeId: 220, text: "NOT GIVEN", correct: false },
      // 222: FALSE (not large-scale)
      { challengeId: 222, text: "TRUE",      correct: false },
      { challengeId: 222, text: "FALSE",     correct: true  },
      { challengeId: 222, text: "NOT GIVEN", correct: false },
      // 223: TRUE
      { challengeId: 223, text: "TRUE",      correct: true  },
      { challengeId: 223, text: "FALSE",     correct: false },
      { challengeId: 223, text: "NOT GIVEN", correct: false },
      // 225: NOT GIVEN
      { challengeId: 225, text: "TRUE",      correct: false },
      { challengeId: 225, text: "FALSE",     correct: false },
      { challengeId: 225, text: "NOT GIVEN", correct: true  },
      // 227: FALSE
      { challengeId: 227, text: "TRUE",      correct: false },
      { challengeId: 227, text: "FALSE",     correct: true  },
      { challengeId: 227, text: "NOT GIVEN", correct: false },
      // 228: TRUE
      { challengeId: 228, text: "TRUE",      correct: true  },
      { challengeId: 228, text: "FALSE",     correct: false },
      { challengeId: 228, text: "NOT GIVEN", correct: false },
    );

    // Reading multiple choice options
    await db.insert(schema.challengeOptions).values([
      // 215 – internet began as
      { challengeId: 215, correct: false, text: "A commercial telecommunications network" },
      { challengeId: 215, correct: true,  text: "A military research network" },
      { challengeId: 215, correct: false, text: "A university student communication tool" },
      // 218 – primary driver of climate change
      { challengeId: 218, correct: true,  text: "The burning of fossil fuels" },
      { challengeId: 218, correct: false, text: "Deforestation in tropical rainforests" },
      { challengeId: 218, correct: false, text: "Industrial agricultural practices" },
      // 221 – critics of urban farming
      { challengeId: 221, correct: false, text: "Community engagement is reduced" },
      { challengeId: 221, correct: true,  text: "Land constraints and high startup costs" },
      { challengeId: 221, correct: false, text: "Air quality in cities deteriorates" },
      // 224 – best heading
      { challengeId: 224, correct: false, text: "The Future of Global Communication" },
      { challengeId: 224, correct: true,  text: "From Military Network to Global Infrastructure" },
      { challengeId: 224, correct: false, text: "Privacy Problems in the Digital Age" },
      // 226 – main idea of climate passage
      { challengeId: 226, correct: false, text: "The economic benefits of renewable energy" },
      { challengeId: 226, correct: true,  text: "Climate change is urgent but progress is hindered by economic and political factors" },
      { challengeId: 226, correct: false, text: "Scientists cannot agree on climate change causes" },
    ]);

    await db.insert(schema.challengeOptions).values(tfngOptions);

    // ─── PRO UNITS 12–17: Lessons & Representative Challenges ──────────
    // These units are PRO-gated. We seed one representative lesson per unit.
    // The AI generation API fills in the rest dynamically.

    await db.insert(schema.lessons).values([
      // Unit 12 – Listening Skills (PRO)
      { id: 110, unitId: 12, title: "Section 1: Everyday Conversations", order: 1, mode: "ielts" },
      { id: 111, unitId: 12, title: "Section 2: Monologues",              order: 2, mode: "ielts" },
      { id: 112, unitId: 12, title: "Section 3: Academic Discussions",    order: 3, mode: "ielts" },
      { id: 113, unitId: 12, title: "Section 4: Academic Lectures",       order: 4, mode: "ielts" },
      { id: 114, unitId: 12, title: "Listening Practice Test",            order: 5, mode: "ielts" },
      // Unit 13 – Writing Essentials (PRO)
      { id: 115, unitId: 13, title: "Task 1: Describing Graphs",          order: 1, mode: "ielts" },
      { id: 116, unitId: 13, title: "Task 1: Process Diagrams",           order: 2, mode: "ielts" },
      { id: 117, unitId: 13, title: "Task 2: Opinion Essays",             order: 3, mode: "ielts" },
      { id: 118, unitId: 13, title: "Task 2: Discussion Essays",          order: 4, mode: "ielts" },
      { id: 119, unitId: 13, title: "Writing Practice Test",              order: 5, mode: "ielts" },
      // Unit 14 – Speaking Practice (PRO)
      { id: 120, unitId: 14, title: "Part 1: Personal Questions",         order: 1, mode: "ielts" },
      { id: 121, unitId: 14, title: "Part 1: Hobbies & Routines",         order: 2, mode: "ielts" },
      { id: 122, unitId: 14, title: "Part 2: Long Turn (Cue Card)",       order: 3, mode: "ielts" },
      { id: 123, unitId: 14, title: "Part 3: Abstract Discussion",        order: 4, mode: "ielts" },
      { id: 124, unitId: 14, title: "Speaking Practice Test",             order: 5, mode: "ielts" },
      // Unit 15 – Advanced Reading (PRO)
      { id: 125, unitId: 15, title: "Matching Headings",                  order: 1, mode: "ielts" },
      { id: 126, unitId: 15, title: "Summary Completion",                 order: 2, mode: "ielts" },
      { id: 127, unitId: 15, title: "Yes / No / Not Given",               order: 3, mode: "ielts" },
      { id: 128, unitId: 15, title: "Sentence Completion",                order: 4, mode: "ielts" },
      { id: 129, unitId: 15, title: "Advanced Reading Test",              order: 5, mode: "ielts" },
      // Unit 16 – Advanced Writing (PRO)
      { id: 130, unitId: 16, title: "Band 7+ Vocabulary Techniques",      order: 1, mode: "ielts" },
      { id: 131, unitId: 16, title: "Cohesion & Coherence Devices",       order: 2, mode: "ielts" },
      { id: 132, unitId: 16, title: "Task Achievement Strategies",        order: 3, mode: "ielts" },
      { id: 133, unitId: 16, title: "Grammatical Range & Accuracy",       order: 4, mode: "ielts" },
      { id: 134, unitId: 16, title: "Advanced Writing Practice",          order: 5, mode: "ielts" },
      // Unit 17 – Full Mock Exam (PRO)
      { id: 135, unitId: 17, title: "Mock: Reading (60 min)",             order: 1, mode: "ielts" },
      { id: 136, unitId: 17, title: "Mock: Listening (30 min)",           order: 2, mode: "ielts" },
      { id: 137, unitId: 17, title: "Mock: Writing Task 1 (20 min)",      order: 3, mode: "ielts" },
      { id: 138, unitId: 17, title: "Mock: Writing Task 2 (40 min)",      order: 4, mode: "ielts" },
      { id: 139, unitId: 17, title: "Mock: Speaking (14 min)",            order: 5, mode: "ielts" },
    ]);

    // Unit 13 – Writing challenges (representative)
    await db.insert(schema.challenges).values([
      {
        id: 300, lessonId: 115, type: "IELTS_WRITING", order: 1,
        question: "Task 1 – The graph below shows the percentage of households with internet access in four countries between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      },
      {
        id: 301, lessonId: 117, type: "IELTS_WRITING", order: 1,
        question: "Task 2 – Some people believe that technology has made our lives too complicated. To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      },
      {
        id: 302, lessonId: 118, type: "IELTS_WRITING", order: 1,
        question: "Task 2 – Some people think that parents should limit the time their children spend watching television or using digital devices. Others think children should be allowed to use these devices freely. Discuss both views and give your own opinion. Write at least 250 words.",
      },
    ]);

    // Unit 14 – Speaking challenges (representative)
    await db.insert(schema.challenges).values([
      {
        id: 310, lessonId: 120, type: "IELTS_SPEAKING", order: 1,
        question: "Part 1 – Tell me about your hometown. What do you like most about where you live? Has it changed much since you were a child?",
      },
      {
        id: 311, lessonId: 122, type: "IELTS_SPEAKING", order: 1,
        question: "Part 2 – Describe a book or film that had a significant impact on you. You should say: what the book/film was about, when you read/saw it, and explain why it was significant to you. You have 1 minute to prepare. Then speak for 1–2 minutes.",
      },
      {
        id: 312, lessonId: 123, type: "IELTS_SPEAKING", order: 1,
        question: "Part 3 – Do you think social media has had a positive or negative effect on communication in society? How has the way people communicate changed over the past decade? What role do you think technology will play in communication in the future?",
      },
    ]);

    // Unit 15 – Advanced reading with complex passage
    const advancedPassage = `Neuroscientists have long debated the extent to which human behaviour is shaped by genetics versus environment — the so-called 'nature versus nurture' debate. Recent advances in epigenetics have complicated this binary, revealing that environmental factors can actually alter gene expression without changing the underlying DNA sequence. This means that experiences such as trauma, nutrition, and stress can leave measurable biological marks that may even be transmitted to subsequent generations. Such findings challenge the traditional view of genes as immutable determinants of character and intelligence.

Critics of epigenetic transmission argue that most such effects are erased in each generation, and that extraordinary claims require extraordinary evidence. Supporters counter that the emerging body of research — particularly studies involving famine survivors and their descendants — provides compelling support for transgenerational epigenetic inheritance in humans.`;

    await db.insert(schema.challenges).values([
      {
        id: 320, lessonId: 125, type: "IELTS_READING", order: 1,
        question: "Which heading best describes the second paragraph of the passage?",
        passage: advancedPassage,
      },
      {
        id: 321, lessonId: 127, type: "IELTS_TFNG", order: 1,
        question: "Epigenetic changes alter the DNA sequence itself.",
        passage: advancedPassage,
      },
      {
        id: 322, lessonId: 127, type: "IELTS_TFNG", order: 2,
        question: "Research on famine survivors supports transgenerational epigenetic inheritance.",
        passage: advancedPassage,
      },
    ]);

    await db.insert(schema.challengeOptions).values([
      // 320 – heading
      { challengeId: 320, correct: false, text: "Early History of Genetic Research" },
      { challengeId: 320, correct: true,  text: "The Scientific Debate Over Epigenetic Transmission" },
      { challengeId: 320, correct: false, text: "How Trauma Affects Brain Development" },
      // 321 – FALSE (epigenetics doesn't change DNA sequence)
      { challengeId: 321, text: "TRUE",      correct: false },
      { challengeId: 321, text: "FALSE",     correct: true  },
      { challengeId: 321, text: "NOT GIVEN", correct: false },
      // 322 – TRUE
      { challengeId: 322, text: "TRUE",      correct: true  },
      { challengeId: 322, text: "FALSE",     correct: false },
      { challengeId: 322, text: "NOT GIVEN", correct: false },
    ]);

    // Unit 17 – Mock exam writing tasks
    await db.insert(schema.challenges).values([
      {
        id: 330, lessonId: 137, type: "IELTS_WRITING", order: 1,
        question: "MOCK EXAM — Task 1 (20 minutes): The diagrams below show the layout of a sports centre now and after planned renovation. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      },
      {
        id: 331, lessonId: 138, type: "IELTS_WRITING", order: 1,
        question: "MOCK EXAM — Task 2 (40 minutes): In many countries, more and more young people are choosing to travel or work abroad after finishing school rather than going directly to university or starting a job. Do the advantages of this trend outweigh the disadvantages? Give reasons for your answer and include any relevant examples. Write at least 250 words.",
      },
      {
        id: 332, lessonId: 139, type: "IELTS_SPEAKING", order: 1,
        question: "MOCK EXAM — Full Speaking Test (14 minutes): Part 1: Answer questions about yourself, your work/studies, and everyday topics. Part 2: Speak for 1–2 minutes about the topic on your cue card. Part 3: Discuss abstract issues related to the Part 2 topic.\n\nCue Card: Describe a skill you have learned that you consider important in your daily life. Say what the skill is, how and when you learned it, and explain why you think this skill is important.",
      },
    ]);

    console.log("✅ Database seeded successfully!");
    console.log("   → Spanish course: 2 units, 5 lessons, 9 challenges");
    console.log("   → English (IELTS) course: 8 units, 40 lessons");
    console.log("   → Units 1-2 FREE | Units 3-8 PRO");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw new Error("Failed to seed database");
  }
};

main();