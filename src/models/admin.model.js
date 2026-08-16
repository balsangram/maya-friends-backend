import Auth from "./auth.model.js";

const adminSchema = new Auth.base.Schema({
 
});

const Admin = Auth.discriminator("Admin", adminSchema);

export default Admin;