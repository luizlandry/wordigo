import { SimpleForm, Create, required, ReferenceInput, NumberInput, TextInput, SelectInput } from "react-admin";

export const ChallengeCreate = () => {
    return (
     <Create>
        <SimpleForm>
            <TextInput source="question"
             validate={[required()]} 
             label="Question"
              />
              <SelectInput
                 source="type"
                 choices={[
                  { id: "SELECT", name: "SELECT" },
                  { id: "ASSIST", name: "ASSIST" },

                  // IELTS
                  { id: "IELTS_READING", name: "IELTS Reading" },
                  { id: "IELTS_TFNG", name: "True/False/Not Given" },
                  { id: "IELTS_WRITING", name: "Writing" },
                  { id: "IELTS_LISTENING", name: "Listening" },
                  ]}
                  validate={[required()]}
                  />
               <ReferenceInput
               source="lessonId"
               reference="lessons"
               />
               <NumberInput
               source="order"
               validate={[required()]}
               label="Order"
               />
        </SimpleForm>
     </Create>
    );
}; 