import { Categoria } from "./categorias.model.js";
import { Nivel } from "./niveles.model.js";
import { Curso } from "./cursos.model.js";
import { Descuento } from "./descuentos.model.js";
import { Usuario } from "./usuarios.model.js";
import { Compra } from "./compras.model.js";


// ------- Relación Curso ↔ Nivel
Curso.belongsTo(Nivel, { foreignKey: 'id_level', as: 'level' });
Nivel.hasMany(Curso, { foreignKey: 'id_level', as: 'courses' });


// ------- Relación Curso ↔ Categoria
Curso.belongsTo(Categoria, { foreignKey: 'id_categ', as: 'category' });
Categoria.hasMany(Curso, { foreignKey: 'id_categ', as: 'courses' });


// ------- Relación Compra ↔ Curso
Compra.belongsTo(Curso, { foreignKey: 'id_course', as: 'course' });
Curso.hasMany(Compra, { foreignKey: 'id_course', as: 'purchases' });


// ------- Relación Compra ↔ Descuento
Compra.belongsTo(Descuento, { foreignKey: 'id_discount', as: 'discount' });
Descuento.hasMany(Compra, { foreignKey: 'id_discount', as: 'purchases' });


// ------- Relación Compra ↔ Usuario
Compra.belongsTo(Usuario, { foreignKey: 'id_user', as: 'user' });
Usuario.hasMany(Compra, { foreignKey: 'id_user', as: 'purchases' });


export { Categoria, Nivel, Curso, Descuento, Usuario, Compra };
