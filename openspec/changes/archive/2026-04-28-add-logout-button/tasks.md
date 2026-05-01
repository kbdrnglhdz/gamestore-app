## 1. Logout Confirmation Dialog

- [x] 1.1 Add state variable `showLogoutConfirm` to Navbar component to control confirmation dialog visibility
- [x] 1.2 Create confirmation dialog UI in Navbar that shows when `showLogoutConfirm` is true
- [x] 1.3 Add "Cancel" and "Logout" buttons to the confirmation dialog
- [x] 1.4 Wire up "Logout" button to call the existing `logout()` function from AuthContext
- [x] 1.5 Wire up "Cancel" button to hide the dialog and keep user logged in

## 2. Styling and UX Improvements

- [x] 2.1 Style the logout button in Navbar for better visibility (distinct from links)
- [x] 2.2 Style the confirmation dialog with overlay and centered modal
- [x] 2.3 Ensure the dialog is accessible (keyboard navigation, focus management)

## 3. Verification

- [x] 3.1 Test logout flow: click logout → dialog appears → confirm → user is logged out
- [x] 3.2 Test cancel flow: click logout → dialog appears → cancel → user stays logged in
- [x] 3.3 Verify tokens are cleared from localStorage after logout
