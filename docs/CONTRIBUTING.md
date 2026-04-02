# Trivaro Prop Firm - Contributing Guidelines

## Welcome Contributors!

Thank you for your interest in contributing to Trivaro Prop Firm. This document provides guidelines for contributing to the project.

## Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/prop-firm.git
cd prop-firm

# Add upstream remote
git remote add upstream https://github.com/trivaro/prop-firm.git
```

### 2. Set Up Development Environment

```bash
# Install all dependencies
npm run install:all

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start development servers
npm run dev
```

### 3. Create a Branch

```bash
# Always branch from main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

## Development Guidelines

### Code Style

#### JavaScript/JSX
- Use ES6+ features
- Use functional components with hooks (React)
- Use async/await for asynchronous code
- Use semicolons
- Use single quotes for strings
- Use 2 spaces for indentation

#### Naming Conventions
- **Variables**: camelCase
- **Functions**: camelCase
- **Components**: PascalCase
- **Constants**: UPPER_SNAKE_CASE
- **Files**: PascalCase for components, camelCase for utilities

#### File Organization
```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── context/        # React Context providers
├── services/       # API service functions
├── utils/          # Utility functions
└── styles/         # Global styles
```

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
feat: Add new challenge type
fix: Fix drawdown calculation bug
docs: Update API documentation
style: Fix code formatting
refactor: Refactor auth service
test: Add unit tests for rule engine
chore: Update dependencies
```

### Pull Request Process

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Lint code**
   ```bash
   npm run lint
   ```

4. **Push changes**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Use the PR template
   - Describe your changes
   - Link related issues
   - Add screenshots if applicable

## Testing

### Backend Tests

```bash
cd backend
npm test
npm run test:watch
npm run test:coverage
```

### Frontend Tests

```bash
cd frontend
npm test
npm run test:coverage
```

### Test Guidelines

- Write tests for new features
- Maintain >80% code coverage
- Test edge cases
- Use descriptive test names
- Mock external services

## Code Review

### Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance is acceptable
- [ ] Error handling is proper

### Review Response Time

- We aim to review within 48 hours
- Be respectful and constructive
- Address feedback promptly

## Bug Reports

### Before Submitting

- [ ] Check existing issues
- [ ] Reproduce the bug
- [ ] Gather error messages
- [ ] Note steps to reproduce

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]
```

## Feature Requests

### Before Submitting

- [ ] Check existing requests
- [ ] Ensure it fits project scope
- [ ] Provide clear use case

### Feature Request Template

```markdown
**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other solutions you've thought about

**Additional Context**
Any other information
```

## Documentation

### Code Comments

- Comment complex logic
- Explain why, not what
- Use JSDoc for functions

```javascript
/**
 * Calculate trailing drawdown
 * @param {number} highestEquity - Highest equity reached
 * @param {number} currentEquity - Current equity
 * @returns {number} Drawdown percentage
 */
const calculateTrailingDrawdown = (highestEquity, currentEquity) => {
  // Implementation
}
```

### README Updates

Update README.md when:
- Adding new features
- Changing configuration
- Modifying API endpoints
- Adding dependencies

## Security

### Reporting Vulnerabilities

- Email: security@trivaro.com
- Do not create public issues for security bugs
- Include detailed reproduction steps
- Allow time for fix before disclosure

### Security Guidelines

- Never commit credentials
- Use environment variables
- Follow security best practices
- Report vulnerabilities responsibly

## Questions?

- **General**: dev@trivaro.com
- **Discussions**: GitHub Discussions
- **Chat**: Discord (link in README)

## Thank You!

Your contributions make Trivaro Prop Firm better for everyone. We appreciate your time and effort!

---

By contributing, you agree to license your work under our project license.
