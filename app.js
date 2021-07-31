const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


var teamArray = [];
const managerQuestion = [
    {
        type: "input",
        name: "name",
        message: "Enter the manager's name:",
    },
    {
        type: "input",
        name: "email",
        message: "Enter the manager's email:",
    },
    {
        type: "input",
        name: "officeNumber",
        message: "What's manager's office number:"
    },
    //if the choice is yes, run employee question.
    {
        type: "list",
        name: "hasEmployee",
        message: "Are there employees under this manager?(y/n)",
        choices: ["yes", "no"]
    }]

const employeeQuestion = [
    {
        type: "input",
        name: "name",
        message: "Enter the employee's name:",
    },

    {
        type: "input",
        name: "email",
        message: "Enter the employee's email:",
    },

    {
        type: "list",
        name: "employeeTitle",
        message: "What's the employee's title",
        choices: ["Engineer", "Intern"]

    },

    //when title of employee is engineer and is true, ask this question
    {
        when: input => {
            return input.employeeTitle === "Engineer"
        },
        type: "input",
        name: "github",
        message: "Enter your github username:",
    },

    //when title of employee is intern and is true, ask this question
    {
        when: input => {
            return input.employeeTitle === "Intern"
        },
        type: "input",
        name: "school",
        message: "What's the school you enrolled in ?",
    },

    //when choice is yes, rerun employee question
    {
        type: "list",
        name: "addTeam",
        message: "add another employee?",
        choices: ["yes", "no"]
    }

]

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee

function renderManager(){
    inquirer.prompt(managerQuestion).then(data => {
        let manager = new Manager(data.name,teamArray.length + 1 ,data.email, data.officeNumber);
        teamArray.push(manager);

        if(data.hasEmployee === "yes"){
            renderEmployee();
        } else {
            return false;
        }

    })
}

renderManager();


function renderEmployee(){
    inquirer.prompt(employeeQuestion).then(data => {
        if(data.employeeTitle === "Engineer"){
            let engineer = new Engineer(data.name,teamArray.length + 1 ,data.email, data.github);
            teamArray.push(engineer);

        } else {
            let intern = new Intern(data.name,teamArray.length + 1 ,data.email, data.school);
            teamArray.push(intern);
        }

        //run employeeQuestion again if you answer yes in add more employee
        if(data.addTeam === "yes"){
            addAnother();
        }else{
            buildTeam();
        }

        
    
    })
}

//function to run employeeQuestion inquirer again
function addAnother(){
    renderEmployee()
}

function buildTeam(){
    if(!fs.existsSync(OUTPUT_DIR)){
        fs.mkdirSync(OUTPUT_DIR);
    }
    fs.writeFileSync(outputPath,render(teamArray), "utf-8");
}