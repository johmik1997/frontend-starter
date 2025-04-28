import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useInsurance = defineStore('useInsurance', () => {
    const insurances = ref([])
    const done = ref(false)

    function setDone(val) {
        done.value = val
    }

    function getAll() {
        return insurances.value
    }

    function reset() {
        insurances.value = []
        done.value = false
    }

    function add(insurance) {
        insurances.value.unshift(insurance)
    }
    
    function set(data) {
        console.log('Setting store data:', data)
        insurances.value = Array.isArray(data) ? data : (data || [])
    }

    function update(id, updatedinsurance) {
        const idx = insurances.value.findIndex(el => el.insuranceUuid === id)
        
        if(idx === -1) {
            console.warn('insurance not found:', id)
            return
        }

        // Create a new object with the updated values
        const newinsurance = {
            ...insurances.value[idx],
            ...updatedinsurance,
            insurancestatus: updatedinsurance.insurancestatus || insurances.value[idx].insurancestatus
        }

        // Create a new array with the updated insurance
        const newinsurances = [...insurances.value]
        newinsurances[idx] = newinsurance

        // Update the store
        insurances.value = newinsurances
        
        console.log('Updated insurance:', newinsurance)
    }

    function remove(id) {
        const idx = insurances.value.findIndex(el => el.insuranceUuid === id)
        if(idx > -1) {
            insurances.value.splice(idx, 1)
        }
    }

    return { 
        insurances, 
        set, 
        remove, 
        getAll, 
        done, 
        setDone, 
        reset, 
        add, 
        update 
    }
})



