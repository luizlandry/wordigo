import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!); 

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    // Delete all tables
    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.userSubscription);

    // Insert courses
    await db.insert(schema.courses).values([
      {
        id: 1,
        title: "Spanish",
        imageSrc: "/es.svg",
      },
      {
        id: 2,
        title: "Italian",
        imageSrc: "/it.svg",
      },
      {
        id: 3,
        title: "French",
        imageSrc: "/fr.svg",
      },
      {
        id: 4,
        title: "Croatian",
        imageSrc: "/hr.svg",
      },
      {
        id: 5,
        title: "IELTS",
        imageSrc: "/en.svg",
      },
    ]);

    // Insert units
    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1, // Spanish
        title: "Unit 1",
        description: "Learn the basics of Spanish",
        order: 1,
      },
      {
        id: 2,
        courseId: 5, // IELTS
        title: "IELTS Reading",
        description: "Learn the basics of IELTS reading",
        order: 1,
      },
    ]);

    // Insert lessons for Spanish
    await db.insert(schema.lessons).values([
      {
        id: 1,
        unitId: 1, // Unit 1 (Spanish)
        order: 1,
        title: "Nouns",
      },
      {
        id: 2,
        unitId: 1, 
        order: 2,
        title: "Verbs",
      },
      {
        id: 3,
        unitId: 1, 
        order: 3,
        title: "Verbs",
      },
      {
        id: 4,
        unitId: 1, 
        order: 4,
        title: "Verbs",
      },
      {
        id: 5,
        unitId: 1, 
        order: 5,
        title: "Verbs",
      },
    ]);

    // Insert lessons for IELTS
    await db.insert(schema.lessons).values([
      {
        id: 6,
        title: "IELTS Reading Basics",
        unitId: 2, // IELTS unit
        mode: "ielts",
        order: 1,
      },
      {
        id: 7,
        title: "IELTS Reading Practice",
        unitId: 2,
        mode: "ielts",
        order: 2,
      },
    ]);

    // Insert challenges for Spanish lessons
    await db.insert(schema.challenges).values([
      {
        id: 1,
        lessonId: 1, // Nouns
        type: "SELECT",
        order: 1,
        question: 'Which one of these is "the man"?',
      },
      {
        id: 2,
        lessonId: 1, 
        type: "ASSIST",
        order: 2,
        question: '"the man"',
      },
      {
        id: 3,
        lessonId: 1, 
        type: "SELECT",
        order: 3,
        question: 'Which one of these is "the robot"?',
      },
      {
        id: 4,
        lessonId: 2, // Verbs
        type: "SELECT",
        order: 1,
        question: 'Which one of these is "the man"?',
      },
      {
        id: 5,
        lessonId: 2, // Verbs
        type: "ASSIST",
        order: 2,
        question: '"the man"',
      },
      {
        id: 6,
        lessonId: 2, // Verbs
        type: "SELECT",
        order: 3,
        question: 'Which one of these is "the robot"?',
      },
        {
    id: 100,
    lessonId: 6, // IELTS lesson
    type: "IELTS_READING",
    order: 1,
    question: "What is the main idea of the passage?",
    passage:
      "Language learning apps have transformed education by making learning accessible anywhere. Many learners now rely on mobile applications instead of traditional classrooms.",
  },
  {
    id: 101,
    lessonId: 6,
    type: "IELTS_TFNG",
    order: 2,
    question: "Mobile apps replaced all traditional classrooms.",
  },
    ]);

    // Insert challenge options for Spanish
    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 1,
        imageSrc: "/man.png",
        correct: true,
        text: "el hombre",
        audioSrc: "/es_man.mp3",
      },
      {
        challengeId: 1,
        imageSrc: "/woman.png",
        correct: false,
        text: "la mujer",
        audioSrc: "/es_woman.mp3",
      },
      {
        challengeId: 1,
        imageSrc: "/robot.jpg",
        correct: false,
        text: "el robot",
        audioSrc: "/es_robot.mp3",
      },
      {
        challengeId: 2,
        correct: true,
        text: "el hombre",
        audioSrc: "/es_man.mp3",
      },
      {
        challengeId: 2,
        correct: false,
        text: "la mujer",
        audioSrc: "/es_woman.mp3",
      },
      {
        challengeId: 2,
        correct: false,
        text: "el robot",
        audioSrc: "/es_robot.mp3",
      },
      {
        challengeId: 3,
        imageSrc: "/man.png",
        correct: false,
        text: "el hombre",
        audioSrc: "/es_man.mp3",
      },
      {
        challengeId: 3,
        imageSrc: "/woman.png",
        correct: false,
        text: "la mujer",
        audioSrc: "/es_woman.mp3",
      },
      {
        challengeId: 3,
        imageSrc: "/robot.jpg",
        correct: true,
        text: "el robot",
        audioSrc: "/es_robot.mp3",
      },
       {
    challengeId: 101,
    text: "TRUE",
    correct: false,
  },
  {
    challengeId: 101,
    text: "FALSE",
    correct: true,
  },
  {
    challengeId: 101,
    text: "NOT GIVEN",
    correct: false,
  },
    ]);

    console.log("Seeding finished");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database");
  }
};

main();