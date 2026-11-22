# Publish OneAtlas to your GitHub account

1. Sign in to GitHub and create a new **empty** repository named `oneatlas`.
2. Extract `oneatlas-fullstack-mvp.zip` on your laptop.
3. Open the extracted `oneatlas` folder in VS Code.
4. Open Terminal > New Terminal and run:

   ```bash
   git init
   git add .
   git commit -m "Build OneAtlas full-stack MVP"
   git branch -M main
   git remote add origin https://github.com/YOUR-GITHUB-USERNAME/oneatlas.git
   git push -u origin main
   ```

5. Replace `YOUR-GITHUB-USERNAME` with your GitHub username.

Do not commit `.env` files or database passwords. The `.gitignore` excludes `.env`.
