import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAll, toggleBlock } from '../../services/userService';
import axios from 'axios';
import classes from './usersPage.module.css';
import Title from '../../components/Title/Title';
import Search from '../../components/Search/Search';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const { searchTerm } = useParams();
  const auth = useAuth();

  useEffect(() => {
    loadUsers();
  }, [searchTerm]);

  const loadUsers = async () => {
    try {
      const users = await getAll(searchTerm);
      setUsers(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleToggleBlock = async (userId) => {
    try {
      const isBlocked = await toggleBlock(userId);

      setUsers((oldUsers) =>
        oldUsers.map((user) =>
          user.id === userId ? { ...user, isBlocked } : user
        )
      );
    } catch (error) {
      console.error('Error toggling block status:', error);
    }
  };

  const handleEditUser = async (userId) => {
    try {
      // Update `onEdit` state to true before redirecting
      await axios.put(`/api/users/setEditState/${userId}`, { onEdit: true });
      window.location.href = `/admin/editUser/${userId}`;
    } catch (error) {
      console.error('Failed to set edit state:', error);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.list}>
        <div style={{ marginLeft: '1rem' }}>
          <Title title="User Management" />
        </div>
        <Search
          searchRoute="/admin/users/"
          defaultRoute="/admin/users"
          placeholder="Search Users"
          margin="1rem 0"
        />
        <div className={classes.list_item}>
          <h3>Name</h3>
          <h3>Email</h3>
          <h3>Address</h3>
          <h3>Admin</h3>
          <h3>Actions</h3>
        </div>
        {users &&
          users.map((user) => (
            <div key={user.id} className={classes.list_item}>
              <span>{user.name}</span>
              <span>{user.email}</span>
              <span>{user.address}</span>
              <span>{user.isAdmin ? '✅' : '❌'}</span>
              <span className={classes.actions}>
                <Link onClick={() => handleEditUser(user.id)}>Edit</Link>
                {auth.user.id !== user.id && (
                  <Link onClick={() => handleToggleBlock(user.id)}>
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </Link>
                )}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
