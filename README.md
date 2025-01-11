# 1. Fork the Repository on GitHub: https://github.com/CANCELTHIS/TMS_FRONT.git

# 2. Clone the Repository
git clone https://github.com/CANCELTHIS/TMS_FRONT.git

# 3. Navigate to the Project Folder
cd TMS_FRONT

# 4. Install Dependencies
# For npm:
npm install
# For yarn:
yarn install

# 5. Create a New Branch
git checkout -b my-new-feature

# 6. Make Changes to the Code

# 7. Run the Project
# For npm:
npm start
# For yarn:
yarn start

# 8. Stage and Commit Changes
git add .
git commit -m "Description of changes"

# 9. Push Your Changes
git push origin my-new-feature

# 10. Create a Pull Request on GitHub

# 11. Review and Address Feedback (if any)

# 12. Clean Up after Merging
git branch -d my-new-feature
git push origin --delete my-new-feature

# 13. Keep Your Fork Updated
git remote add upstream https://github.com/CANCELTHIS/TMS_FRONT.git
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
