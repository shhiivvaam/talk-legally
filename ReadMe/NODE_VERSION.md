# Node.js Version Requirement

## Current Status
- **Your Node.js Version**: 20.17.0
- **Required Version**: >= 20.19.4
- **Status**: ⚠️ Warnings will appear but app should work

## Why the Warnings?
React Native 0.81.5 and Metro bundler require Node.js >= 20.19.4 for optimal compatibility. Your current version (20.17.0) will work but you'll see warnings during `npm install`.

## Solutions

### Option 1: Upgrade Node.js (Recommended)
```bash
# Using nvm (Node Version Manager)
nvm install 20.19.4
nvm use 20.19.4

# Or download from nodejs.org
# https://nodejs.org/
```

### Option 2: Use .nvmrc (if using nvm)
The project includes a `.nvmrc` file. If you have nvm installed:
```bash
nvm use
```

### Option 3: Ignore Warnings (Not Recommended)
The warnings are non-blocking and the app will function, but you may encounter issues with:
- Metro bundler performance
- Some build tools
- Future dependency updates

## Verification
After upgrading, verify your version:
```bash
node --version
# Should show: v20.19.4 or higher
```
