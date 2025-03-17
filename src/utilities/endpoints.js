const BASE_URL = "https://tms-api-23gs.onrender.com/";

export const ENDPOINTS = {
  // Department endpoints
  DEPARTMENT_LIST: `${BASE_URL}departments/`,
  DEPARTMENT_LIST_FORMAT: `${BASE_URL}departments.{format}/`,
  DEPARTMENT_DETAIL: (pk) => `${BASE_URL}departments/${pk}/`,
  DEPARTMENT_DETAIL_FORMAT: (pk, format) => `${BASE_URL}departments/${pk}.${format}/`,

  // Status History endpoints
  STATUS_HISTORY_LIST: `${BASE_URL}status-history/`,
  STATUS_HISTORY_LIST_FORMAT: `${BASE_URL}status-history.{format}/`,
  STATUS_HISTORY_DETAIL: (pk) => `${BASE_URL}status-history/${pk}/`,
  STATUS_HISTORY_DETAIL_FORMAT: (pk, format) => `${BASE_URL}status-history/${pk}.${format}/`,

  // Authentication endpoints
  API_ROOT: `${BASE_URL}`,
  API_ROOT_FORMAT: `${BASE_URL}<drf_format_suffix:format>/`,
  LOGIN: `${BASE_URL}api/token/`,
  TOKEN_REFRESH: `${BASE_URL}api/token/refresh/`,
  LOGOUT: `${BASE_URL}api/logout/`,
  REGISTER: `${BASE_URL}register/`,

  // User management endpoints
  APPROVE_USER: (user_id) => `${BASE_URL}approve/${user_id}/`,
  USERS: `${BASE_URL}users/`,
  USER_LIST: `${BASE_URL}users-list/`,
  CURRENT_USER: `${BASE_URL}api/users/me/`,
  USER_DETAIL: (user_id) => `${BASE_URL}api/users/${user_id}/`,
  RESUBMIT_USER: (user_id) => `${BASE_URL}resubmit/${user_id}/`,
  ACTIVATE_USER: (user_id) => `${BASE_URL}activate/${user_id}/`,
  DEACTIVATE_USER: (user_id) => `${BASE_URL}deactivate/${user_id}/`,
  UPDATE_ROLE: (user_id) => `${BASE_URL}update-role/${user_id}/`,
  APPROVED_USERS: `${BASE_URL}approved-users/`,

  // Transport requests and resources
  REQUEST_LIST: `${BASE_URL}transport-requests/list/`,

  AVAILABLE_DRIVERS: `${BASE_URL}available-drivers/`,
  AVAILABLE_VEHICLES: `${BASE_URL}available-vehicles/`,

  CREATE_REQUEST: `${BASE_URL}transport-requests/create/`,
  TM_APPROVE_REJECT: `${BASE_URL}transport-requests/`,
  REQUEST_NOTIFICATIONS: `${BASE_URL}transport-requests/notifications/`,
  UNREADOUNT: `${BASE_URL}transport-requests/notifications/unread-count/`,
  MARKALL_READ: `${BASE_URL}transport-requests/notifications/mark-all-read/`,
  // Vehicle endpoints
  VEHICLE_LIST: `${BASE_URL}vehicles/`,
  VEHICLE_LIST_FORMAT: `${BASE_URL}vehicles.{format}/`,
  VEHICLE_DETAIL: (pk) => `${BASE_URL}vehicles/${pk}/`,
  EDIT_VEHICLE: (pk) => `${BASE_URL}vehicles/${editingVehicle.id}/`,
  VEHICLE_DETAIL_FORMAT: (pk, format) => `${BASE_URL}vehicles/${pk}.${format}/`,
};