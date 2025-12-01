import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { User } from '../../types';
import { useUsers } from '../../context/UserContext'; // Importar useUsers

interface UserFormProps {
  onSaveUser: (user: User) => void;
  userToEdit?: User | null;
}

const UserForm: React.FC<UserFormProps> = ({ onSaveUser, userToEdit }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'vendedor' | 'cliente'>('cliente');
  const [message, setMessage] = useState('');

  const { users } = useUsers(); // Obtener usuarios del contexto

  const resetForm = () => {
    setNombre('');
    setEmail('');
    setPassword('');
    setRole('cliente');
    setMessage('');
  };

  useEffect(() => {
    if (userToEdit) {
      setNombre(userToEdit.nombre);
      setEmail(userToEdit.email);
      setPassword(userToEdit.password); // Considerar no pre-llenar contraseñas reales
      setRole(userToEdit.role);
    } else {
      resetForm(); // Call resetForm when userToEdit is null
    }
  }, [userToEdit]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre || !email || !password || !role) {
      setMessage('Todos los campos obligatorios deben completarse.');
      return;
    }

    // Validación de email duplicado
    if (!userToEdit || (userToEdit && userToEdit.email !== email)) {
      const isDuplicate = users.some(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );
      if (isDuplicate) {
        setMessage('Ya existe un usuario con este correo electrónico.');
        return;
      }
    }

    const userToSubmit: User = {
      id: userToEdit ? userToEdit.id : 0, // ID se generará en el contexto si es nuevo
      nombre,
      email,
      password,
      role,
    };

    onSaveUser(userToSubmit);
    if (!userToEdit) {
      setNombre('');
      setEmail('');
      setPassword('');
      setRole('cliente');
      setMessage(`Usuario "${nombre}" agregado correctamente.`);
    } else {
      setMessage(`Usuario "${nombre}" actualizado correctamente.`);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{userToEdit ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Nombre */}
        <div>
          <label htmlFor="userName" className="block mb-1 font-medium text-white">Nombre</label>
          <input type="text" id="userName" value={nombre} onChange={(e) => setNombre(e.target.value)} required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500 text-white" />
        </div>
        
        {/* Email */}
        <div>
          <label htmlFor="userEmail" className="block mb-1 font-medium text-white">Email</label>
          <input type="email" id="userEmail" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500 text-white" />
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="userPassword" className="block mb-1 font-medium text-white">Contraseña</label>
          <input type="password" id="userPassword" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500 text-white" />
        </div>

        {/* Rol */}
        <div>
          <label htmlFor="userRole" className="block mb-1 font-medium text-white">Rol</label>
          <select id="userRole" value={role} onChange={(e) => setRole(e.target.value as "admin" | "vendedor" | "cliente")} required
            className="w-full px-3 py-2 rounded-md border border-gray-600 bg-gray-900 focus:ring-indigo-500 focus:border-indigo-500 text-white">
            <option value="cliente">Cliente</option>
            <option value="vendedor">Vendedor</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {/* Botón de envío */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button type="submit"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">
            {userToEdit ? 'Guardar Cambios' : 'Crear Usuario'}
          </button>
          <button type="button" onClick={resetForm}
            className="flex-none bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md">
            Limpiar Formulario
          </button>
        </div>
        {message && <p className="mt-2 text-sm text-white">{message}</p>}
      </form>
    </div>
  );
};

export default UserForm;