import { Datagrid, List, TextField , ReferenceField, NumberField} from "react-admin";

export const LessontList = () => {
    return (
     <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="description" />
            <ReferenceField source="unitId" reference="units" />
            <NumberField source="order" />
        </Datagrid>
     </List>  
    );
};