# IELTS XP Progress Bar Integration - TODO

## Plan Overview
Link IELTS lessons to shared XP system (userProgress.xp -> LevelBar).
1. Fix DB query error in db/queries.ts (invalid unit relation).
2. Add XP update (20 XP) after successful submit in 4 IELTS lesson files.
3. Test learn page loads.
4. Create IELTS course/unit/lessons via admin/seed.
5. Verify XP updates LevelBar.

## Steps (check off as completed)
- [x] Step 1: Edit db/queries.ts to fix getCourseProgress query.
- [x] Step 1: Edit db/queries.ts to fix getCourseProgress query.
- [x] Step 2: Update app/lesson/ielts/IeltsWriting.tsx with XP call.
- [x] Step 3: Update app/lesson/ielts/IeltsReading.tsx with XP call.
- [x] Step 4: Update app/lesson/ielts/IeltsListening.tsx with XP call.
- [x] Step 5: Update app/lesson/ielts/IeltsSpeaking.tsx with XP call.
- [ ] Step 6: Test: Select course, run IELTS lesson, check LevelBar progress.
- [ ] Step 7: Add IELTS course if missing (admin or seed.ts).

