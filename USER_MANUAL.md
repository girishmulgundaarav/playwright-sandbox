# Playwright Automation Practice Sandbox - User Manual

Welcome to the **Playwright Automation Practice Sandbox**! This manual provides a comprehensive guide to navigating and testing the sandbox application, detailing the purpose, interactive elements, and automation objectives for each of the available testing challenges.

This platform serves as a modern, premium testing ground designed to simulate real-world web application behaviors, helping QA engineers and developers master end-to-end (E2E) testing with Playwright.

---

## 🚀 Getting Started

### 1. Prerequisites & Installation
Ensure you have **Node.js (version 20 or higher)** installed on your machine.
To set up the sandbox locally, clone the repository, navigate to the project root, and install the required dependencies:

```bash
npm install
```

### 2. Running the Sandbox Locally
To start the Next.js development server:

```bash
npm run dev
```

By default, the server will launch on [http://localhost:3000](http://localhost:3000). Open this URL in your web browser to access the sandbox interface.

---

## 🛠️ User Interface & Layout

The sandbox is styled using a modern, responsive design optimized for testing:
* **Persistent Sticky Header:** Includes quick navigation to the dashboard and a dynamic **Challenges** dropdown menu grouping all sections.
* **Ready for Testing Badge:** A pulsing green visual indicator showing that all page elements are loaded and ready to accept automation instructions.
* **Responsive Cards Grid:** The dashboard presents 13 isolated automation challenges categorized with tagging, descriptive badges, and sequential identifiers.

---

## 🧪 Detailed Sandbox Challenges Reference

Below is a breakdown of the 13 sandbox pages. Each section describes the target components, user interactive states, and what assertions and flows you should aim to automate.

```
+-------------------------------------------------------------------------+
|                       Playwright Practice Sandbox                       |
+-------------------------------------------------------------------------+
| 1. Basic UI Controls     | 2. Forms & Controls     | 3. Multi-Type Dropdowns  |
| 4. Tables & Grids        | 5. Async Challenges     | 6. DOM & Locating        |
| 7. Advanced Actions      | 8. Calendars & Pickers  | 9. Multi-Tab & Windows   |
| 10. Geolocation & Perms  | 11. Storage & Auth      | 12. API Sandbox          |
|                          | 13. Form Wizard         |                          |
+-------------------------------------------------------------------------+
```

### 1. Basic UI Controls (`/basic-controls`)
* **Purpose:** Learn to manipulate foundational web elements and assert color/visibility states.
* **Interactive Elements:**
  * Radio button groups (e.g., gender, preferences).
  * Checkbox grids with independent select and deselect operations.
  * Toggles that dynamically change style classes and element visibility.
* **Automation Objectives:**
  * Verify initial states (selected vs. unselected).
  * Toggle options and assert color shifts (CSS styling class changes).
  * Verify that clearing selections resets the control state.

### 2. Forms & Controls (`/forms`)
* **Purpose:** Handle modern form input validation, formatting, and file interactions.
* **Interactive Elements:**
  * Password strength meters updating in real-time.
  * Debounced asynchronous username check input (triggers loader API).
  * Text inputs with predefined format masks (e.g., phone numbers, credit cards).
  * Character counter fields enforcing text length limits.
  * Drag-and-drop multi-file upload zone.
* **Automation Objectives:**
  * Test validation behavior by inputting short/weak passwords.
  * Upload multiple files simultaneously using Playwright's file chooser.
  * Validate debounced status indicators by waiting for API response classes.

### 3. Multi-Type Dropdowns (`/dropdowns`)
* **Purpose:** Automate select elements, comboboxes, and tagging dropdowns.
* **Interactive Elements:**
  * Native HTML `<select>` dropdowns.
  * Custom searchable combobox inputs (dynamic suggestions).
  * Tag selection widgets (allowing multiple tags).
  * Dependent select controls (e.g., State dropdown updates based on Country select).
* **Automation Objectives:**
  * Select options by index, value, or text.
  * Type text into searchable dropdowns and select the filtered options.
  * Verify cascading dropdown updates and assert correct child list items.

### 4. Tables & Grids (`/tables`)
* **Purpose:** Parse structural table layouts, verify sorting, and handle pagination.
* **Interactive Elements:**
  * Dynamic data grids with sortable header columns (ascending/descending).
  * Search filter input filtering rows locally.
  * Pagination control links (Next, Previous, specific page numbers).
  * Row-level action buttons (Edit, Delete).
* **Automation Objectives:**
  * Extract row counts and parse cell value strings.
  * Perform column header clicks and assert alphabetical/numeric sorting order.
  * Search for items, click pagination controls, and verify the correct subset of data renders.

### 5. Async Challenges (`/async`)
* **Purpose:** Deal with delayed rendering, AJAX calls, and progressive hydration.
* **Interactive Elements:**
  * Trigger buttons launching delayed tasks.
  * Asynchronous loading spinners and progress bar indicators.
  * Progressive page rendering elements that appear after arbitrary delays.
* **Automation Objectives:**
  * Implement explicit waiting strategies (avoid hardcoded sleep timeouts).
  * Assert element presence, visibility, and text updates following dynamic operations.
  * Handle race conditions where elements load in non-deterministic order.

### 6. DOM & Locating (`/dom`)
* **Purpose:** Pierce complex DOM structural boundaries and interact with dialogs.
* **Interactive Elements:**
  * Standard popup dialog modals.
  * Nested standard `<iframe>` blocks.
  * Custom web components encapsulated inside a **Shadow DOM** boundary.
* **Automation Objectives:**
  * Handle modal dismissal and check screen overlays.
  * Switch execution context inside nested iframes.
  * Target elements wrapped within Shadow roots using Playwright's automatic shadow piercing.

### 7. Advanced Interactions (`/advanced`)
* **Purpose:** Execute high-fidelity mouse and keyboard simulation scripts.
* **Interactive Elements:**
  * Drag-and-drop containers.
  * Hover menus showing custom dropdown elements.
  * Custom numeric range slider controls.
  * Drawing canvas area capturing coordinates.
  * Multi-key combination capture card.
* **Automation Objectives:**
  * Trigger pointer actions like `dblclick`, right-click (`click({ button: 'right' })`), and hover.
  * Drag slide bars to target positions.
  * Send modifier key sequences (e.g., `Control+Shift+S`) and verify state updates.

### 8. Calendars & Pickers (`/calendars`)
* **Purpose:** Automate date inputs, range pickers, and calendar widgets.
* **Interactive Elements:**
  * Native browser HTML5 date controls.
  * Interactive date popup grid calendars.
  * Linked start-date and end-date range selectors.
* **Automation Objectives:**
  * Type directly into native input controls using standard date formats.
  * Navigate popups using month/year pagination controls and select calendar day cells.
  * Select logical date intervals (e.g., booking flights) and assert interval duration.

### 9. Multi-Tab & Windows (`/windows`)
* **Purpose:** Control multi-page execution context and browser processes.
* **Interactive Elements:**
  * Links configured with `target="_blank"` attributes.
  * Programmatic buttons invoking `window.open()`.
* **Automation Objectives:**
  * Listen for and capture target tab open events.
  * Switch active page context between parent window and spawned tabs.
  * Manipulate and close secondary tabs while returning execution flow to the main window.

### 10. Geolocation & Permissions (`/permissions`)
* **Purpose:** Test application behavior depending on browser API flags.
* **Interactive Elements:**
  * Geolocation locator request button.
  * Camera/Microphone browser prompt hooks.
* **Automation Objectives:**
  * Grant/deny permissions dynamically in test runner context.
  * Mock coordinate values (Latitude/Longitude) and assert corresponding UI map labels.

### 11. Storage & Authentication (`/storage`)
* **Purpose:** Maintain authentication contexts and test local state integrity.
* **Interactive Elements:**
  * Standard secure login credentials form.
  * Session storage timers and token displays.
  * Auto-logout actions after period of inactivity.
* **Automation Objectives:**
  * Save authenticated state to a state storage JSON file to reuse session tokens.
  * Inspect, assert, and clear cookies, localStorage values, and sessionStorage keys.
  * Verify user session expiration behaviors.

### 12. API Sandbox (`/api-sandbox`)
* **Purpose:** Validate hybrid UI and API scenarios within a unified test run.
* **Interactive Elements:**
  * Client API request submission panel.
  * Header customizers and token inputs.
* **Automation Objectives:**
  * Intercept and modify fetch responses (mocking API payloads).
  * Issue raw HTTP queries via `request` context and match values with the UI representation.
  * Assert request headers, status codes, and JSON response bodies.

### 13. Form Wizard (`/wizard`)
* **Purpose:** Orchestrate multi-step workflow automation.
* **Interactive Elements:**
  * Step indicator nodes (Step 1, Step 2, Step 3, Finish).
  * Guided checkout wizard forms containing conditional inputs.
  * Summary validation screen showing calculated aggregates.
* **Automation Objectives:**
  * Step sequentially through the workflow while asserting form validation states at each interval.
  * Verify "Back" buttons preserve already inputted form states.
  * Assert final calculations match step input parameters.

---

## 🔍 Locator Best Practices

When writing tests for the sandbox, rely on the following selector practices to keep your scripts resilient:

1. **`data-testid` attributes:** The sandbox is heavily decorated with custom test identifiers (e.g., `data-testid="draggable-box"`, `data-testid="nav-dashboard"`). Locate these using `page.getByTestId('name')`.
2. **Accessible Role Queries:** For semantic structures, leverage Playwright's role locators:
   ```typescript
   await page.getByRole('button', { name: 'Submit' }).click();
   ```
3. **Text Matches:** Use fuzzy text matching for alerts and validation errors:
   ```typescript
   await expect(page.getByText('Dropped Successfully!')).toBeVisible();
   ```
