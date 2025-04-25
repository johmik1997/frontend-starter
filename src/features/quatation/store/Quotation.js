import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useQuotation = defineStore('useQuotation', () => {
    const quotations = ref([])
    const done = ref(false)

    function setDone(val) {
        done.value = val
    }

    function getAll() {
        return quotations.value
    }

    function reset() {
        quotations.value = []
        done.value = false
    }

    function add(quotation) {
        quotations.value.unshift(quotation)
    }
    
    function set(data) {
        console.log('Setting store data:', data)
        quotations.value = Array.isArray(data) ? data : (data || [])
    }

    function update(id, updatedQuotation) {
        const idx = quotations.value.findIndex(el => el.quotationUuid === id)
        
        if(idx === -1) {
            console.warn('Quotation not found:', id)
            return
        }

        // Create a new object with the updated values
        const newQuotation = {
            ...quotations.value[idx],
            ...updatedQuotation,
            quotationStatus: updatedQuotation.quotationStatus || quotations.value[idx].quotationStatus
        }

        // Create a new array with the updated quotation
        const newQuotations = [...quotations.value]
        newQuotations[idx] = newQuotation

        // Update the store
        quotations.value = newQuotations
        
        console.log('Updated quotation:', newQuotation)
    }

    function remove(id) {
        const idx = quotations.value.findIndex(el => el.quotationUuid === id)
        if(idx > -1) {
            quotations.value.splice(idx, 1)
        }
    }

    return { 
        quotations, 
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



