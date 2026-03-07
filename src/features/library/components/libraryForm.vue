<script setup>
import Input from '@/components/new_form_elements/Input.vue';
import Select from '@/components/new_form_elements/Select.vue';
import Form from '@/components/new_form_builder/Form.vue';

const props = defineProps({
    // These should be the Admin users fetched from getAllAdminUsers
    admins: {
        type: Array,
        default: () => [],
    },
    library: {
        type: Object,
        default: () => ({}),
    }
})
</script>

<template>
    <Form class="grid grid-cols-1 md:grid-cols-3 gap-5 mt-3 p-6" id="libraryform" :inner="false">
        <Input name="name" label="Library Name" :value="library?.name || ''" 
            :attributes="{ placeholder: 'Enter Library Name' }" />
            
        <Input name="location" label="Library Location" :value="library?.location || ''" 
            :attributes="{ placeholder: 'Enter Library Location' }" />
            
        <Input name="campus" label="Library Campus" :value="library?.campus || ''" 
            :attributes="{ placeholder: 'Enter Library Campus' }" />

        <Input name="phone" label="Mobile Phone" :value="library?.phone || ''" 
            validation="required|phone"
            :attributes="{ placeholder: 'Mobile phone' }" />

        <Select :obj="true" name="adminUuid" label="Assign Admin" validation="required" 
            :value="library?.adminUuid || ''"
            :options="admins.map(admin => ({ label: admin.fullName || admin.name, value: admin.uuid }))" 
            :attributes="{ placeholder: 'Select Admin' }">
        </Select>
   
        <Select name="libraryStatus" label="Library Status" :value="library?.libraryStatus || ''" 
            validation="required"
            :options="['ACTIVE', 'HISTORY', 'SUSPENDED', 'PENDING']" 
            :attributes="{ placeholder: 'Status' }">
        </Select>
    </Form>
</template>