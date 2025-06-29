# KliniqAI Repository Integration Guide

This guide explains how to integrate your existing KliniqAI application repositories into this management system.

## Integration Methods

### Method 1: Git Submodules (Recommended)

Git submodules allow us to reference other repositories while keeping them independent.

```bash
# Add a repository as a submodule
git submodule add [REPOSITORY_URL] apps/[APP_NAME]

# Example:
git submodule add https://github.com/kliniqai/core-platform.git apps/core-platform
```

### Method 2: Symbolic Links (For Local Development)

If repositories are already cloned locally, create symbolic links:

```bash
# Create a symbolic link
ln -s /path/to/existing/repo apps/[APP_NAME]

# Example:
ln -s ~/Development/kliniqai-web apps/core-platform
```

### Method 3: Direct Clone (For Snapshot Analysis)

For one-time analysis without ongoing synchronization:

```bash
# Clone directly into apps directory
git clone [REPOSITORY_URL] apps/[APP_NAME]
```

## Repository Naming Convention

Use consistent names for integrated repositories:
- `core-platform` - Main web application
- `mobile-ios` - iOS application
- `mobile-android` - Android application
- `ai-services` - AI/ML microservices
- `community-features` - Forum and community modules
- `content-cms` - Content management system
- `admin-dashboard` - Administrative tools

## Post-Integration Steps

After adding each repository:

1. Create a repository-specific README:
   ```bash
   touch apps/[APP_NAME]/MANAGER_README.md
   ```

2. Document key information:
   - Primary technologies used
   - Key features implemented
   - Dependencies and integrations
   - Build and deployment process
   - Known issues or technical debt

3. Update this guide with the specific repository added

## Current Integrated Repositories

| Repository | Integration Method | Added Date | Primary Tech | Status |
|------------|-------------------|------------|--------------|--------|
| KPFG | Git Submodule | 2025-06-18 | React/Firebase | Active |
| KP-Medizin-Trainer | Git Submodule | 2025-06-18 | React/Vite | Development |
| KPCG | Git Submodule | 2025-06-18 | Python/FastAPI | Active |

## Maintenance

### Updating Submodules
```bash
# Update all submodules
git submodule update --remote --merge

# Update specific submodule
cd apps/[APP_NAME]
git pull origin main
```

### Checking Status
```bash
# Check submodule status
git submodule status

# View all integrated apps
ls -la apps/
```

## Security Considerations

- Never commit sensitive credentials or API keys
- Use `.gitignore` to exclude local configuration files
- Maintain read-only access for analysis purposes
- Document any security-sensitive areas in repository READMEs

## Next Steps

1. Identify all KliniqAI repositories to integrate
2. Choose appropriate integration method for each
3. Add repositories following this guide
4. Document each repository's role and status
5. Set up monitoring for repository changes