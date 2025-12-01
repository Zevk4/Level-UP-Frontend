import React, { useState } from 'react';
import { useUsers } from '../../context/UserContext';
import { User } from '../../types';
import UserForm from './UserForm';

const UserManagementPanel: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleSaveUser = (user: User) => {
    if (user.id) {
      updateUser(user);
    } else {
      addUser(user);
    }
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleDelete = (userId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      deleteUser(userId);
    }
  };

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        <UserForm onSaveUser={handleSaveUser} userToEdit={editingUser} />

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
      {/* Podríamos tener una sección lateral para estadísticas de usuario o algo similar */}
      <aside className="w-80 p-4 bg-gray-800 rounded-lg text-white">
        <h3 className="text-lg font-bold mb-2">Información Adicional</h3>
        <p>Total de usuarios: {users.length}</p>
        {/* Más contenido futuro */}
      </aside>
    </div>
  );
};

export default UserManagementPanel;