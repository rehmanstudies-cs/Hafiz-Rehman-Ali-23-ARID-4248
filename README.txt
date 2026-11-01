HR FRAM — MASTER FRONT-END BUILD
=================================

START PAGE
----------
Open index.html.

IMPORTANT FOR PROPER TESTING
----------------------------
For reliable login/session/history behavior across multiple HTML pages,
serve this folder through a local web server instead of relying on file://.

Recommended in VS Code:
1. Open this folder in VS Code.
2. Install/open Live Server.
3. Right-click index.html -> Open with Live Server.

You can also run:
python -m http.server 8000

Then open:
http://localhost:8000/

TEST ACCOUNTS
-------------
Normal user
Email: demo@hrfram.test
Password: Demo1234

Administrator
Email: admin@hrfram.test
Password: Admin1234

EXPECTED NAVIGATION
-------------------
Guest:
Login + Get Started are visible.
Dashboard/Admin are hidden.

Logged-in normal user:
Dashboard + Logout are available.
Admin Panel is hidden.

Logged-in administrator:
Dashboard + Admin Panel + Logout are available.

AUTH FLOW
---------
Register -> creates a local browser account -> Dashboard
Login user -> Dashboard
Login admin -> Admin Panel
Forgot Password -> temporary 15-minute reset link
Reset Password -> changes the local account password
Logout -> clears the session -> Login

FILES
-----
index.html
crop-recommendation.html
yield-prediction.html
history.html
result-detail.html
about-us.html
dashboard.html
admin.html
help.html
privacy.html
terms.html
login.html
register.html
forgot-password.html
reset-password.html
app.css
auth.css
auth.js

CURRENT PROJECT-STAGE LIMITATIONS
---------------------------------
Crop recommendation and yield model outputs remain demo/front-end behavior
until trained models and the backend are integrated.

Account data and saved results use browser localStorage for now.
The production backend/database will replace this test storage later.
