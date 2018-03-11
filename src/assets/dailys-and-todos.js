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