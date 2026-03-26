import { SimpleForm, Edit, required, ReferenceInput, NumberInput, TextInput } from "react-admin";

export const LessonEdit = () => {
    return (
     <Edit>
        <SimpleForm>
            <TextInput source="title"
             validate={[required()]} 
             label="Title"
              />
               <ReferenceInput
               source="unitId"
               reference="umits"
               />
               <NumberInput
               source="order"
               validate={[required()]}
               label="Order"
               />
        </SimpleForm>
     </Edit>
    );
}; 