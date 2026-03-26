import { SimpleForm,  TextField, required, Edit } from "react-admin";

export const CourseEdit = () => {
    return (
     <Edit>
        <SimpleForm>
            <TextField source="id"
             validate={[required()]} 
             label="Id"
              />
            <TextField source="title"
             validate={[required()]} 
             label="Title"
              />
            <TextField source="imageSrc"
             validate={[required()]}
              label="Image"
               />
        </SimpleForm>
     </Edit>
    );
}; 