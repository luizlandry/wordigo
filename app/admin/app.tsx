"use client"

import { Admin, Resource, } from "react-admin"
import simpleRestProvider from "ra-data-simple-rest";

import { CourseList } from "./course/list";
import { UnitList } from "./unit/list";
import { LessontList } from "./lesson/list"

;

import { CourseCreate } from './course/create';
import { unitCreate } from "./unit/create";
import { LessonCreate } from "./lesson/create";


import { CourseEdit } from "./course/edit";
import { UnitEdit } from "./unit/edit";
import { LessonEdit } from "./lesson/edit";

import { ChallengeList } from "./challenges/list";
import { ChallengeCreate } from "./challenges/create";
import { ChallengeEdit } from "./challenges/edit";

import { ChallengeOptionList } from "./challengeOption/list";
import { ChallengeOptionCreate } from "./challengeOption/create";
import { ChallengeOptionEdit } from './challengeOption/edit';

const dataProvider = simpleRestProvider("/api");

const App = () => {
    return (
    <Admin dataProvider={dataProvider}>
        <Resource 
        name="courses"
        list={CourseList}
        create={CourseCreate}
        edit={CourseEdit}
        recordRepresentation="title"
        />
        <Resource 
        name="units"
        list={UnitList}
        create={unitCreate}
        edit={UnitEdit}
        recordRepresentation="title"
        />
         <Resource 
        name="units"
        list={LessontList}
        create={LessonCreate}
        edit={LessonEdit}
        recordRepresentation="title"
        />
         <Resource 
        name="challenges"
        list={ChallengeList}
        create={ChallengeCreate}
        edit={ChallengeEdit}
        recordRepresentation="question"
        />
        <Resource 
        name="challengOptions"
        list={ChallengeOptionList}
        create={ChallengeOptionCreate}
        edit={ChallengeOptionEdit}
        recordRepresentation="text"
        options={{ label: "Challenge OPtions" }}
        />
    </Admin>
       
    );
};

export default App;