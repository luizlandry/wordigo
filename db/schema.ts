import { relations } from "drizzle-orm";
import {boolean, integer,pgEnum,pgTable, serial, text, timestamp,} from "drizzle-orm/pg-core";


export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
});

// This is the primary coursesRelations definition
export const coursesRelations = relations(courses, ({ many })=> ({
  userProgress: many(userProgress),
  units: many(units), // Added units relation back in
}));

// Original coursesRelations was redefined later, so I removed the duplicate here.

export const units = pgTable( "units",{
  id: serial("id").primaryKey(),
  title: text("title").notNull(),//unit 1
  description: text("description").notNull(),// learnthe basics of spanish
  courseId: integer("course_id").references(() => courses.id, { onDelete:
    "cascade"}).notNull(),
    order: integer("order").notNull(),
});

// Renamed from lessonsRelations to unitsRelations to match the table name
 export const unitsRelations = relations(units, ({ many ,one }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons:many(lessons),
}));

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  mode: text("mode").default("normal"),
  title: text("title").notNull(), // lesson 1
  unitId:integer("unit_id").references(() => units.id, { onDelete: "cascade"}).notNull(),
  order: integer("order").notNull(),
  streak:integer("streak").default(0), // Added streak column
  lastActive: timestamp("last_active"),
  xp: integer("xp").default(0), // Added xp column
});

export const lessonRelations = relations(lessons,({many, one }) => ({
   unit: one (units, { // Changed 'units' (plural) to 'unit' (singular) for the relation name
    fields:[lessons.unitId],
    references:[units.id],
   }),
    challenges: many (challenges),
}));

export const challengesEnum=pgEnum("type",[
  "SELECT",
   "ASSIST",

    // IELTS TYPES
  "IELTS_READING",
  "IELTS_WRITING",
  "IELTS_LISTENING",
  "IELTS_SPEAKING",
  "IELTS_TFNG",
  ]);

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  passage: text("passage"),
audioSrc: text("audio_src"),
  lessonId: integer("lesson_id").references(() => lessons.id, { onDelete: "cascade"}).notNull(),
    type: challengesEnum("type").notNull(),
    question: text("question").notNull(),
    order: integer("order").notNull(),
    isExam: boolean("is_exam").default(false),
    difficulty: integer("difficulty").default(1), // Added difficulty column
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

export const challengeOptionsRelations = relations(challengeOptions, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeOptions.challengeId],
    references: [challenges.id],
  }),
}));

// Typo fix: Renamed "challengesProgress" to "challenge_progress"
export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),//TODO: confirm this doesn't break
  challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade"}).notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeProgress.challengeId],
    references: [challenges.id],
  }),
}));


// This definition was duplicated and caused an error. I am keeping the second, more complete one below,
// but ensured that userProgress is defined *before* it is used in this relation.


export const userProgress =pgTable("user_progress", { // Removed trailing comma in table name
   userId: text("user_id").primaryKey(),
   userName: text("user_name").notNull().default("User"),
   userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
   activeCourseId: integer("active_course_id").references(() => courses.id,
   { onDelete: "set null" }), // Changed cascade to "set null" as the ID might not exist when a course is deleted if you want to keep the user record. Cascade is fine too, depending on your logic.
   hearts:integer("hearts").notNull().default(5),
   points:integer("points").notNull().default(0),
   streak: integer("streak").default(0),
   lastActive: timestamp("last_active"),
   xp: integer("xp").default(0),
   weakAreas: text("weak_areas").array().default([]),
   weakGrammar: integer("weak_grammar").default(0),
   weakVocabulary: integer("weak_vocabulary").default(0),
   weakListening: integer("weak_listening").default(0),
   weakReading: integer("weak_reading").default(0),
});


export const userProgressRelations = relations(userProgress, ({ one })   =>
({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));


export const userSubscription = pgTable("user_subcription", {
  id:serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId:text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_Id").notNull(),
  stripeCurrentPerriodEnd: timestamp("stripe_current_period_end").notNull(),
});


