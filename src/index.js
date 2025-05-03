//IIFE (Immediately Invoked Function Expression)
(async function(){
  let employees = [];
  let selectedEmployeeId = "";
  let selectedEmployee = null;

  //DOM manipulation
  const employeeList = document.querySelector(".employees-name");
  const employeeInfo = document.querySelector(".employee-detail-info");
  const addEmployee = document.querySelector(".addEmployee");
  const addEmployeeModal = document.querySelector(".addEmployeeModal");
  const addEmployeeForm = document.querySelector(".addEmployee-create");

  const saveEmployees = () => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }

  //Load list of employees from local storage if exist
  const loadEmployees = async ()=> {
    try{
      /* const localData = localStorage.getItem("employees");
      if(localData){
        employees = JSON.parse(localData);
      }else{ */
        const res = await fetch("data.json");
        employees = await res.json();
      
    }catch(e){
      console.error("failed to load employee data: ", e);
      employees = [];
    }
  }

  const nameInput = document.querySelector("input[name='name']");

  nameInput.addEventListener("input", (e) => {
    // Allow only alphabetic characters and spaces
  e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
});

  const validateFormData=(empData)=>{
    if(!empData.name || !empData.email.includes("@") || isNaN(empData.salary)){
      alert("Please enter a valid Name, email, salary!");
      return false;
    }
    return true;
  };

  const renderEmployees = () => {
    employeeList.innerHTML = "";
    employees.forEach((emp)=>{
      const employee = document.createElement("span");
      employee.classList.add("employees-name-item");
      if(parseInt(selectedEmployeeId,10) === emp.id){
        employee.classList.add("selected");
        selectedEmployee = emp;
      }
      employee.setAttribute("id", emp.id);
      employee.innerHTML = `${emp.name} <i class="employee-delete" aria-label="Delete-Employee">❌</i>`;
      employeeList.append(employee);
    });
  }

  const renderSingleEmployee = () => {
    if(!selectedEmployee){
      employeeInfo.innerHTML = "";
      return;
    }
    employeeInfo.innerHTML = `
      <img src="${selectedEmployee.imageUrl}" alt="${selectedEmployee.name}" />
      <span class="employee__name">${selectedEmployee.name}</span>
      <span class="employee__position">Position - ${selectedEmployee.position}</span>
      <span class="employee__email">Email - ${selectedEmployee.email}</span>
      <span class="employee__salary">Salary - ${selectedEmployee.salary}</span>
      <span class="employee__hire_date">D.O.J. - ${selectedEmployee.hire_date}</span>
      <button class="editEmployee">Edit Employee</button>
    `;
  }

  //add employee
  addEmployee.addEventListener("click", ()=> {
    addEmployeeModal.style.display = "flex";
  });

  //close add employee modal
  addEmployeeModal.addEventListener("click", (e)=> {
    if(e.target === addEmployeeModal){
      addEmployeeModal.style.display= "none";
    }
  });

  //form submission
  addEmployeeForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    const formData = new FormData(addEmployeeForm);
    const empData = Object.fromEntries(formData.entries());

    if(!validateFormData(empData)) return;

    empData.id = employees.length ? employees[employees.length -1].id + 1 : 1;
    empData.imageUrl = empData.imageUrl || "https://cdn-icons-png.flaticon.com/512/0/93.png";
    empData.salary = Number(empData.salary);
    employees.push(empData);
  
    saveEmployees();

    addEmployeeForm.reset();

    renderEmployees();
    renderSingleEmployee();
    addEmployeeModal.style.display = "none";
});

  //select employee
  employeeList.addEventListener("click", (e)=>{
    if(e.target.tagName === "SPAN"){
      if(selectedEmployeeId !== e.target.id){
        selectedEmployeeId= e.target.id;
        renderEmployees();
        renderSingleEmployee();
      }
    }
    //delete employee
    if(e.target.tagName === "I"){
      if(!confirm("Delete this employee?"))return;
      employees = employees.filter((emp)=>{
        return String(emp.id) !== e.target.parentNode.id;
      })
      //saveEmployees();
      if(String(selectedEmployeeId)=== e.target.parentNode.id){
        selectedEmployeeId = employees.length ? employees[0].id: null;
        selectedEmployee = employees.length ? employees[0]: null;
        renderSingleEmployee();
      }      
    renderEmployees();
    }
  });
  

  //Initial load
  await loadEmployees();
  renderEmployees();
  if(employees.length){
    selectedEmployeeId = employees[0].id;
    selectedEmployee = employees[0];
    renderSingleEmployee();
  }
})();