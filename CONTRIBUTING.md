# Contributing to Populle

Thank you for your interest in contributing to Populle!

## How to Contribute

### Reporting Bugs

- Check if the issue already exists
- Include steps to reproduce
- Provide browser/OS information
- Add screenshots if applicable

### Suggesting Features

- Open an issue with the "enhancement" label
- Describe the feature and its use case
- Be open to discussion

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run typecheck: `pnpm run typecheck`
5. Commit with clear messages
6. Push and create a Pull Request

## Development Setup

```bash
# Install pnpm globally
npm install -g pnpm

# Install dependencies
pnpm install

# Run typecheck (required before PR)
pnpm run typecheck

# Build all packages
pnpm run build
```

## Code Style

- Use TypeScript strict mode
- Follow existing code patterns
- Add comments for complex logic
- Use meaningful variable names

## Questions?

Open an issue or contact: hi@hsr.gg
