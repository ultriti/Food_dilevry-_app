# GitHub Repo Duplication & Sync Guide

## Duplicate Your Repo

```bash
# 1. Clone your main repo
git clone https://github.com/your-username/main-repo.git
cd main-repo

# 2. Remove old remote (disconnect from original)
git remote remove origin

# 3. Create a new empty repo on GitHub
# (via GitHub UI → New Repository → leave empty)

# 4. Add new remote (point to demo repo)
git remote add origin https://github.com/your-username/food_delivery_app_demo.git

# 5. Push code to demo repo
git push -u origin ma\in
git push origin --all
git push origin --tags
