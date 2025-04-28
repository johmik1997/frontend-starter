import { defineStore } from 'pinia'
import { ref } from 'vue'

export const  usePerscription = defineStore('usePerscription', () => {
	const Perscriptions = ref([])
  const done = ref(false)

  function setDone(val) {
    done.value = val
  }

  function getAll() {
    
    return Perscriptions.value=[]
  }

  function reset() {
    Perscriptions.value = []
    done.value = false
  }

  function add(prescription) {
    Perscriptions.value.unshift(prescription)
  }
  
  function set(data) {
		console.log(data, 'herer')
    
    Perscriptions.value = Array.isArray(data) ? data : (data.Perscriptions || [])
  }

  function update(id, prescription) {
    console.log(prescription);
    
    const idx = Perscriptions.value.findIndex(el => el.ernpId == id)

    if(idx == -1) return 

    Perscriptions.value.splice(idx, 1, prescription)
  }

  function changeAmount(id, amount) {
    const idx = Perscriptions.value.findIndex(el => el.ernpId == id)

    if(idx > -1) {
      Perscriptions.value[idx].totalAmount = amount
    }
  }
  
  function remove(id) {
    const idx = Perscriptions.value.findIndex(el => el.ernpId == id)

    if(idx > -1) {
      Perscriptions.value.splice(idx, 1)
    } 
  }

  return { Perscriptions, set, remove, getAll, done, setDone, reset, add, update }
})