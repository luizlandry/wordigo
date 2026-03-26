import { SimpleForm, Create, required, ReferenceInput, NumberInput, TextInput } from "react-admin";

export const unitCreate = () => {
    return (
     <Create>
        <SimpleForm>
            <TextInput source="title"
             validate={[required()]} 
             label="Title"
              />
            <TextInput source="description"
             validate={[required()]}
              label="Description"
               />
               <ReferenceInput
               source="courseId"
               reference="courses"
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