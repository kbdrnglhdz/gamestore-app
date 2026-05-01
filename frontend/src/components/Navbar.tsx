import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const itemCount = cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">GameStore</Link>
        <div className="flex items-center gap-4">
          <Link to="/products" className="hover:text-gray-300">Products</Link>
          {user ? (
            <>
              <Link to="/cart" className="hover:text-gray-300">
                Cart ({itemCount})
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-gray-300">Admin</Link>
              )}
              <span className="text-gray-400">Hi, {user.name}</span>
              <button
                onClick={handleLogoutClick}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Logout</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to logout?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                autoFocus
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
