# Hotel PMS Administration (React + Vite)

A production-style, scalable React.js admin app for Hotel Property Management.

## Tech Stack

- React + Vite
- React Router DOM
- React Hook Form
- Yup validation
- Material UI (MUI)
- Axios (with custom mock adapter)
- LocalStorage for persistence

## Folder Structure

```text
src/
  components/
    common/
      AppSnackbar.jsx
      DataTable.jsx
      LoadingOverlay.jsx
    forms/
      FileUpload.jsx
      FormSection.jsx
      RadioGroupInput.jsx
      SelectInput.jsx
      TextInput.jsx
  data/
    constants.js
    mockManagers.js
    samplePayloads.js
    timezones.js
  hooks/
    useLocalStorage.js
  layouts/
    DashboardLayout.jsx
    HeaderBar.jsx
    SidebarNav.jsx
  pages/
    PortfolioSetupPage.jsx
    PropertyCreationPage.jsx
  routes/
    AppRoutes.jsx
  services/
    apiClient.js
    mockApiAdapter.js
    portfolioService.js
    propertyService.js
  utils/
    file.js
    storage.js
  validations/
    portfolioSchema.js
    propertySchema.js
  App.jsx
  index.css
  main.jsx
```

## Setup Instructions

1. Open terminal in the project root.
2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

5. Preview production build:

```bash
npm run preview
```

## Required Installation Commands (Direct)

```bash
npm install react react-dom react-router-dom react-hook-form yup @hookform/resolvers axios @mui/material @mui/icons-material @emotion/react @emotion/styled dayjs
npm install -D vite @vitejs/plugin-react eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh @types/react @types/react-dom
```

## Modules Implemented

### 1) Property Creation Form

- Basic Property Information section
- Contact Information section
- Image upload with validation + preview
- Geolocation button (Get Current Location)
- Full validation via Yup
- Reset + Submit
- Loading overlay + snackbar notifications
- Saved properties table with search, sorting, pagination
- LocalStorage persistence through mock API layer

### 2) Portfolio Setup Form

- Portfolio details form
- Dynamic property dropdown sourced from created properties
- Full validation via Yup
- Reset + Submit
- Loading overlay + snackbar notifications
- Saved portfolios table with search, sorting, pagination
- LocalStorage persistence through mock API layer

## UI/UX Features

- Responsive dashboard layout
- Sidebar navigation + top header
- Light/Dark mode toggle
- Dashboard summary widget for total properties and portfolios
- Reusable form components
- Reusable table with search/sort/pagination
- Modern gradient styling and card-based structure

## Testing

Run all unit tests:

```bash
npm test
```

Run in watch mode:

```bash
npm run test:watch
```

Included test coverage:

- Yup schema validation tests for Property form
- Yup schema validation tests for Portfolio form
- Mock API service tests for create/list flows with localStorage

## Mock API Layer

Axios instance uses a custom adapter in `src/services/mockApiAdapter.js`.

Mock endpoints:

- `GET /managers`
- `GET /properties`
- `POST /properties`
- `GET /portfolios`
- `POST /portfolios`

## Sample JSON Payloads

Defined in `src/data/samplePayloads.js`.

### Property Payload

```json
{
  "status": "Active",
  "propertyCode": "NYC001",
  "propertyName": "Hudson Grand Hotel",
  "displayName": "Hudson Grand",
  "brand": "Marriott",
  "franchise": "Marriott Inn",
  "pms": "Choice",
  "pmsType": "Hotel",
  "chain": "Ramada Inn",
  "classification": "Luxury",
  "timezone": "America/New_York",
  "currency": "USD",
  "managerId": "mgr-001",
  "systemType": "PMS",
  "eventRadius": 25,
  "latitude": 40.7128,
  "longitude": -74.006,
  "contactName": "Emma Johnson",
  "email": "emma.johnson@hudsongrand.com",
  "mobileNo": "9175550123",
  "contactNo": "2125551122",
  "address": "123 Madison Ave",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "zipCode": "10016"
}
```

### Portfolio Payload

```json
{
  "code": "PORT001",
  "name": "East Coast Luxury",
  "classification": "Luxury",
  "manager": "Ava Thompson",
  "module": "Revenue",
  "propertyId": "prop-1746851500000",
  "secondaryManager": "Liam Patel",
  "distribution": "Direct, OTA, Corporate"
}
```

## Mock API Response Examples

### Create Property Response

```json
{
  "success": true,
  "data": {
    "id": "prop-1746851500000",
    "createdAt": "2026-05-10T10:00:00.000Z"
  }
}
```

### Create Portfolio Response

```json
{
  "success": true,
  "data": {
    "id": "port-1746851900000",
    "createdAt": "2026-05-10T10:05:00.000Z"
  }
}
```

## Notes

- Data is persisted to LocalStorage and survives page refresh.
- No backend is required for development.
- Easily replace mock adapter with real API endpoints later.
