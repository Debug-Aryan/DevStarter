# __PROJECT_NAME__

__PROJECT_DESCRIPTION__

## Stack
- Python 3.12+
- Django 5
- Gunicorn

## Features
__FEATURES_LIST__

## Setup

1. **Clone the repository:**
   \`\`\`bash
   git clone <repo_url>
   cd <project_name>
   \`\`\`

2. **Create a virtual environment:**
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

3. **Install dependencies:**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. **Environment Variables:**
   Copy \`.env.example\` to \`.env\` and update values.

5. **Run Migrations:**
   \`\`\`bash
   python manage.py migrate
   \`\`\`

6. **Start Developer Server:**
   \`\`\`bash
   python manage.py runserver
   \`\`\`

## Docker

If using Docker:
\`\`\`bash
docker-compose up --build
\`\`\`
