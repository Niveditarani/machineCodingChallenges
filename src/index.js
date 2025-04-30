//IIFE (Immediately Invoked Function Expression)
(async function(){
  //async/await for fetching data
  const data = await fetch('data.json');
  const res= await data.json();
  console.log(res);
  let employees = res;
  let selectedEmployeeId = "";
  let selectedEmployee = "";
  
  //DOM Manipulation
  const employeeList = document.querySelector(".employees-name");
  const employeeInfo = document.querySelector(".employee-detail-info");
  const addEmployee = document.querySelector(".addEmployee");
  const addEmployeeModal = document.querySelector(".addEmployeeModal");
  const addEmployeeForm = document.querySelector(".addEmployee-create");

  //Opening AddEmployee modal
  addEmployee.addEventListener("click", ()=>{
    addEmployeeModal.style.display= "flex";
  })

  //Closing AddEmployee modal if background clicked
  addEmployeeModal.addEventListener("click", (e)=>{
    if (e.target ===addEmployeeModal){
      addEmployeeModal.style.display= "none";
    }
  });

   //form submission logic
   addEmployeeForm.addEventListener("submit", (e)=> {
    e.preventDefault(); //Prevent form reload
    const formData = new FormData(addEmployeeForm);
    const empData = Object.fromEntries(formData.entries());
    //check if we're editing an existing employee
    if(addEmployeeForm.dataset.editingId){
      const employeeId = parseInt(addEmployeeForm.dataset.editingId);
      const index = employees.findIndex(emp => emp.id === employeeId);
      if(index != -1){
        //update the existing employee
        employees[index] = {
          ...employees[index],
          name: empData.name,
          imageUrl: empData.imageUrl || "https://cdn-icons-png.flaticon.com/512/0/93.png",
          position: empData.position,
          email: empData.email,
          salary: empData.salary,
          hire_date: empData.hire_date
        };

        //update the selected employee reference
        if(selectedEmployeeId === employeeId){
          selectedEmployee = employees[index];
        }
      }
    }else{
      //add a new employee
      empData.id = employees[employees.length -1].id + 1;
      empData.imageUrl = empData.imageUrl || "https://cdn-icons-png.flaticon.com/512/0/93.png";
      empData.salary = Number(empData.salary);
      employees.push(empData);
    }

    //reset the form and UI after submission
    addEmployeeForm.reset();
    addEmployeeForm.querySelector("h1").textContent = "Add a new Employee Info";
    addEmployeeForm.querySelector('[type="submit"]').value = 'Submit';
    delete addEmployeeForm.dataset.editingId;

    //re-render UI
    renderEmployees();
    renderSingleEmployee();
    
    addEmployeeModal.style.display= "none";
  });

  //select employee logic
  employeeList.addEventListener("click", (e)=>{
    if(e.target.tagName==="SPAN" && selectedEmployeeId !== e.target.id){
      selectedEmployeeId = e.target.id;
      renderEmployees();
      renderSingleEmployee();
    }

    //delete employee logic
    if(e.target.tagName === "I"){
      if(!confirm("Delete this employee?")) return;
      employees = employees.filter((emp)=> String(emp.id) !== e.target.parentNode.id );

      if(String(selectedEmployeeId) === e.target.parentNode.id){
        selectedEmployeeId = employees.length>0 ? employees[0].id : -1;
        selectedEmployee = employees.length>0 ? employees[0] : null;
        renderSingleEmployee();
      }
      renderEmployees();
    }
  });

  //render list of employees
  const renderEmployees = () => {
    employeeList.innerHTML = "";
    employees.forEach(emp => {
      const employee = document.createElement("span");
      employee.classList.add("employees-name-item");
      if(parseInt(selectedEmployeeId,10)===emp.id){
        employee.classList.add("selected");
        selectedEmployee = emp;
      }
      employee.setAttribute("id", emp.id);
      employee.innerHTML = `${emp.name} <i class="employee-delete">❌</i>`;
      employeeList.append(employee);
    });
  };
  

  //render single employee info
  const renderSingleEmployee = () =>{
    if(!selectedEmployee || selectedEmployee=== -1) {
      employeeInfo.innerHTML="";
      return
    };
    employeeInfo.innerHTML = `<img src="${selectedEmployee.imageUrl}" />
    <span class="employee__name">${selectedEmployee.name} </span>
    <span class="employee__position">Position - ${selectedEmployee.position}</span>
    <span class="employee__email">Email - ${selectedEmployee.email}</span>
    <span class="employee__salary">Salary - ${selectedEmployee.salary}DKK</span>
    <span class="employee__hire_date">D.O.J. - ${selectedEmployee.hire_date}</span>
    <button class="editEmployee">Edit Employee</button>`;
  }

  //edit employee info
  employeeInfo.addEventListener("click", (e)=>{
    if(e.target.classList.contains("editEmployee") && selectedEmployee){
      //populate the form with the selected employee's data
      Object.entries(selectedEmployee).forEach(([key, value]) => {
        if(addEmployeeForm.elements[key]){
          addEmployeeForm.elements[key].value = value || '';
        }
      });

      //form UI
      addEmployeeForm.querySelector("h1").textContent = "Edit Employee";
      addEmployeeForm.querySelector('[type="submit"]').value = "Save Changes";

      //store the employee id being edited
      addEmployeeForm.dataset.editingId = selectedEmployee.id;

      //show modal
      addEmployeeModal.style.display = "flex";

    }
  });
 

   //initial rendering 
  renderEmployees();
  if(selectedEmployee) renderSingleEmployee();
})();