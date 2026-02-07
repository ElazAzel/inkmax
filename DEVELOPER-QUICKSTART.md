# Developer Quickstart

## Prerequisites

- **Node.js**: v18 or higher (v20 recommended)
- **npm**: v9 or higher
- **Git**

## Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/ElazAzel/inkmax.git
    cd inkmax
    ```

2. **Install dependencies**:

    ```bash
    npm install
    # If this fails, see Troubleshooting below
    ```

3. **Start development server**:

    ```bash
    npm run dev
    ```

## Project Structure

- `src/components/`: Reusable UI components (shadcn/ui)
- `src/pages/`: Route components
- `src/lib/`: Utilities and helpers
- `src/hooks/`: Custom React hooks

## Troubleshooting

### "Cannot find module 'react', 'lucide-react', etc."

**Cause:** dependencies are not installed.
**Fix:**

1. Open your terminal in the project root.
2. Run `npm install`.
3. If `npm` command is not found, download and install Node.js from [nodejs.org](https://nodejs.org/).

### "npm command not found"

**Cause:** Node.js is not installed or not in your system PATH.
**Fix:**

1. Install Node.js LTS version.
2. Restart your terminal/IDE.
3. Verify with `node -v` and `npm -v`.

### IDE Errors despite successful install

**Fix:**

1. Open Command Palette (Ctrl+Shift+P).
2. Type "TypeScript: Restart TS Server".
