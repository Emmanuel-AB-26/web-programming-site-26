const preview=document.getElementById("preview")
const previewBtn = document.getElementById("previewBtn");
const form = document.getElementById("profile-form");
const panel = document.getElementById("panel");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // stop the form from submitting to the server
  const clicked = e.target;    // the element that fired the event ... handle it in the browser instead ...
});

previewBtn.addEventListener("click", function () {
  if (!form.checkValidity()) {   // any HTML rule (required, pattern, min/max) failing?
    form.reportValidity();       // show the browser's warning bubbles
    return;  
  }                    // stop
const student_id=document.getElementById("student_id").value;
const fullname=document.getElementById("fullname").value;
const email=document.getElementById("email").value;
const phone=document.getElementById("phone").value;
const birthdate=document.getElementById("birthdate").value;
const portfolio=document.getElementById("portfolio").value;
const gin446=document.getElementById("gin446").value;
const major=[...document.getElementById("major").selectedOptions].map(opt=>opt.value);
const gpa=document.getElementById("gpa").value;
const credits=document.getElementById("credits").value;
const graduation=document.querySelector('input[name="graduation"]:checked')?.value;
const graduation_month=document.getElementById("graduation_month").value;
const internship_completed=document.querySelector('input[name="internship_completed"]:checked')?.value;
const skills = [...document.querySelectorAll('input[name="skills"]:checked')].map(cb => cb.value);
const language = [...document.getElementById("language").selectedOptions].map(opt => opt.value);
const software = [...document.getElementById("software").selectedOptions].map(opt => opt.value);
const project_title = document.getElementById("project_title").value;
const project_area = [...document.getElementById("project_area").selectedOptions].map(opt => opt.value);
const description = document.getElementById("description").value;
const team_size = document.getElementById("team_size").value;
const project_color = document.getElementById("project_color").value;
const meeting_date = document.getElementById("meeting_date").value;
const meeting_time = document.getElementById("meeting_time").value;
const confirmation = [...document.querySelectorAll('input[name="confirmation"]:checked')].map(cb => cb.value);

  // form is valid → continue (e.g., open a preview)
preview.textContent="";
const student_id_preview =document.createElement("p");
student_id_preview.textContent="Student ID: "+student_id;
preview.appendChild(student_id_preview);

const fullname_preview =document.createElement("p");
fullname_preview.textContent="Full Name: "+fullname;
preview.appendChild(fullname_preview);

const email_preview =document.createElement("p");
email_preview.textContent="Email: "+email;
preview.appendChild(email_preview);

const phone_preview =document.createElement("p");
phone_preview.textContent="Phone: "+phone;
preview.appendChild(phone_preview);

const birthdate_preview =document.createElement("p");
birthdate_preview.textContent="Birthdate: "+birthdate;
preview.appendChild(birthdate_preview);

const portfolio_preview =document.createElement("p");
portfolio_preview.textContent="Portfolio: "+portfolio;
preview.appendChild(portfolio_preview);

const gin446_preview =document.createElement("p");
gin446_preview.textContent="GIN446: "+gin446;
preview.appendChild(gin446_preview);

const major_preview =document.createElement("p");
major_preview.textContent="Major: "+major;
preview.appendChild(major_preview);

const gpa_preview =document.createElement("p");
gpa_preview.textContent="GPA: "+gpa;
preview.appendChild(gpa_preview);

const credits_preview =document.createElement("p");
credits_preview.textContent="Number of Completed Credits: "+credits;
preview.appendChild(credits_preview);

const graduation_preview =document.createElement("p");
graduation_preview.textContent="Graduation Semester: "+graduation;
preview.appendChild(graduation_preview);

const graduation_month_preview =document.createElement("p");
graduation_month_preview.textContent="Graduation Month: "+graduation_month;
preview.appendChild(graduation_month_preview);

const internship_completed_preview =document.createElement("p");
internship_completed_preview.textContent="Internship Completed?: "+internship_completed;
preview.appendChild(internship_completed_preview);

skills.forEach(function(skill){
const skills_preview =document.createElement("li");
skills_preview.textContent=skill;
preview.appendChild(skills_preview)});

const language_preview =document.createElement("p");
language_preview.textContent="Programming Language: "+language;
preview.appendChild(language_preview);

software.forEach(function(software){
const software_preview =document.createElement("li");
software_preview.textContent=software;
preview.appendChild(software_preview)});

const project_title_preview =document.createElement("p");
project_title_preview.textContent="Project Title: "+project_title;
preview.appendChild(project_title_preview);

const project_area_preview =document.createElement("p");
project_area_preview.textContent="Project Area: "+project_area;
preview.appendChild(project_area_preview);

const project_description_preview =document.createElement("p");
project_description_preview.textContent="Project Description: "+description;
preview.appendChild(project_description_preview);

const team_size_preview =document.createElement("p");
team_size_preview.textContent="Team Size: "+team_size;
preview.appendChild(team_size_preview);

const project_color_preview =document.createElement("p");
project_color_preview.textContent="Project Color: "+project_color;
preview.appendChild(project_color_preview);

const meeting_date_preview =document.createElement("p");
meeting_date_preview.textContent="Meeting Date: "+meeting_date;
preview.appendChild(meeting_date_preview);

const meeting_time_preview =document.createElement("p");
meeting_time_preview.textContent="Meeting Time: "+meeting_time;
preview.appendChild(meeting_time_preview);

const confirmation_preview=document.createElement("p");
confirmation_preview.textContent="You have confirmed that all the information is valid: "+confirmation;
preview.appendChild(confirmation_preview);

});


  showBtn.addEventListener("click",() => panel.classList.add("open"));    // Show
  hideBtn.addEventListener("click",() => panel.classList.remove("open")); // Hide
