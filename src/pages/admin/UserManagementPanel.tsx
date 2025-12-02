import React, { useState, useRef } from 'react';
import { useUsers } from '../../context/UserContext';
import { User } from '../../types';
import UserForm from './UserForm';

const UserManagementPanel: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleSaveUser = async (user: User) => {
    // Nota: Es buena práctica hacerlo async/await si tus funciones de contexto lo son
    if (user.id) {
      await updateUser(user);
    } else {
      await addUser(user);
    }
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    panelRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- NUEVA FUNCIÓN: Cancelar Edición ---
  const handleCancelEdit = () => {
    setEditingUser(null); // Esto devuelve el formulario al modo "Crear"
  };

  const handleDelete = (userId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      deleteUser(userId);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6" ref={panelRef}>
      <div className="flex-1 space-y-6">
        
        {/* PASAMOS LA NUEVA PROP 'onCancel' AL FORMULARIO */}
        <UserForm 
            onSaveUser={handleSaveUser} 
            userToEdit={editingUser} 
            onCancel={handleCancelEdit} // <--- AQUÍ
        />

        <div className="bg-gray-800 rounded-lg shadow p-4 text-white">
          <h2 className="text-xl font-bold mb-4">Listado de Usuarios</h2>
          <ul>
            {users.map(user => (
              <li key={user.id} className="flex items-center justify-between p-2 border-b border-gray-700 last:border-b-0">
                <span>{user.nombre} ({user.email}) - {user.role}</span>
                <div>
                  <button 
                    onClick={() => handleEdit(user)} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-1 px-3 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)} 
                    className="bg-red-600 hover:bg-red-700 text-white text-sm py-1 px-3 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <aside className="w-full lg:w-80 mt-6 lg:mt-0 p-4 bg-gray-800 rounded-lg text-white">
        <h3 className="text-lg font-bold mb-2">Información Adicional</h3>
        <p>Total de usuarios: {users.length}</p>
      </aside>
    </div>
  );
};

export default UserManagementPanel;