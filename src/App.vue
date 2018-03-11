<template>
  <div id="app" @click="hideAll(tasks)">
    <div v-if="isLoading" class="progress">
      <div class="indeterminate"></div>
    </div>
    <div id="loginForm" @keydown.enter="login()">
      <div class="input-field col s12">
        <input id="username" type="text" class="validate" v-model="loginInfo.un">
        <label for="username">User Name</label>
      </div>      
      <div class="input-field col s12">
        <input id="password" type="password" class="validate" v-model="loginInfo.pw">
        <label for="password">Password</label>
      </div>
      <a class="waves-effect waves-light btn" @click="createUser()"><i class="material-icons right">account_circle</i>create</a>
      <a class="waves-effect waves-light btn" @click="login()"><i class="material-icons right">chevron_right</i>login</a>
      <div v-if="loginError" class="card orange darken-2">
        <div class="card-content white-text">
          <p>{{ loginError }}</p>
        </div>
      </div>
    </div>
    <div v-if="loggedIn" id="dabi">
      <transition name="expand">
        <section v-if="showAddTask" class="addTask" @keydown.enter="changeTask('add', $event)">
            <div class="input-field">
              <input id="task-name" ref="newTaskName" type="text" class="validate" v-model="newTaskVar.text">
              <label for="task-name">New Task</label>
            </div>
            <div class="input-field">
              <textarea id="task-notes" class="materialize-textarea" v-model="newTaskVar.notes"></textarea>
              <label for="task-notes">Notes</label>
              <span class="helper-text" data-error="wrong" data-success="right">(shift+enter for new line)</span>
            </div>
        </section>
      </transition>
      <ul class="task-list">
        <li v-for="(task, index) in tasks" :key="task.id">
            <label :for="task.id">
              <input type="checkbox"  @click="toggleTask(task)" class="filled-in" :id="task.id" :checked="task.completed" />
              <span></span>
            </label>
            <div @click.stop="toggleForm('edit',task)">
              {{ task.text }}
                <transition name="expand">
                <section v-on:click.stop v-if="task.showEdit" class="addTask" @keydown.enter="changeTask('edit', $event, task.id, index)">
                    <div class="input-field">
                      <input :id="task.id+'edit'" type="text" :placeholder="task.text" class="validate" v-model="newTaskVar.text">
                      <label for="task-name" class="active">Edit Task</label>
                    </div>
                    <div class="input-field">
                      <textarea :id="task.id+'notes'" :placeholder="task.notes" class="materialize-textarea" v-model="newTaskVar.notes"></textarea>
                      <label for="task-notes" class="active">Edit Notes</label>
                    </div>
                    <button @click="changeTask('delete', $event, task.id, index)" class="btn red lighten-2 waves-effect waves-light" type="submit" name="action">Delete
                      <i class="material-icons right">delete</i>
                    </button>
                </section>
                </transition>
            </div>
        </li>
      </ul>
      <a class="btn-floating btn-large waves-effect waves-light red" @click="toggleForm('add')"><i class="material-icons">{{ createButton }}</i></a>
    </div>
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
      loginInfo: {},
      loggedIn: false,
      loginError: false,
      tasks: {}
    }
  },
  methods: {
    toggleTask(task){
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
    hideAll(itemToHide){
      for (let i=0; i<itemToHide.length; i++){
            itemToHide[i]["showEdit"] = false;
          };
      return itemToHide;
    },
    toggleForm(action, task){
      if(action == "add"){
        this.hideAll(this.tasks);
        this.newTaskVar = {type:"todo"};
        this.showAddTask = !this.showAddTask;
        if(this.showAddTask){
          console.log(this.$refs.newTaskName);
          this.$nextTick(() => this.$refs.newTaskName.focus()); //focus on input
        }
        this.createButton = this.createButton == "add" ? "close" : "add";
      }
      else if(action == "edit"){
        this.newTaskVar["text"] = task.text;
        this.newTaskVar["notes"] = task.notes;
        if(this.showAddTask == true){
          this.showAddTask = false;
          this.createButton = this.createButton == "add" ? "close" : "add";
        }
        for (var key in this.tasks){
          if(this.tasks[key]["id"] != task.id){ //hide other possibly opened task edits
            this.tasks[key]["showEdit"] = false;
          }else{ // task matches id
            if (this.tasks[key]["showEdit"] == true){
              this.tasks[key]["showEdit"] = false;
            }else{
              this.tasks[key]["showEdit"] = true;
            }
          }
        }
      }
    },
    changeTask(action, event, id, index){
      //check for not shift+enter (new line) in comment
      let actionUrl = "https://habitica.com/api/v3/tasks/";

      if (event.keyCode == 13 && !event.shiftKey) //add and edit
      {
        event.preventDefault();
        let task = this.newTaskVar;
        if(action == "edit"){
          var currentTaskText = this.tasks[index]["text"];
          var currentTaskNotes = this.tasks[index]["notes"];
        } // for later use of checking nothing has changed
        let spacesReg = RegExp('/^\s*$/');
        if(action == "add"){
          actionUrl += "user";
          this.isLoading = true;
          axios.post(actionUrl, task,{
            'headers': {
              "x-api-user": "ad0d7cb3-d8c0-4d36-9fd9-5d9d50fc7ca1",
              "x-api-key": "87b461d3-6ced-4977-b49d-1aacf8067e23"
              }
            })
          .then(
            response => {
              this.newTaskVar = {type:"todo"};
              this.toggleForm(action);
              this.isLoading = false;
              this.tasks.unshift(response.data.data);
              //this.loadTasks();
          })
          .catch(function (error) {
            console.log(error);
          });
        }else if (action == "edit" && (currentTaskText != task.text || currentTaskNotes != task.notes)){
          actionUrl += id;
          this.isLoading = true;
          axios.put(actionUrl, task,{
            'headers': {
              "x-api-user": "ad0d7cb3-d8c0-4d36-9fd9-5d9d50fc7ca1",
              "x-api-key": "87b461d3-6ced-4977-b49d-1aacf8067e23"
              }
            })
          .then(
            response => {
              this.isLoading = false;
              this.tasks[index]["text"] = task.text;
              this.tasks[index]["notes"] = task.notes;
              this.tasks[index]["showEdit"] = false;
              this.newTaskVar = {type:"todo"};

          })
          .catch(function (error) {
            console.log(error);
          });
        }

      }
      if (action == "delete"){
        actionUrl += id;
        this.isLoading = true;
        axios.delete(actionUrl,{
          'headers': {
            "x-api-user": "ad0d7cb3-d8c0-4d36-9fd9-5d9d50fc7ca1",
            "x-api-key": "87b461d3-6ced-4977-b49d-1aacf8067e23"
            }
          })
        .then(
          response => {
            this.tasks.splice(index, 1);
            this.isLoading = false;
            this.tasks[index]["showEdit"] = false;
            this.newTaskVar = {type:"todo"};

        })
        .catch(function (error) {
          console.log(error);
        });
      }
    },
    loadTasks(){
      this.isLoading = true;
      var taskDailys;
      var taskTodos; 
      axios.get('https://habitica.com/api/v3/tasks/user?type=todos', {
        'headers': {
          "x-api-user": "ad0d7cb3-d8c0-4d36-9fd9-5d9d50fc7ca1",
          "x-api-key": "87b461d3-6ced-4977-b49d-1aacf8067e23"
          }
        })
      .then(
        response => {
          response.data.data = this.hideAll(response.data.data);
          this.tasks = response.data.data;
          this.isLoading = false;
          })
      .catch(function (error) {
        console.log(error);
      });     
    },
    createUser(){

    },
    login(){
      axios.post("http://sulley.cah.ucf.edu/~mi772228/dabi/log-in.php", this.loginInfo)
          .then(
            response => {
              this.newTaskVar = {type:"todo"};
              this.toggleForm(action);
              this.isLoading = false;
              this.tasks.unshift(response.data.data);
              //this.loadTasks();
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
  transition: all .5s ease;
}

.expand-leave-active {
  transition: all .1s ease;
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
