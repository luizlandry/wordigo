import { SimpleForm, Create, TextField, required } from "react-admin";

export const CourseCreate = () => {
    return (
     <Create>
        <SimpleForm>
            <TextField source="title"
             validate={[required()]} 
             label="Title"
              />
            <TextField source="imageSrc"
             validate={[required()]}
              label="Image"
               />
        </SimpleForm>
     </Create>
    );
}; 