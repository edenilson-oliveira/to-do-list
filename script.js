const newTask = document.querySelector('#create-task')
const btnAddTask = document.querySelector('.add-new-task')
const areaTask = document.querySelector('.area-task')
const message = document.querySelector('.message')


class Task{
  constructor(boxTask,text,textToEdit,inputCheckbox){
    this.areaTask = areaTask
    this.boxTask = boxTask
    this.text = text
    this.textToEdit = textToEdit
    this.checkbox = inputCheckbox
    this.inputEdit = document.createElement('input')
  }
  
  edit(){
    this.checkbox.disabled = true
    this.inputEdit.type = 'text'
    this.inputEdit.classList.add('input-edit')
    this.inputEdit.value = this.text
    this.textToEdit.innerText = ''
    this.textToEdit.appendChild(this.inputEdit)
    }
  editCompleted(){
    this.checkbox.disabled = false
    this.text = this.inputEdit.value
    this.textToEdit.innerText = this.text
    }
    
  deleteTask(elementToRemove){
    this.elementToRemove = elementToRemove
    areaTask.removeChild(areaTask.children[elementToRemove])
  }
  
  taskCompleted(btnEdit){
    this.btnEdit = btnEdit
    if(this.checkbox.checked){
      this.textToEdit.classList.add('task-completed')
      btnEdit.disabled = true
    }
    else{
      this.textToEdit.classList.remove('task-completed')
      btnEdit.disabled = false
    }
  }
}

let checkboxId = 0
const arrayTasks = []

function createTask(){
  const boxTask = document.createElement('div')
  const label = document.createElement('label')
  const checkbox = document.createElement('input')
  const taskText = document.createElement('p')
  const btnEdit = document.createElement('button')
  const btnDelete = document.createElement('button')
  const div = document.createElement('div')
  boxTask.classList.add('task')
    
  checkbox.type = 'checkbox'
  checkbox.name = 'task-concluded'
  checkbox.id = checkboxId++
  taskText.innerText = newTask.value
  label.appendChild(taskText)
  label.htmlFor = checkbox.id
  
  
  function configButtons(button,icon,className,label){
    const span = document.createElement('span')
    span.classList.add('material-symbols-outlined')
    
    span.innerText = icon 
    button.appendChild(span)
    button.classList.add('buttons')
    button.classList.add(className)
    button.arialLabel = label
  }
  
  btnEdit.id = 'buttons-edit'
  
  configButtons(btnEdit,'edit','btn-edit','edit')
  configButtons(btnDelete,'delete','btn-delete','delete')
  
  
  div.classList.add('box-buttons')
  div.appendChild(btnEdit)
  div.appendChild(btnDelete)
  
  function addElementBoxTask(element){
    boxTask.appendChild(element)
  }
   
  addElementBoxTask(checkbox)
  addElementBoxTask(label)
  addElementBoxTask(div)
  arrayTasks.push(new Task(boxTask,newTask.value,taskText,checkbox))
  
  return boxTask
  
}
  
btnAddTask.addEventListener('click',(event) => {
  if(newTask.value){
    areaTask.appendChild(createTask())
    editAndDelete()
    saveData()
  }
  
  else{
    message.classList.remove('closed-anim')
    message.classList.add('initial-anim')
    
    setTimeout(() => {
      message.classList.add('closed-anim')
      message.classList.remove('initial-anim')
    },1000)
  }
})


function editAndDelete(){
  const checkbox = document.getElementsByName('task-concluded')
  const boxTask = document.getElementsByClassName('task')
  Array.from(boxTask).forEach((value,i) => {
    value.onclick = (event) => {
      const objectTask = arrayTasks[i]
      if(event.target.tagName === 'SPAN'){
      function editButtons(btnClass,icon,label){
        const button = event.target.parentNode
        button.classList.remove(button .classList[1])
        button.classList.add(btnClass)
        button.children[0].innerText = icon
        button.ariaLabel = label
          }
        
        switch(event.target.parentNode.classList[1]){
              
           case 'btn-edit':
            editButtons('btn-edit-done','done','edit')
            objectTask.edit(checkbox[i])
            break
              
          case 'btn-edit-done':
            editButtons('btn-edit','edit','edit-completed')
            objectTask.editCompleted(checkbox[i])
            saveData()
            break
              
          case 'btn-delete':
            objectTask.deleteTask(i)
            arrayTasks.splice(i,1)
            updateForEachLength()
            break
          }
        }
        
      if(event.target.tagName === 'INPUT'){
        const btnEdit = document.querySelectorAll('#buttons-edit')
        objectTask.taskCompleted(btnEdit[i])
        }
    }
  })
}


function updateForEachLength(){
  editAndDelete()
  saveData()
}

function saveData(){
  const boxTask = document.getElementsByClassName('task')
  const arrayElementTask = []
  for (let i = 0; i < boxTask.length; i++) {
    arrayElementTask[i] = boxTask[i].outerHTML
  }
  localStorage.setItem('dataTask',JSON.stringify(arrayElementTask))
}

window.onload = () => {
  const getSavedData = JSON.parse(localStorage.getItem('dataTask'))
  if(getSavedData){
    getSavedData.forEach((value,index) => {
    areaTask.innerHTML += value
    })
    
    const boxTask = document.querySelectorAll('.task')
    const checkbox = document.querySelectorAll('input[type=checkbox]')
    const taskText = document.querySelectorAll('p')
 
    boxTask.forEach((box, index) => {
      arrayTasks.push(new Task(box, taskText[index].innerText, taskText[index], checkbox[index]))
  })
  }
  editAndDelete()
}