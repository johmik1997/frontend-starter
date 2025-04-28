import { defineStore } from 'pinia'
import { ref } from 'vue'

export const  useCustomers = defineStore('useCustomers', () => {
    const customers = ref([])
  const done = ref(false)

  function setDone(val) {
    done.value = val
  }

  function getAll() {
    
    return customers.value={}
  }

  function reset() {
    customers.value = []
    done.value = false
  }

  function add(prescription) {
    customers.value.unshift(prescription)
  }
  
  function set(data) {
        console.log(data, 'herer')
    
    customers.value = Array.isArray(data) ? data : (data || [])
  }

  function update(id, prescription) {
    console.log(prescription);
    
    const idx = customers.value.findIndex(el => el.ernpId == id)

    if(idx == -1) return 

    customers.value.splice(idx, 1, prescription)
  }

  function changeAmount(id, amount) {
    const idx = customers.value.findIndex(el => el.ernpId == id)

    if(idx > -1) {
      customers.value[idx].totalAmount = amount
    }
  }
  
  function remove(id) {
    const idx = customers.value.findIndex(el => el.ernpId == id)

    if(idx > -1) {
      customers.value.splice(idx, 1)
    } 
  }

  return { customers, set, remove, getAll, done, setDone, reset, add, update }
})