<template>
  <div id="app">
    <div v-if="isLoading" class="progress">
      <div class="indeterminate"></div>
    </div>
    <transition name="expand">
      <section v-if="showAddTask" class="addTask" @keyup.enter.prevent="newTask">
          <div class="input-field">
            <input id="task-name" type="text" class="validate" v-model="newTaskVar.text">
            <label for="task-name">New Task</label>
          </div>
          <div class="input-field">
            <textarea id="task-notes" class="materialize-textarea" v-model="newTaskVar.notes"></textarea>
            <label for="task-notes">Notes</label>
          </div>
      </section>
    </transition>
    <ul class="task-list">
      <li v-for="task in tasks">
          <label :for="task.id">
            <input type="checkbox"  @click="checkTask(task)" class="filled-in" :id="task.id" :checked="task.completed" />
            <span></span>
          </label>
          <div>{{ task.text }}</div>
      </li>
    </ul>
    <a class="btn-floating btn-large waves-effect waves-light red" @click="toggleAddForm()"><i class="material-icons">{{ createButton }}</i></a>
  </div>
</template>

<script>
var axios = require('axios');// for ajax

export default {
  name: 'app',
  data () {
    return {
      isLoading: true, //loading page
      showAddTask: false,
      createButton: "add",
      newTaskVar: {type:"todo"},//just todo for now
      progressWidth: "",
      tasks: {}
    }
  },
  methods: {
    checkTask(task){
      this.isLoading = true;//progress bar
      if(task.completed == true){ //if true -> uncheck
        axios.post('https://habitica.com/api/v3/tasks/'+task.id+'/score/down', {'scoreNotes': 'complete the task?'},{
          'headers': {
            "x-api-user": "ad0d7cb3-d8c0-4d36-9fd9-5d9d50fc7ca1",
            "x-api-key": "87b461d3-6ced-4977-b49d-1aacf8067e23"
            }
          })
        .then(
          response => {
            task.completed = false;
            this.isLoading = false;
        })
        .catch(function (error) {
          console.log(error);
        });
      }
      else{// if false -> true
        axios.post('https://habitica.com/api/v3/tasks/'+task.id+'/score/up', {'scoreNotes': 'complete the task?'},{
          'headers': {
            "x-api-user": "ad0d7cb3-d8c0-4d36-9fd9-5d9d50fc7ca1",
            "x-api-key": "87b461d3-6ced-4977-b49d-1aacf8067e23"
            }
          })
        .then(
          response => {
            task.completed = true;
            this.isLoading = false;
        })
        .catch(function (error) {
          console.log(error);
        });        
      }
      
    },
    toggleAddForm(){
      this.showAddTask = !this.showAddTask;
      this.createButton = this.createButton == "add" ? "close" : "add";
    },
    newTask(){
      let task = this.newTaskVar;
      this.isLoading = true;//progress bar
      console.log(task);
      axios.post('https://habitica.com/api/v3/tasks/user', task,{
          'headers': {
            "x-api-user": "ad0d7cb3-d8c0-4d36-9fd9-5d9d50fc7ca1",
            "x-api-key": "87b461d3-6ced-4977-b49d-1aacf8067e23"
            }
          })
        .then(
          response => {
            this.isLoading = false;
            this.loadTasks();
            this.toggleAddForm();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    loadTasks(){
      this.isLoading = true;
      var taskDailys;
      var taskTodos; 
      axios.get('https://habitica.com/api/v3/tasks/user?type=dailys', {
        'headers': {
          "x-api-user": "ad0d7cb3-d8c0-4d36-9fd9-5d9d50fc7ca1",
          "x-api-key": "87b461d3-6ced-4977-b49d-1aacf8067e23"
          }
        })
      .then(
        response => {
          //this.tasks = response.data.data;
          taskDailys = JSON.stringify(response.data.data);
          taskDailys = taskDailys.substr(1).slice(0, -1);
          return axios.get('https://habitica.com/api/v3/tasks/user?type=todos', {
        'headers': {
          "x-api-user": "ad0d7cb3-d8c0-4d36-9fd9-5d9d50fc7ca1",
          "x-api-key": "87b461d3-6ced-4977-b49d-1aacf8067e23"
          }
        });
      })
      .then(
        response => {
          taskTodos = JSON.stringify(response.data.data);
          taskTodos = taskTodos.substr(1).slice(0, -1);
          this.tasks = JSON.parse("[" + taskDailys + "," + taskTodos + "]");
          this.isLoading = false;
      })
      .catch(function (error) {
        console.log(error);
      });     
    }
  },
  beforeCreate(){

  },
  created(){
    this.loadTasks();
  }  
}
</script>

<style lang="scss">
.expand-enter-active, .expand-leave-active {
  max-height: 800px;
  transition: all 1.2s ease;
}

.expand-leave-active {
  transition: all .7s ease;
}
.expand-enter, .expand-leave-to /* .fade-leave-active below version 2.1.8 */ {
  max-height: 0px;
}

section.addTask{
  overflow: hidden;
}

ul.task-list li{
  display: flex;
}
</style>
