import { SimpleForm, Edit, required, ReferenceInput, BooleanField, TextInput } from "react-admin";

export const ChallengeOptionEdit = () => {
    return (
     <Edit>
        <SimpleForm>
            <TextInput source="Text"
             validate={[required()]} 
             label="Text"
              />
              <BooleanField 
              source="correct"
              label="challenges"
              />
               <ReferenceInput
               source="challengeId"
               reference="challenges"
               />
               <TextInput
               source="imageSrc" 
               label="Image URL"
               />
              <TextInput
               source="audioSrc" 
               label="Audio URL"
               />
        </SimpleForm>
     </Edit>
    );
}; 