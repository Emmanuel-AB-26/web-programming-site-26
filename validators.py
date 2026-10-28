import re          # Python's built-in Regular Expressions (regex) module
from datetime import date

# ---- patterns (compiled once) ------------------------------------
STUDENT_ID = re.compile(r"^\d{9}$") # exactly 9 digits
FULLNAME  = re.compile(r"^[A-Za-z][A-Za-z .'\-]{1,79}$")  # letters/spaces/.'- , 2..80 chars
EMAIL = re.compile(r"^[A-Za-z]+\.[A-Za-z]+@net\.usek\.edu\.lb$")   # firstname.lastname@net.usek.edu.lb
PHONE = re.compile(r"^\+961 [0-9]{2} [0-9]{6}$")   # +961 XX XXXXXX
# https://github.com/username  OR  https://github.com/username/repo-name  (optional trailing slash)
GITHUB = re.compile(
    r"^https://github\.com/"
    r"[A-Za-z0-9](?:[A-Za-z0-9\-]{0,37}[A-Za-z0-9])?"   # username
    r"(?:/(?!\.{1,2}/?$)[A-Za-z0-9._\-]{1,100})?"       # optional /repo (but not "." or "..")
    r"/?$"
)
HTTPS_URL = re.compile(r"^https://[a-z0-9\-]+\.onrender\.com/?$")   # https://app-name.onrender.com
MONTH = re.compile(r"^\d{4}-(0[1-9]|1[0-2])$")        # e.g. 2026-07
TIME  = re.compile(r"^([01]\d|2[0-3]):[0-5]\d$")      # 24-hour, e.g. 17:38
HEXCOLOR = re.compile(r"^#[0-9A-Fa-f]{6}$")   # #RRGGBB, e.g. #FF5733

# ---- allow-lists ------------------------------
MAJORS   = {"Computer","Telecommunications","Electrical","Mechanical","Civil","Chemical","Biomedical","Agricultural","Food"}
GRADUATION = {"Spring", "Summer", "Fall"}
YESNO   = {"Yes", "No"}

SKILLS = {"Programming","Embedded Systems","Electronics","Computer Networks","Telecommunications","Biomedical Instrumentation","Artificial Intelligence/Machine Learning","Signal Processing"}
SOFTWARE = {"MATLAB","Simulink","LabVIEW","LTspice","Vivado","SolidWorks","ANSYS"}
PROJECT_AREAS = {"Artificial Intelligence","Web Applications","Cybersecurity","Internet of Things","Power Systems","Renewable Energy","Control Systems","Medical Imaging","Biosensors","Medical Devices","Wireless Communications","5G/6G Networks","Signal/Image Processing","RF Engineering","Machine Design","Thermal System Optimization","Energy Research","Chemical Process Design","Petroleum Engineering","Water Treatment","Bridge Design","Airport Design","Skyscraper Design","Organic Agriculture","Wine Production","Food Safety"}

REQUIRED={"student_id", "fullname", "email", "major", "graduation","confirmation"}


def validate_profile(form):
  errors = {}   # field name -> error message
  cleaned = {}   # field name -> trusted value
  # ---1. Required fields: must be present and not blank -----------
  for field in REQUIRED:
    if form.get(field, "").strip() == "":
            errors[field] = "This field is required."
    # ---2. Student ID: exactly 9 digits
  student_id = form.get("student_id", "").strip()
  if student_id != "" and not STUDENT_ID.match(student_id):
    errors["student_id"] = "Student ID must be exactly 9 digits."
  cleaned["student_id"] = student_id

    # ---3. Full name
  full_name = form.get("fullname", "").strip()
  if full_name != "" and not FULLNAME.match(full_name):
    errors["fullname"] = "Use letters, spaces, hyphens or apostrophes (2-80 chars)."
  cleaned["fullname"] = full_name

  # ---4. Email
  usek_email = form.get("email", "").strip()
  if usek_email != "" and not EMAIL.match(usek_email):
    errors["email"] = "Use your USEK email (firstname.lastname@net.usek.edu.lb)"
  cleaned["email"] = usek_email.lower()

  # ---5. Phone
  phone_number = form.get("phone", "").strip()
  if phone_number != "" and not PHONE.match(phone_number):
    errors["phone"] = "Enter a valid Lebanese number, e.g. +961 70 123456."
  cleaned["phone"] = phone_number

  # ---6. Date of birth
  def parse_date(text):
    try:
      return date.fromisoformat(text)
    except ValueError:
      return None

  birthdate = form.get("birthdate", "").strip()
  if birthdate != "":
    day = parse_date(birthdate)
    if day is None:
      errors["birthdate"] = "Not a valid date."
    elif day > date.today():
      errors["birthdate"] = "Date of birth cannot be in the future."
    else:
      age = (date.today() - day).days // 365
      if age < 15 or age > 100:
        errors["birthdate"] = "Age looks out of range."
  cleaned["birthdate"] = birthdate

  # ---7. GitHub link
  github = form.get("portfolio", "").strip()
  if github != "" and not GITHUB.match(github):
    errors["portfolio"] = "Use a GitHub URL: https://github.com/username"
  cleaned["portfolio"] = github

  # ---8. GIN446 site link
  render = form.get("gin446", "").strip()
  if render != "" and not HTTPS_URL.match(render):
    errors["gin446"] = "Enter a valid render link."
  cleaned["gin446"] = render

  # ---9. Major (no .lower(), the allow-list is capitalised)
  major = form.get("major", "").strip()
  if major != "" and major not in MAJORS:
    errors["major"] = "Choose a valid major."
  cleaned["major"] = major

  # ---10. GPA
  def to_number(text):
    try:
      return float(text)
    except ValueError:
      return None

  gpa = form.get("gpa", "").strip()
  if gpa != "":
    number = to_number(gpa)
    if number is None or number < 40 or number > 100:
      errors["gpa"] = "GPA must be a number between 40 and 100."
  cleaned["gpa"] = gpa

  # ---11. Credits
  credits = form.get("credits", "").strip()
  if credits != "":
    if not credits.isdigit() or int(credits) > 148:
      errors["credits"] = "Credits must be a whole number between 0 and 148."
  cleaned["credits"] = credits

  # ---12. Graduation semester
  graduation = form.get("graduation", "").strip()
  if graduation not in GRADUATION:
    errors["graduation"] = "Choose spring, summer or fall."
  cleaned["graduation"] = graduation

  # ---13. Graduation month (YYYY-MM), must not be in the past
  graduation_month = form.get("graduation_month", "").strip()
  if graduation_month != "":
    if not MONTH.match(graduation_month):
      errors["graduation_month"] = "Use the month picker (YYYY-MM)."
    else:
      year, month = (int(part) for part in graduation_month.split("-"))
      today = date.today()
      if (year, month) < (today.year, today.month):
        errors["graduation_month"] = "Graduation month cannot be in the past."
  cleaned["graduation_month"] = graduation_month

  # ---14. Internship
  internship = form.get("internship_completed", "").strip()
  if internship not in YESNO:
    errors["internship_completed"] = "Choose yes or no."
  cleaned["internship_completed"] = internship

  # ---15. Primary language
  language = form.get("language", "").strip()
  if language != "" and len(language) > 40:
    errors["language"] = "Keep it under 40 characters."
  cleaned["language"] = language

  # ---16. Skills
  good_skills, bad_skills = [], []
  for skill in form.getlist("skills"):
    if skill in SKILLS:
      good_skills.append(skill)
    else:
      bad_skills.append(skill)
  if bad_skills:
    errors["skills"] = "Unknown skill(s): " + ", ".join(bad_skills)
  cleaned["skills"] = good_skills

  # ---17. Software
  good_software, bad_software = [], []
  for item in form.getlist("software"):
    if item in SOFTWARE:
      good_software.append(item)
    else:
      bad_software.append(item)
  if bad_software:
    errors["software"] = "Unknown software: " + ", ".join(bad_software)
  cleaned["software"] = good_software

  # ---18. Project title
  title = form.get("project_title", "").strip()
  if title != "" and len(title) > 120:
    errors["project_title"] = "Title must be 120 characters or fewer."
  cleaned["project_title"] = title

  # ---19. Project area
  area = form.get("project_area", "").strip()
  if area not in PROJECT_AREAS:
    errors["project_area"] = "Choose a valid project area."
  cleaned["project_area"] = area

  # ---20. Description
  description = form.get("description", "").strip()
  if description != "" and len(description) > 1000:
    errors["description"] = "Description must be 1000 characters or fewer."
  cleaned["description"] = description

  # ---21. Team size
  def to_int(value):
    try:
      return int(str(value).strip())
    except (ValueError, TypeError):
      return None

  team_size = form.get("team_size", "").strip()
  if team_size != "":
    number = to_int(team_size)
    if number is None or number < 1 or number > 4:
      errors["team_size"] = "Team size must be a whole number from 1 to 4."
  cleaned["team_size"] = team_size

  # ---22. Dashboard color
  project_color = form.get("project_color", "").strip()
  if project_color != "" and not HEXCOLOR.match(project_color):
    errors["project_color"] = "Use a colour like #336699."
  if project_color == "":
    project_color = "#336699"
  cleaned["project_color"] = project_color

  # ---23. Meeting date (all checks inside the if)
  meeting_date = form.get("meeting_date", "").strip()
  if meeting_date != "":
    day = parse_date(meeting_date)
    if day is None:
      errors["meeting_date"] = "Not a valid date."
    elif day < date.today():
      errors["meeting_date"] = "Meeting date cannot be in the past."
  cleaned["meeting_date"] = meeting_date

  # ---24. Meeting time (HH:MM, 08:00 to 18:00)
  def parse_time(text):
    if not TIME.match(text):
      return None
    hh, mm = text.split(":")
    return int(hh) * 60 + int(mm)

  meeting_time = form.get("meeting_time", "").strip()
  if meeting_time != "":
    minutes = parse_time(meeting_time)
    if minutes is None:
      errors["meeting_time"] = "Time must be in HH:MM format."
    elif minutes < 8 * 60 or minutes > 18 * 60:
      errors["meeting_time"] = "Time must be between 08:00 and 18:00."
  cleaned["meeting_time"] = meeting_time

  return errors, cleaned