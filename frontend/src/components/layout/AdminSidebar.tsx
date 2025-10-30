import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';


const AdminSidebar: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    return (
        <>
            <nav className="admin-nav">
                <div className="flex items-center gap-2 mb-6">
                    <div className="h-8 w-8 rounded-md bg-gray-900 text-white grid place-items-center font-bold">FD</div>
                    <h2 className="text-xl font-bold">Admin Panel</h2>
                </div>
                <ul className="space-y-2">
                    <li>
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) => `block py-2 px-2 rounded transition-colors ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
                        >
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/users"
                            className={({ isActive }) => `block py-2 px-2 rounded transition-colors ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
                        >
                            Users Management
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/categories"
                            className={({ isActive }) => `block py-2 px-2 rounded transition-colors ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
                        >
                            Category Management
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/products"
                            className={({ isActive }) => `block py-2 px-2 rounded transition-colors ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
                        >
                            Product Management
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/orders"
                            className={({ isActive }) => `block py-2 px-2 rounded transition-colors ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
                        >
                            Order Creation
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {!mobileOpen && (
                <button
                    aria-label="Open navigation"
                    className="md:hidden fixed top-3 right-3 z-50 rounded-md border border-gray-300 bg-white/90 backdrop-blur px-2.5 py-2 shadow-sm active:scale-[.98]"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            )}
            <div
                className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity md:hidden ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMobileOpen(false)}
            />
            <aside className={`fixed z-50 inset-y-0 left-0 w-64 bg-white border-r border-gray-200 p-5 md:hidden transition-transform duration-200 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-md bg-gray-900 text-white grid place-items-center text-xs font-bold">FD</div>
                        <h2 className="text-lg font-semibold tracking-tight">Admin Panel</h2>
                    </div>
                    <button
                        aria-label="Close navigation"
                        onClick={() => setMobileOpen(false)}
                        className="rounded-md border border-gray-300 p-1.5 hover:bg-gray-50 text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                <ul className="space-y-2">
                    <li>
                        <NavLink to="/" end className={({ isActive }) => `block py-2 px-2 rounded ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`} onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
                    </li>
                    <li>
                        <NavLink to="/users" className={({ isActive }) => `block py-2 px-2 rounded ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`} onClick={() => setMobileOpen(false)}>Users Management</NavLink>
                    </li>
                    <li>
                        <NavLink to="/categories" className={({ isActive }) => `block py-2 px-2 rounded ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`} onClick={() => setMobileOpen(false)}>Category Management</NavLink>
                    </li>
                    <li>
                        <NavLink to="/products" className={({ isActive }) => `block py-2 px-2 rounded ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`} onClick={() => setMobileOpen(false)}>Product Management</NavLink>
                    </li>
                    <li>
                        <NavLink to="/orders" className={({ isActive }) => `block py-2 px-2 rounded ${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`} onClick={() => setMobileOpen(false)}>Order Creation</NavLink>
                    </li>
                </ul>
            </aside>
        </>
    );
};

export default AdminSidebar;


