<template>
    <transition name="expand">
      <section v-if="showAddTask" class="addTask" @keyup.enter="changeTask('add')">
          <div class="input-field">
            <input id="task-name" type="text" class="validate" v-model="newTaskVar.text">
            <label for="task-name">New Task</label>
          </div>
          <div class="input-field">
            <textarea id="task-notes" class="materialize-textarea" v-model="newTaskVar.notes"></textarea>
            <label for="task-notes">Notes (shift+enter for new line)</label>
          </div>
      </section>
    </transition>
</template>

<script>
export default {
  
}
</script>

<style>

</style>
