<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue';
import Notification from '@/components/Notification.vue';
import type INotification from "@/models/notification";

const props = defineProps({
  notifications: {type: Array<INotification>, required: true}
})
const notifications = ref<Array<any>>([]);
const notificationComponentRefs = ref<Array<InstanceType<typeof Notification>>>([]);

watch(
    () => props.notifications, 
    () => { 
        const newNotification = props.notifications.pop();
        if (newNotification != undefined) {
          addNotification(newNotification.status, newNotification.text);
          deleteNotification();
        }
    },
    {deep: true}
)

let height = 5
let top = 0;
let marginTop = 0.5;
let timeout = 5000;
let id = 0;

function addNotification(status: string, text: string) {
  notifications.value.push({props: {status: status, text: text, height: height, top: top+marginTop}, key: top});
  id += 1;
  top += height;
  marginTop += 0.5;
  // setTimeout(()=>{
  //   console.log(notificationComponentRefs.value[0].notificationHeight)

  // }, 1000)
}

function deleteNotification() {
  setTimeout(()=>{
    notifications.value.shift();
    top -= height;
    marginTop -= 0.5;
    for (let i of notifications.value) {
      i.props.top -= (height+0.5);
    }
  }, timeout)
}

defineExpose({
  notifications
})
</script>
<template>
    <transition-group name="list" tag="div">
      <!-- <component v-for="notification in notifications" :key="notification.key" :is="notification.component" v-bind="notification.props" ref="notificationComponentList"></component> -->
      <Notification 
        v-for="notification in notifications" 
        :key="notification.key" 
        :status="notification.props.status"
        :text="notification.props.text"
        :height="notification.props.height"
        :top="notification.props.top"
        ref="notificationComponentRefs"
      />
    </transition-group>
</template>
<style scoped>
.temp {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  width: 15rem;
}

.list-enter-active,
.list-leave-active {
  opacity: 1;
  transform: scale(1);
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.6);
}
</style>