git rm -r --cached node_modules/
git rm --cached package-lock.json
git rm --cached .env
git rm --cached .DS_Store
git commit -m "Remove specified files and folders from the repository"
git add .
git commit -m "test"
git push
