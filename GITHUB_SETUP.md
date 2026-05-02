# 🚀 GitHub Setup Instructions

## Step 1: Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and log in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the repository details:
   - **Repository name**: `taskflow` (or any name you prefer)
   - **Description**: "Modern Project Management System with MERN Stack"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

### Option A: Using HTTPS (Recommended for beginners)

```bash
# Navigate to your project directory
cd task-manager

# Add the remote repository
git remote add origin https://github.com/Abhishekchoudhary123/taskflow.git

# Push your code
git push -u origin main
```

If prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your GitHub password)

### Option B: Using SSH (If you have SSH keys set up)

```bash
# Navigate to your project directory
cd task-manager

# Add the remote repository
git remote add origin git@github.com:Abhishekchoudhary123/taskflow.git

# Push your code
git push -u origin main
```

## Step 3: Verify Your Repository

1. Go to your GitHub repository URL
2. You should see all your files uploaded
3. The README.md will be displayed on the repository homepage

## 🔑 Creating a Personal Access Token (if needed)

If you're using HTTPS and need a token:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "TaskFlow Project")
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)
7. Use this token as your password when pushing

## 📝 Quick Commands Reference

```bash
# Check current remote
git remote -v

# Add remote (replace with your actual repository URL)
git remote add origin https://github.com/Abhishekchoudhary123/taskflow.git

# Push to GitHub
git push -u origin main

# Check status
git status

# View commit history
git log --oneline
```

## 🔄 Future Updates

After the initial push, to update your repository:

```bash
# Stage all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push
```

## ⚠️ Important Notes

1. **Never commit the `.env` file** - It contains sensitive information
2. The `.gitignore` file is already configured to exclude:
   - `.env` files
   - `node_modules/`
   - Build directories
   - Log files

3. **Before pushing**, make sure:
   - You've removed any sensitive data
   - The `.env.example` file has placeholder values only
   - All dependencies are listed in `package.json`

## 🎉 Success!

Once pushed, your repository will be live at:
`https://github.com/Abhishekchoudhary123/taskflow`

You can now:
- Share the repository link
- Collaborate with others
- Set up GitHub Actions for CI/CD
- Enable GitHub Pages for documentation
- Add collaborators

## 📱 Next Steps

1. Add a repository description and topics on GitHub
2. Add a repository banner/logo
3. Enable Issues and Discussions
4. Set up branch protection rules
5. Add a CONTRIBUTING.md file
6. Set up GitHub Actions for automated testing

---

Need help? Check the [GitHub Documentation](https://docs.github.com/en/get-started/quickstart/create-a-repo)
