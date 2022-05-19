import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { firestoreDb } from "@/infra/firebase";
import { setDb } from "@/infra/setFirebase";

import App from './App.vue'
import './index.css'
import router from './router'

setDb({ _db: firestoreDb });

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
