import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User, UserRole } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Users,
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserCheck,
  UserX,
  Lock,
  Building
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await api.getAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (userId: number, newStatus: string) => {
    try {
      await api.updateUserStatus(userId, newStatus);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await api.updateUserStatus(userId, undefined, newRole);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter(u => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-[#063B68]" />
          <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
            User Governance & RBAC Role Management
          </h1>
        </div>
        <p className="text-xs text-[#64748B] mt-0.5">
          Approve registrations, manage organizational privileges, and configure role boundaries.
        </p>
      </div>

      {/* Search and Stats */}
      <div className="istelx-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Users, Roles, Emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#102A43]"
          />
        </div>

        <div className="text-xs font-semibold text-[#64748B]">
          Total Registered Users: <span className="font-bold text-[#063B68]">{users.length}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="istelx-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">User Identity</th>
                <th className="py-3 px-4 font-bold">Organization & Department</th>
                <th className="py-3 px-4 font-bold">Assigned Role</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-[#F8FAFC]">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#063B68]">{u.full_name}</div>
                    <div className="text-[10px] text-[#64748B] font-mono">{u.email}</div>
                  </td>
                  <td className="py-3 px-4 text-[#475569]">
                    <div className="font-semibold text-[#102A43]">{u.organization}</div>
                    <div className="text-[10px] text-[#64748B]">{u.department} • {u.designation}</div>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={u.role}
                      disabled={u.role === 'ADMIN'}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      className="px-2 py-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-semibold text-[#063B68]"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="Charter Manager">Charter Manager</option>
                      <option value="Logistics Manager">Logistics Manager</option>
                      <option value="Operations Manager">Operations Manager</option>
                      <option value="Management Viewer">Management Viewer</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {u.status !== 'APPROVED' ? (
                      <button
                        onClick={() => handleStatusChange(u.id, 'APPROVED')}
                        className="px-2.5 py-1 bg-[#00843D] text-white font-bold text-[11px] rounded hover:bg-emerald-700 cursor-pointer"
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(u.id, 'SUSPENDED')}
                        disabled={u.role === 'ADMIN'}
                        className="px-2.5 py-1 bg-[#F1F5F9] text-[#D92D20] font-semibold text-[11px] rounded hover:bg-[#FEECEB] border border-[#CBD5E1] cursor-pointer"
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
